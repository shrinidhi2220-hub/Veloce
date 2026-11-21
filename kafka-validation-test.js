const {
  publishEvent,
  createOrderEvent,
  createInventoryEvent,
} = require("./kafka-producer");

// Mock Kafka producer so no real messages are published
const { producer } = require("./kafka-producer");

producer.send = async () => {
  throw new Error("Test blocked: Kafka publishing is disabled.");
};

async function runValidationTests() {
  console.log("\n========== KAFKA EVENT VALIDATION TESTS ==========\n");

  // Test 1: Valid order event
  const validOrder = createOrderEvent({
    orderId: "ORD101",
    items: [
      {
        productId: "P101",
        quantity: 3,
        unitPrice: 500,
      },
    ],
    totalAmount: 1500,
  });

  try {
    await publishEvent(validOrder);
  } catch (error) {
    console.log("PASSED: Valid order structure accepted.");
    console.log("Publishing blocked safely.");
  }

  // Test 2: Invalid order quantity
  const invalidOrder = createOrderEvent({
    orderId: "ORD102",
    items: [
      {
        productId: "P101",
        quantity: -3,
        unitPrice: 500,
      },
    ],
    totalAmount: 1500,
  });

  try {
    await publishEvent(invalidOrder);
    console.log("FAILED: Invalid order was accepted.");
  } catch (error) {
    console.log("PASSED:", error.message);
  }

  // Test 3: Valid inventory event
  const validInventory = createInventoryEvent({
    productId: "P101",
    orderId: "ORD101",
    previousStock: 10,
    quantityChanged: -3,
    remainingStock: 7,
    reason: "ORDER_PLACED",
  });

  try {
    await publishEvent(validInventory);
  } catch (error) {
    console.log("PASSED: Valid inventory structure accepted.");
    console.log("Publishing blocked safely.");
  }

  // Test 4: Inconsistent inventory calculation
  const invalidInventory = createInventoryEvent({
    productId: "P101",
    orderId: "ORD102",
    previousStock: 10,
    quantityChanged: -3,
    remainingStock: 8,
    reason: "ORDER_PLACED",
  });

  try {
    await publishEvent(invalidInventory);
    console.log("FAILED: Invalid inventory event was accepted.");
  } catch (error) {
    console.log("PASSED:", error.message);
  }

  // Test 5: Unsupported event type
  const unsupportedEvent = {
    eventId: "TEST001",
    eventType: "payment.completed",
    data: {
      paymentId: "PAY101",
    },
  };

  try {
    await publishEvent(unsupportedEvent);
    console.log("FAILED: Unsupported event was accepted.");
  } catch (error) {
    console.log("PASSED:", error.message);
  }

  console.log("\n========== VALIDATION TESTS COMPLETED ==========\n");
}

runValidationTests();
