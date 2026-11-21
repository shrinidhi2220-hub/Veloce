require("dotenv").config();

const fs = require("fs");
const { Kafka } = require("kafkajs");

// Kafka configuration
const kafka = new Kafka({
  clientId: "veloce-member3-consumer",
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

// Consumer configuration
const consumer = kafka.consumer({
  groupId: "veloce-member3-consumer-group",
});

let isConnected = false;
let isShuttingDown = false;

// Validate incoming event
function validateEvent(event) {
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
      throw new Error("Invalid order event data.");
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
        throw new Error("Invalid order item.");
      }
    }
  } else if (event.eventType === "inventory.updated") {
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
      throw new Error("Invalid inventory event data.");
    }

    if (previousStock + quantityChanged !== remainingStock) {
      throw new Error("Inconsistent inventory calculation.");
    }
  } else {
    throw new Error("Unsupported event type: " + event.eventType);
  }

  return true;
}

// Process incoming message
async function processMessage({ topic, partition, message }) {
  try {
    if (!message.value) {
      throw new Error("Empty Kafka message.");
    }

    const rawMessage = message.value.toString();

    // Parse JSON
    let event;

    try {
      event = JSON.parse(rawMessage);
    } catch {
      throw new Error("Malformed JSON message.");
    }

    // Validate event
    validateEvent(event);

    console.log("\n========== EVENT RECEIVED ==========");
    console.log("Topic:", topic);
    console.log("Partition:", partition);
    console.log("Offset:", message.offset);
    console.log("Message Key:", message.key?.toString() || "None");
    console.log("Event Type:", event.eventType);
    console.log("Event ID:", event.eventId);
    console.log("Occurred At:", event.occurredAt || "Not provided");
    console.log("Event Data:");
    console.log(JSON.stringify(event.data, null, 2));
    console.log("====================================\n");
  } catch (error) {
    console.error("\nMESSAGE PROCESSING FAILED");
    console.error("Reason:", error.message);
    console.error("Offset:", message.offset);
    console.error("The consumer will continue listening.\n");
  }
}

// Start consumer
async function startConsumer() {
  try {
    await consumer.connect();
    isConnected = true;

    console.log("Kafka Consumer Connected!");

    await consumer.subscribe({
      topic: "veloce-kafka",
      fromBeginning: true,
    });

    console.log("Listening for Kafka events...\n");

    await consumer.run({
      eachMessage: async (payload) => {
        await processMessage(payload);
      },
    });
  } catch (error) {
    console.error("Consumer failed:", error.message);

    if (isConnected) {
      await consumer.disconnect().catch(() => {});
      isConnected = false;
    }
  }
}

// Graceful shutdown
async function shutdown() {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log("\nStopping Kafka consumer...");

  if (isConnected) {
    try {
      await consumer.disconnect();
      console.log("Consumer disconnected.");
    } catch (error) {
      console.error("Disconnect failed:", error.message);
    }

    isConnected = false;
  }

  process.exit(0);
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

startConsumer();
