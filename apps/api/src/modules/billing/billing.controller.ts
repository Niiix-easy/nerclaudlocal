import { Controller, Post, Param } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('api/billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('cycles/:cycleId/rate')
  async rateCycle(@Param('cycleId') cycleId: string) {
    return this.billingService.rateCycle(cycleId);
  }
}
