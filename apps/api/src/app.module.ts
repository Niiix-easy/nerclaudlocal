import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./modules/health/health.module";
import { UsageModule } from "./modules/usage/usage.module";
import { BillingModule } from "./modules/billing/billing.module";
import { InvoicesModule } from "./modules/invoices/invoices.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { PlansModule } from "./modules/plans/plans.module";
import { ApiKeysModule } from "./modules/api-keys/api-keys.module";
import { AuditModule } from "./modules/audit/audit.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    PlansModule,
    SubscriptionsModule,
    UsageModule,
    BillingModule,
    InvoicesModule,
    PaymentsModule,
    ApiKeysModule,
    AuditModule
  ]
})
export class AppModule {}
