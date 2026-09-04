import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UsageService } from "./usage.service";
import { CreateUsageEventDto } from "./dto/create-usage-event.dto";

@Controller("usage")
export class UsageController {
  constructor(private readonly service: UsageService) {}

  @Post("events")
  ingest(@Body() dto: CreateUsageEventDto) {
    return this.service.ingest(dto);
  }

  @Get("summary")
  summary(
    @Query("organizationId") organizationId: string,
    @Query("from") from: string,
    @Query("to") to: string
  ) {
    return this.service.summary(organizationId, new Date(from), new Date(to));
  }
}
