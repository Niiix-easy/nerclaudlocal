import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@neer/database";
import { CreateUsageEventDto } from "./dto/create-usage-event.dto";

@Injectable()
export class UsageService {
  async ingest(dto: CreateUsageEventDto) {
    const existing = await prisma.usageEvent.findUnique({ where: { eventId: dto.eventId } });
    if (existing) return { accepted: true, duplicate: true, event: existing };

    const meter = await prisma.meter.findUnique({ where: { slug: dto.meter } });
    if (!meter) throw new NotFoundException(`Meter ${dto.meter} not found`);

    try {
      const event = await prisma.usageEvent.create({
        data: {
          eventId: dto.eventId,
          organizationId: dto.organizationId,
          projectId: dto.projectId,
          meterId: meter.id,
          quantity: BigInt(dto.quantity),
          occurredAt: new Date(dto.timestamp),
          source: dto.source,
          metadata: dto.metadata
        }
      });
      return { accepted: true, duplicate: false, event };
    } catch (e: any) {
      if (e?.code === "P2002") throw new ConflictException("Usage event already exists");
      throw e;
    }
  }

  async summary(organizationId: string, from: Date, to: Date) {
    const rows = await prisma.usageEvent.groupBy({
      by: ["meterId"],
      where: { organizationId, occurredAt: { gte: from, lt: to } },
      _sum: { quantity: true }
    });
    return rows;
  }
}
