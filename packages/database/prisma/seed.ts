import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const plans = [
  { slug: "free", name: "Free", price: 0 },
  { slug: "developer", name: "Developer", price: 1900 },
  { slug: "starter", name: "Starter", price: 4900 },
  { slug: "pro", name: "Pro", price: 9900 },
  { slug: "business", name: "Business", price: 24900 },
  { slug: "scale", name: "Scale", price: 79900 },
  { slug: "enterprise", name: "Enterprise", price: 0 }
];

const meters = [
  ["database.storage", "Database Storage", "GB", "MAX"],
  ["database.compute", "Database Compute", "HOUR", "SUM"],
  ["storage.capacity", "Storage", "GB", "MAX"],
  ["storage.bandwidth", "Bandwidth", "GB", "SUM"],
  ["functions.invocations", "Function Invocations", "INVOCATION", "SUM"],
  ["functions.compute", "Function Compute", "SECOND", "SUM"],
  ["redis.gb_hours", "Redis", "GB_HOUR", "SUM"],
  ["realtime.messages", "Realtime Messages", "MESSAGE", "SUM"],
  ["realtime.connection_hours", "Realtime Connections", "HOUR", "SUM"],
  ["compute.cpu_hours", "CPU", "CPU_HOUR", "SUM"],
  ["compute.memory_gb_hours", "Memory", "GB_HOUR", "SUM"],
  ["ai.input_tokens", "AI Input Tokens", "TOKEN", "SUM"],
  ["ai.output_tokens", "AI Output Tokens", "TOKEN", "SUM"]
] as const;

async function main() {
  for (const [slug, name] of meters) {
    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: { slug, name, active: true }
    });
    await prisma.meter.upsert({
      where: { slug },
      update: {},
      create: {
        productId: product.id,
        slug,
        name,
        unit: "unit",
        aggregation: "SUM"
      }
    });
  }

  for (const p of plans) {
    const plan = await prisma.plan.upsert({
      where: { slug: p.slug },
      update: { name: p.name },
      create: { slug: p.slug, name: p.name }
    });

    const version = await prisma.planVersion.upsert({
      where: { planId_version: { planId: plan.id, version: 1 } },
      update: {},
      create: { planId: plan.id, version: 1, effectiveAt: new Date() }
    });

    await prisma.price.create({
      data: {
        planVersionId: version.id,
        currency: "USD",
        type: "flat",
        amount: BigInt(p.price),
        interval: "month"
      }
    }).catch(() => {});

    const limits: Record<string, string> = {
      projects:
        p.slug === "free" ? "5" :
        p.slug === "developer" ? "10" :
        p.slug === "starter" ? "25" :
        p.slug === "pro" ? "100" :
        "unlimited"
    };

    for (const [key, value] of Object.entries(limits)) {
      await prisma.planEntitlement.create({
        data: {
          planId: plan.id,
          planVersionId: version.id,
          key,
          value
        }
      }).catch(() => {});
    }
  }

  console.log("Neer-Data-Base seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
