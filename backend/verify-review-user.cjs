require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const userId = "eac290d6-9190-4116-a1f2-5900a85dfd9f";

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            role: true
        }
    });

    console.log("Authenticated customer in database:");
    console.log(user);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
