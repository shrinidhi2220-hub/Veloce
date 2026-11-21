require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const duplicates = await prisma.$queryRaw`
    SELECT
      "userId",
      "action",
      "reference",
      COUNT(*)::int AS "count"
    FROM "veloce"."RewardLedger"
    WHERE "reference" IS NOT NULL
    GROUP BY "userId", "action", "reference"
    HAVING COUNT(*) > 1
  `;

  const total = await prisma.rewardLedger.count();

  console.log("Total reward ledger entries:", total);
  console.log("Duplicate award combinations:", duplicates.length);

  if (duplicates.length > 0) {
    console.table(duplicates);
  } else {
    console.log("No duplicate combinations found. Safe to proceed.");
  }
}

main()
  .catch(error => {
    console.error("Audit failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
