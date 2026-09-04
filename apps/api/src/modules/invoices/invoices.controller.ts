import { Controller, Get, Param, Query } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
@Controller("invoices")
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}
  @Get()
  list(@Query("organizationId") organizationId: string) { return this.service.list(organizationId); }
  @Get(":id")
  get(@Param("id") id: string, @Query("organizationId") organizationId: string) {
    return this.service.get(organizationId, id);
  }
}
