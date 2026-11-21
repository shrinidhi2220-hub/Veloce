require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();

        console.log("DATABASE CONNECTED SUCCESSFULLY");
        console.log("--------------------------------");

        const products = await prisma.product.count();
        const users = await prisma.user.count();
        const orders = await prisma.order.count();

        console.log("Products:", products);
        console.log("Users:", users);
        console.log("Orders:", orders);

    } catch (error) {
        console.error("DATABASE CHECK FAILED:", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

main();
