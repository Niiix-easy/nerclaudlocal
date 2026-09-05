import { Module } from '@nestjs/common';
import { BillingModule } from './modules/billing/billing.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SystemModule } from './modules/system/system.module';

@Module({
  imports: [
    BillingModule,
    InvoicesModule,
    SubscriptionsModule,
    PaymentsModule,
    SystemModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
