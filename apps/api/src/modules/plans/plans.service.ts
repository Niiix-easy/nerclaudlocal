import { Injectable } from "@nestjs/common";
import { prisma } from "@neer/database";

@Injectable()
export class PlansService {
  async list() {
    return prisma.plan.findMany({
      where: { active: true },
      include: {
        versions: {
          where: { retiredAt: null },
          orderBy: { version: "desc" },
          take: 1,
          include: { prices: true, entitlements: true }
        }
      }
    });
  }

  async get(slug: string) {
    return prisma.plan.findUnique({
      where: { slug },
      include: { versions: { include: { prices: true, entitlements: true } } }
    });
  }
}
