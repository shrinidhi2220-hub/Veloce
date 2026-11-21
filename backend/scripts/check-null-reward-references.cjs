require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const nullReferences = await prisma.rewardLedger.count({
    where: { reference: null }
  });

  console.log("Reward entries with NULL reference:", nullReferences);
}

main()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
