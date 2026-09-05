import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async processPayment(@Body() data: {
      organizationId: string;
      invoiceId: string;
      amount: number;
      method: string;
  }) {
    return this.paymentsService.processPayment(data);
  }
}
