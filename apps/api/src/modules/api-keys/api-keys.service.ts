import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash, randomBytes } from "crypto";
import { prisma } from "@neer/database";

@Injectable()
export class ApiKeysService {
  async create(organizationId: string, projectId: string, userId: string, name: string, scopes: string[]) {
    const raw = `ndb_live_${randomBytes(32).toString("hex")}`;
    const prefix = raw.slice(0, 16);
    const keyHash = createHash("sha256").update(raw).digest("hex");

    const key = await prisma.apiKey.create({
      data: {
        organizationId,
        projectId,
        createdById: userId,
        name,
        prefix,
        keyHash,
        scopes: { create: scopes.map(scope => ({ scope })) }
      },
      include: { scopes: true }
    });

    return { ...key, secret: raw };
  }

  async revoke(organizationId: string, id: string) {
    const key = await prisma.apiKey.findFirst({ where: { id, organizationId } });
    if (!key) throw new NotFoundException("API key not found");
    return prisma.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
  }
}
