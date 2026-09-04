import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@neer/database";
@Injectable()
export class InvoicesService {
  async list(organizationId: string) {
    return prisma.invoice.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: { lines: true, payments: true }
    });
  }
  async get(organizationId: string, id: string) {
    const invoice = await prisma.invoice.findFirst({
      where: { id, organizationId },
      include: { lines: true, payments: true }
    });
    if (!invoice) throw new NotFoundException("Invoice not found");
    return invoice;
  }
}
