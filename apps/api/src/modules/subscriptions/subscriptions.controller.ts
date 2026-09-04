import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { IsString } from "class-validator";
import { SubscriptionsService } from "./subscriptions.service";

class CreateSubscriptionDto {
  @IsString() organizationId!: string;
  @IsString() planSlug!: string;
}

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}
  @Post()
  create(@Body() dto: CreateSubscriptionDto) {
    return this.service.create(dto.organizationId, dto.planSlug);
  }
  @Get()
  list(@Query("organizationId") organizationId: string) {
    return this.service.list(organizationId);
  }
}
