import { Controller, Param, Post } from "@nestjs/common";
import { BillingService } from "./billing.service";
@Controller("billing")
export class BillingController {
  constructor(private readonly service: BillingService) {}
  @Post("cycles/:cycleId/rate")
  rate(@Param("cycleId") cycleId: string) { return this.service.rateCycle(cycleId); }
}
