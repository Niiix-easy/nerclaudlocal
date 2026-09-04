import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@neer/database";

@Injectable()
export class BillingService {
  async rateCycle(cycleId: string) {
    const cycle = await prisma.billingCycle.findUnique({
      where: { id: cycleId },
      include: { subscription: { include: { plan: { include: { versions: { where: { retiredAt: null }, orderBy: { version: "desc" }, take: 1, include: { prices: { include: { meters: true } } } } } } } } }
    });

    if (!cycle) throw new NotFoundException("Billing cycle not found");
    if (cycle.status === "CLOSED" || cycle.status === "INVOICED") {
      throw new BadRequestException("Billing cycle already finalized");
    }

    const start = cycle.periodStart;
    const end = cycle.periodEnd;
    const events = await prisma.usageEvent.findMany({
      where: { organizationId: cycle.organizationId, occurredAt: { gte: start, lt: end } },
      include: { meter: true }
    });

    const byMeter = new Map<string, bigint>();
    for (const event of events) {
      byMeter.set(event.meterId, (byMeter.get(event.meterId) ?? 0n) + event.quantity);
    }

    const version = cycle.subscription.plan.versions[0];
    const lines: { description: string; meterId: string; quantity: bigint; unitAmount: bigint; amount: bigint }[] = [];

    if (version) {
      for (const price of version.prices) {
        for (const meterPrice of price.meters) {
          const consumed = byMeter.get(meterPrice.meterId) ?? 0n;
          const billable = consumed > meterPrice.included ? consumed - meterPrice.included : 0n;
          const amount = billable * meterPrice.unitPrice;
          if (amount > 0n) {
            lines.push({
              description: `Usage: ${meterPrice.meterId}`,
              meterId: meterPrice.meterId,
              quantity: billable,
              unitAmount: meterPrice.unitPrice,
              amount
            });
          }
        }
      }
    }

    const flatPrice = version?.prices.find(p => p.type === "flat");
    const subtotal = (flatPrice?.amount ?? 0n) + lines.reduce((s, l) => s + l.amount, 0n);

    await prisma.$transaction(async tx => {
      await tx.billingCycle.update({
        where: { id: cycle.id },
        data: { status: "RATED", ratedAt: new Date() }
      });

      const invoiceNumber = `NDB-${new Date().getFullYear()}-${cycle.id.slice(-8).toUpperCase()}`;

      const invoice = await tx.invoice.upsert({
        where: { billingCycleId: cycle.id },
        update: { subtotal, total: subtotal },
        create: {
          organizationId: cycle.organizationId,
          subscriptionId: cycle.subscriptionId,
          billingCycleId: cycle.id,
          number: invoiceNumber,
          currency: cycle.subscription.currency,
          subtotal,
          total: subtotal,
          status: "OPEN"
        }
      });

      await tx.invoiceLine.deleteMany({ where: { invoiceId: invoice.id } });

      if (flatPrice?.amount) {
        await tx.invoiceLine.create({
          data: {
            invoiceId: invoice.id,
            description: `Subscription: ${cycle.subscription.plan.name}`,
            quantity: 1n,
            unitAmount: flatPrice.amount,
            amount: flatPrice.amount
          }
        });
      }

      for (const line of lines) {
        await tx.invoiceLine.create({
          data: {
            invoiceId: invoice.id,
            description: line.description,
            meterId: line.meterId,
            quantity: line.quantity,
            unitAmount: line.unitAmount,
            amount: line.amount
          }
        });
      }

      await tx.billingCycle.update({
        where: { id: cycle.id },
        data: { status: "INVOICED", invoicedAt: new Date() }
      });
    });

    return prisma.invoice.findUnique({
      where: { billingCycleId: cycle.id },
      include: { lines: true }
    });
  }
}
