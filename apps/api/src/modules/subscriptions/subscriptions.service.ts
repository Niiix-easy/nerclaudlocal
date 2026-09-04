import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@neer/database";

@Injectable()
export class SubscriptionsService {
  async create(organizationId: string, planSlug: string) {
    const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
    if (!plan) throw new NotFoundException("Plan not found");

    const existing = await prisma.subscription.findFirst({
      where: { organizationId, status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } }
    });
    if (existing) throw new BadRequestException("Organization already has an active subscription");

    const start = new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    return prisma.$transaction(async tx => {
      const subscription = await tx.subscription.create({
        data: {
          organizationId,
          planId: plan.id,
          currency: "USD",
          currentPeriodStart: start,
          currentPeriodEnd: end
        }
      });

      await tx.billingCycle.create({
        data: {
          organizationId,
          subscriptionId: subscription.id,
          periodStart: start,
          periodEnd: end
        }
      });

      return subscription;
    });
  }

  async list(organizationId: string) {
    return prisma.subscription.findMany({
      where: { organizationId },
      include: { plan: true, cycles: true }
    });
  }
}
