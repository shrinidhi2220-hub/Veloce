require("dotenv").config();

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Kafka, logLevel } = require("kafkajs");

async function main() {
  const required = [
    "KAFKA_BOOTSTRAP_SERVERS",
    "KAFKA_USERNAME",
    "KAFKA_PASSWORD_BASE64",
    "KAFKA_CA_PATH",
    "KAFKA_ORDERS_TOPIC"
  ];

  for (const key of required) {
    if (!process.env[key]?.trim()) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  const caPath = path.resolve(process.env.KAFKA_CA_PATH);

  if (!fs.existsSync(caPath)) {
    throw new Error("Kafka CA certificate file not found.");
  }

  const password = Buffer
    .from(process.env.KAFKA_PASSWORD_BASE64, "base64")
    .toString("utf8");

  if (!password) {
    throw new Error("Kafka password could not be decoded.");
  }

  const brokers = process.env.KAFKA_BOOTSTRAP_SERVERS
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);

  const kafka = new Kafka({
    clientId: "veloce-backend-connection-test",
    brokers,
    ssl: {
      ca: [fs.readFileSync(caPath, "utf8")],
      rejectUnauthorized: true
    },
    sasl: {
      mechanism: "scram-sha-256",
      username: process.env.KAFKA_USERNAME,
      password
    },
    connectionTimeout: 10000,
    requestTimeout: 30000,
    logLevel: logLevel.ERROR
  });

  const producer = kafka.producer({
    allowAutoTopicCreation: false
  });

  let connected = false;

  try {
    console.log("Connecting to Aiven Kafka...");

    await producer.connect();
    connected = true;

    console.log("KAFKA CONNECTION SUCCESSFUL");

    const eventId = crypto.randomUUID();
    const topic = process.env.KAFKA_ORDERS_TOPIC;

    const event = {
      eventId,
      eventType: "VELOCE_KAFKA_CONNECTION_TEST",
      source: "veloce-backend",
      timestamp: new Date().toISOString(),
      message: "VELOCE backend Kafka connection verified"
    };

    const result = await producer.send({
      topic,
      acks: -1,
      messages: [{
        key: eventId,
        value: JSON.stringify(event)
      }]
    });

    console.log("TEST EVENT PUBLISHED SUCCESSFULLY");
    console.log(JSON.stringify({
      topic,
      eventId,
      partition: result[0].partition,
      offset: result[0].baseOffset
    }, null, 2));

  } finally {
    password && Buffer.from(password).fill(0);

    if (connected) {
      await producer.disconnect();
    }
  }
}

main().catch(error => {
  console.error("KAFKA TEST FAILED:", error.message);
  process.exitCode = 1;
});
