import { Controller, Get, Param } from "@nestjs/common";
import { PlansService } from "./plans.service";
@Controller("plans")
export class PlansController {
  constructor(private readonly service: PlansService) {}
  @Get() list() { return this.service.list(); }
  @Get(":slug") get(@Param("slug") slug: string) { return this.service.get(slug); }
}
