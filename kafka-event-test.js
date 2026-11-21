
const {
    connectProducer,
    publishEvent,
    createOrderEvent,
    createInventoryEvent,
    producer
} = require("./kafka-producer");

async function testKafkaEvents() {
    let connected = false;

    try {
        // Connect to Kafka
        await connectProducer();
        connected = true;

        // Create order event
        const orderEvent = createOrderEvent({
            orderId: "ORD101",
            items: [
                {
                    productId: "P101",
                    quantity: 3,
                    unitPrice: 500
                }
            ],
            totalAmount: 1500
        });

        // Create inventory event
        const inventoryEvent = createInventoryEvent({
            productId: "P101",
            orderId: "ORD101",
            previousStock: 10,
            quantityChanged: -3,
            remainingStock: 7,
            reason: "ORDER_PLACED"
        });

        // Publish both events
        await publishEvent(orderEvent);
        await publishEvent(inventoryEvent);

        console.log("\nBoth events published successfully!");

    } catch (error) {
        console.error("\nKafka test failed:", error.message);
    } finally {
        if (connected) {
            await producer.disconnect();
            console.log("Kafka Producer Disconnected.");
        }
    }
}

testKafkaEvents();
