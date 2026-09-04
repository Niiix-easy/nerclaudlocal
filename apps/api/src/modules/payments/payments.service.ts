import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@neer/database";

@Injectable()
export class PaymentsService {
  async create(organizationId: string, invoiceId: string, provider: string, providerId: string) {
    const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, organizationId } });
    if (!invoice) throw new NotFoundException("Invoice not found");
    if (invoice.status === "PAID") throw new BadRequestException("Invoice already paid");

    return prisma.$transaction(async tx => {
      const payment = await tx.payment.create({
        data: {
          organizationId,
          invoiceId,
          provider,
          providerId,
          amount: invoice.total,
          currency: invoice.currency,
          status: "SUCCEEDED"
        }
      });

      await tx.invoice.update({
        where: { id: invoice.id },
        data: { status: "PAID", paidAt: new Date() }
      });

      await tx.ledgerEntry.createMany({
        data: [
          {
            organizationId,
            account: "accounts_receivable",
            direction: "CREDIT",
            amount: invoice.total,
            currency: invoice.currency,
            referenceType: "payment",
            referenceId: payment.id
          },
          {
            organizationId,
            account: "cash",
            direction: "DEBIT",
            amount: invoice.total,
            currency: invoice.currency,
            referenceType: "payment",
            referenceId: payment.id
          }
        ]
      });

      return payment;
    });
  }
}
