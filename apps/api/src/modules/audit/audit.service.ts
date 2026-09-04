import { Injectable } from "@nestjs/common";
import { prisma } from "@neer/database";
@Injectable()
export class AuditService {
  list(organizationId: string) {
    return prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 200
    });
  }
}
