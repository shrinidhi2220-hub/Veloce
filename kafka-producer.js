require("dotenv").config();

const fs = require("fs");
const { randomUUID } = require("crypto");
const { Kafka } = require("kafkajs");

// Kafka configuration
const kafka = new Kafka({
  clientId: "veloce-member3",
  brokers: ["veloce-kafka-shreeshant1334-902f.h.aivencloud.com:12322"],
  connectionTimeout: 15000,
  authenticationTimeout: 15000,
  requestTimeout: 30000,

  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync(process.env.KAFKA_CA_PATH)],
    servername: "veloce-kafka-shreeshant1334-902f.h.aivencloud.com",
  },

  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});

const producer = kafka.producer();

// Connect producer
async function connectProducer() {
  try {
    await producer.connect();
    console.log("Kafka Producer Connected!");
  } catch (error) {
    console.error("Producer connection failed:", error.message);
    throw error;
  }
}

// Validate and publish events
async function publishEvent(event) {
  // Validate common event structure
  if (
    !event ||
    typeof event !== "object" ||
    !event.eventId ||
    !event.eventType ||
    !event.data ||
    typeof event.data !== "object" ||
    Array.isArray(event.data)
  ) {
    throw new Error("Invalid event structure.");
  }

  let messageKey;

  // Validate order.created event
  if (event.eventType === "order.created") {
    const { orderId, items, totalAmount } = event.data;

    if (
      typeof orderId !== "string" ||
      !orderId.trim() ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !Number.isFinite(totalAmount) ||
      totalAmount < 0
    ) {
      throw new Error("Invalid order.created event data.");
    }

    for (const item of items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !item.productId.trim() ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0 ||
        !Number.isFinite(item.unitPrice) ||
        item.unitPrice < 0
      ) {
        throw new Error("Invalid order item data.");
      }
    }

    messageKey = orderId;
  }

  // Validate inventory.updated event
  else if (event.eventType === "inventory.updated") {
    const {
      productId,
      previousStock,
      quantityChanged,
      remainingStock,
      reason,
    } = event.data;

    if (
      typeof productId !== "string" ||
      !productId.trim() ||
      !Number.isSafeInteger(previousStock) ||
      previousStock < 0 ||
      !Number.isSafeInteger(quantityChanged) ||
      !Number.isSafeInteger(remainingStock) ||
      remainingStock < 0 ||
      typeof reason !== "string" ||
      !reason.trim()
    ) {
      throw new Error("Invalid inventory.updated event data.");
    }

    if (previousStock + quantityChanged !== remainingStock) {
      throw new Error("Inventory stock calculation is inconsistent.");
    }

    messageKey = productId;
  }

  // Reject unsupported events
  else {
    throw new Error("Unsupported event type.");
  }

  // Publish validated event
  try {
    await producer.send({
      topic: "veloce-kafka",
      messages: [
        {
          key: messageKey,
          value: JSON.stringify(event),
        },
      ],
    });

    console.log("Event published:", event.eventType);
  } catch (error) {
    console.error("Event publishing failed:", error.message);
    throw error;
  }
}

// Create order event
function createOrderEvent(orderData) {
  return {
    eventId: randomUUID(),
    eventType: "order.created",
    occurredAt: new Date().toISOString(),
    data: orderData,
  };
}

// Create inventory event
function createInventoryEvent(inventoryData) {
  return {
    eventId: randomUUID(),
    eventType: "inventory.updated",
    occurredAt: new Date().toISOString(),
    data: inventoryData,
  };
}

// Export functions
module.exports = {
  connectProducer,
  publishEvent,
  createOrderEvent,
  createInventoryEvent,
  producer,
};
