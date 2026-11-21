require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const orderId = "c4d29dc4-3af3-464f-9cb1-2d305cb0df1e";

async function main() {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
    });

    const events = await prisma.inventoryEvent.findMany({
        where: { orderId }
    });

    const product = await prisma.product.findUnique({
        where: { id: "veloce-demo-001" }
    });

    const cart = await prisma.cart.findUnique({
        where: { sessionId: "veloce-cart-test-20261118" },
        include: { items: true }
    });

    console.log("\n===== VELOCE ORDER VERIFICATION =====");
    console.log("Order exists:", !!order);
    console.log("Order number:", order?.orderNumber);
    console.log("Order total:", order?.totalAmount);
    console.log("Order items:", order?.items.length);
    console.log("Inventory events:", events.length);

    for (const event of events) {
        console.log({
            type: event.eventType,
            quantity: event.quantity,
            previousStock: event.previousStock,
            newStock: event.newStock
        });
    }

    console.log("Current product stock:", product?.stock);
    console.log("Remaining cart items:", cart?.items.length);
}

main()
    .catch(error => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
