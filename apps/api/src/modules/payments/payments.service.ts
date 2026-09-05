import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class PaymentsService {
  async processPayment(data: {
      organizationId: string;
      invoiceId: string;
      amount: number;
      method: string;
  }) {
      // 1. Validate Invoice
      const invoice = await prisma.invoice.findUnique({
          where: { id: data.invoiceId }
      });

      if (!invoice) throw new BadRequestException('Invoice not found');
      if (invoice.status === 'PAID') throw new BadRequestException('Invoice already paid');

      // 2. Mock Payment processing
      const payment = await prisma.payment.create({
          data: {
              organizationId: data.organizationId,
              invoiceId: invoice.id,
              amount: BigInt(data.amount),
              currency: invoice.currency,
              status: 'SUCCEEDED',
              provider: 'mock_provider',
              providerId: 'mock_tx_id'
          }
      });

      // 3. Mark Invoice as paid
      await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'PAID' }
      });

      // 4. Update Billing Cycle if applicable
      await prisma.billingCycle.updateMany({
          where: { id: invoice.billingCycleId },
          data: { status: 'CLOSED', closedAt: new Date() }
      });

      return {
          ...payment,
          amount: payment.amount.toString()
      };
  }
}
