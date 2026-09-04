import { prisma } from "@neer/database";

async function processOpenCycles() {
  const cycles = await prisma.billingCycle.findMany({
    where: { status: "OPEN", periodEnd: { lte: new Date() } },
    take: 50
  });

  for (const cycle of cycles) {
    console.log(`Billing worker picked cycle ${cycle.id}`);
    // In production, delegate this to a durable queue and the BillingService.
  }
}

async function main() {
  console.log("Neer-Data-Base billing worker started");
  setInterval(() => processOpenCycles().catch(console.error), 60_000);
  await processOpenCycles();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
