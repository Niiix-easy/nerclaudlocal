export const locales = ["en-US", "pt-BR", "es", "fr", "de", "it", "ja", "ko", "zh-CN"] as const;
export type Locale = typeof locales[number];

export const messages: Record<Locale, Record<string, string>> = {
  "en-US": {
    "billing.title": "Billing",
    "billing.subscription": "Subscription",
    "billing.invoice": "Invoice",
    "billing.usage": "Usage",
    "billing.paid": "Paid",
    "billing.overdue": "Overdue"
  },
  "pt-BR": {
    "billing.title": "Cobrança",
    "billing.subscription": "Assinatura",
    "billing.invoice": "Fatura",
    "billing.usage": "Consumo",
    "billing.paid": "Paga",
    "billing.overdue": "Vencida"
  },
  "es": {
    "billing.title": "Facturación",
    "billing.subscription": "Suscripción",
    "billing.invoice": "Factura",
    "billing.usage": "Consumo",
    "billing.paid": "Pagada",
    "billing.overdue": "Vencida"
  },
  "fr": {
    "billing.title": "Facturation",
    "billing.subscription": "Abonnement",
    "billing.invoice": "Facture",
    "billing.usage": "Utilisation",
    "billing.paid": "Payée",
    "billing.overdue": "En retard"
  },
  "de": {
    "billing.title": "Abrechnung",
    "billing.subscription": "Abonnement",
    "billing.invoice": "Rechnung",
    "billing.usage": "Verbrauch",
    "billing.paid": "Bezahlt",
    "billing.overdue": "Überfällig"
  },
  "it": {
    "billing.title": "Fatturazione",
    "billing.subscription": "Abbonamento",
    "billing.invoice": "Fattura",
    "billing.usage": "Utilizzo",
    "billing.paid": "Pagata",
    "billing.overdue": "Scaduta"
  },
  "ja": {
    "billing.title": "請求",
    "billing.subscription": "サブスクリプション",
    "billing.invoice": "請求書",
    "billing.usage": "使用量",
    "billing.paid": "支払済み",
    "billing.overdue": "期限超過"
  },
  "ko": {
    "billing.title": "청구",
    "billing.subscription": "구독",
    "billing.invoice": "청구서",
    "billing.usage": "사용량",
    "billing.paid": "결제됨",
    "billing.overdue": "연체"
  },
  "zh-CN": {
    "billing.title": "计费",
    "billing.subscription": "订阅",
    "billing.invoice": "发票",
    "billing.usage": "用量",
    "billing.paid": "已支付",
    "billing.overdue": "逾期"
  }
};

export function t(locale: Locale, key: string): string {
  return messages[locale]?.[key] ?? messages["en-US"][key] ?? key;
}
