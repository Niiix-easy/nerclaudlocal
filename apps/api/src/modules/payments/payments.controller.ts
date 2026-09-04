import { Body, Controller, Post } from "@nestjs/common";
import { IsString } from "class-validator";
import { PaymentsService } from "./payments.service";

class CreatePaymentDto {
  @IsString() organizationId!: string;
  @IsString() invoiceId!: string;
  @IsString() provider!: string;
  @IsString() providerId!: string;
}

@Controller("payments")
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}
  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto.organizationId, dto.invoiceId, dto.provider, dto.providerId);
  }
}
