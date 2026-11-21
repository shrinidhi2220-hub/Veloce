require("dotenv").config();

const { randomUUID } = require("crypto");
const { PrismaClient } = require("@prisma/client");

const {
  drainOutboxOnce
} = require("../src/services/outboxPublisher");

const {
  disconnectKafkaProducer
} = require("../src/services/kafkaProducer");

const prisma = new PrismaClient();

async function main() {
  const topic = process.env.KAFKA_ORDERS_TOPIC;

  if (!topic) {
    throw new Error("KAFKA_ORDERS_TOPIC is missing");
  }

  const eventId = randomUUID();
  const eventType = "VELOCE_OUTBOX_SMOKE_TEST";

  const payload = {
    eventId,
    eventType,
    source: "veloce-outbox-smoke-test",
    timestamp: new Date().toISOString(),
    message: "PostgreSQL Outbox to Aiven Kafka verified"
  };

  const created = await prisma.outboxEvent.create({
    data: {
      eventId,
      eventType,
      aggregateType: "SYSTEM",
      aggregateId: eventId,
      topic,
      messageKey: eventId,
      payload
    }
  });

  console.log("OUTBOX EVENT CREATED");
  console.log("Event ID:", eventId);
  console.log("Initial status:", created.status);

  const drainResult = await drainOutboxOnce();

  const updated = await prisma.outboxEvent.findUnique({
    where: { id: created.id }
  });

  console.log("\n===== OUTBOX PUBLISH RESULT =====");
  console.log(JSON.stringify({
    claimed: drainResult.claimed,
    status: updated.status,
    attempts: updated.attempts,
    publishedAt: updated.publishedAt,
    lastError: updated.lastError
  }, null, 2));

  if (updated.status !== "PUBLISHED") {
    throw new Error(
      `Expected PUBLISHED but received ${updated.status}`
    );
  }

  console.log("\nOUTBOX TO KAFKA TEST PASSED!");
}

main()
  .catch(error => {
    console.error("\nOUTBOX TEST FAILED:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectKafkaProducer();
    await prisma.$disconnect();
  });
