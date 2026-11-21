require("dotenv").config();

const fs = require("fs");
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "veloce-member3-test",

  // Temporary IP workaround for DNS issues
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

async function testConnection() {
  const admin = kafka.admin();

  try {
    console.log("Connecting to Aiven Kafka...");

    await admin.connect();

    const topics = await admin.listTopics();

    console.log("KAFKA CONNECTION SUCCESSFUL!");
    console.log("Available topics:", topics);
  } catch (error) {
    console.error("Kafka test failed:", error.message);
  } finally {
    await admin.disconnect().catch(() => {});
  }
}

testConnection();
