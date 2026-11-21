require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.user.count();
    console.log("Existing users:", result);

    const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, column_default
        FROM information_schema.columns
        WHERE table_schema = 'veloce'
          AND table_name = 'User'
          AND column_name IN ('passwordHash', 'role')
        ORDER BY column_name;
    `;

    console.table(columns);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
