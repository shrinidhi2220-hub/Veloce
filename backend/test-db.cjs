require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.$queryRawUnsafe(
    "SELECT current_database() AS database, current_user AS username"
  );

  console.log("Database connection successful:");
  console.table(rows);
}

main()
  .catch((error) => {
    console.error("Database connection failed:");
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
