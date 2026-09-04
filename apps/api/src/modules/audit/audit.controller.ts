import { Controller, Get, Query } from "@nestjs/common";
import { AuditService } from "./audit.service";
@Controller("audit")
export class AuditController {
  constructor(private readonly service: AuditService) {}
  @Get()
  list(@Query("organizationId") organizationId: string) { return this.service.list(organizationId); }
}
