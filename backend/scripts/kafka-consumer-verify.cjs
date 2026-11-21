require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Kafka, logLevel } = require("kafkajs");

const expectedEventId =
  "99e12490-74bd-49ea-9aac-ad4c45c8544b";

async function main() {
  const caPath = path.resolve(process.env.KAFKA_CA_PATH);

  const password = Buffer
    .from(process.env.KAFKA_PASSWORD_BASE64, "base64")
    .toString("utf8");

  const kafka = new Kafka({
    clientId: "veloce-backend-consumer-verify",
    brokers: process.env.KAFKA_BOOTSTRAP_SERVERS.split(","),
    ssl: {
      ca: [fs.readFileSync(caPath, "utf8")],
      rejectUnauthorized: true
    },
    sasl: {
      mechanism: "scram-sha-256",
      username: process.env.KAFKA_USERNAME,
      password
    },
    connectionTimeout: 15000,
    requestTimeout: 30000,
    logLevel: logLevel.ERROR
  });

  const consumer = kafka.consumer({
    groupId: `veloce-backend-verify-${Date.now()}`
  });

  let connected = false;
  let timeout;

  try {
    await consumer.connect();
    connected = true;

    await consumer.subscribe({
      topic: process.env.KAFKA_ORDERS_TOPIC,
      fromBeginning: true
    });

    console.log("CONSUMER CONNECTED. SEARCHING FOR TEST EVENT...");

    const received = new Promise((resolve, reject) => {
      timeout = setTimeout(
        () => reject(new Error("Timed out waiting for test event")),
        30000
      );

      consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) return;

          try {
            const event = JSON.parse(message.value.toString());

            if (event.eventId === expectedEventId) {
              clearTimeout(timeout);
              resolve(event);
            }
          } catch (error) {
            console.error("Message parsing failed:", error.message);
          }
        }
      }).catch(reject);
    });

    const event = await received;

    console.log("MESSAGE CONSUMED AND VERIFIED");
    console.log(JSON.stringify(event, null, 2));

  } finally {
    clearTimeout(timeout);

    if (connected) {
      await consumer.disconnect();
    }
  }
}

main().catch(error => {
  console.error("CONSUMER TEST FAILED:", error.message);
  process.exitCode = 1;
});
