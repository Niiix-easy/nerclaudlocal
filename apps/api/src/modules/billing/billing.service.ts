import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class BillingService {
  async rateCycle(cycleId: string) {
    // 1. Fetch Cycle
    const cycle = await prisma.billingCycle.findUnique({
      where: { id: cycleId }
    });

    if (!cycle) {
      throw new NotFoundException(`Billing cycle ${cycleId} not found`);
    }

    // 2. Perform aggregation and rating (Simplified for mock implementation)
    // Normally we would query the usage aggregator for events within cycle bounds

    const totalUsageCost = 5000; // 50 USD
    const totalSubscriptionCost = 2000; // 20 USD

    // 3. Mark Cycle as RATED
    await prisma.billingCycle.update({
      where: { id: cycleId },
      data: {
        status: 'RATED',
        ratedAt: new Date()
      }
    });

    // 4. Generate Invoice (Draft)
    const invoice = await prisma.invoice.create({
      data: {
        organizationId: cycle.organizationId,
        billingCycleId: cycle.id,
        currency: 'USD',
        subtotal: BigInt(totalUsageCost + totalSubscriptionCost),
        tax: BigInt(0),
        discount: BigInt(0),
        total: BigInt(totalUsageCost + totalSubscriptionCost),
        status: 'DRAFT'
      }
    });

    return {
      success: true,
      cycleId,
      invoiceId: invoice.id,
      totalStr: invoice.total.toString(),
      status: 'RATED'
    };
  }
}
