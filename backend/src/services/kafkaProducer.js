const fs = require('fs');
const path = require('path');
const { Kafka, logLevel } = require('kafkajs');

let producer = null;
let connected = false;
let connecting = null;

function requiredEnv(name) {
  const value = process.env[name];

  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function getProducer() {
  if (producer) return producer;

  const brokers = requiredEnv('KAFKA_BOOTSTRAP_SERVERS')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  const username = requiredEnv('KAFKA_USERNAME');
  const passwordBase64 = requiredEnv('KAFKA_PASSWORD_BASE64');
  const caPath = path.resolve(requiredEnv('KAFKA_CA_PATH'));

  if (!fs.existsSync(caPath)) {
    throw new Error('Kafka CA certificate file does not exist');
  }

  const passwordBytes = Buffer.from(passwordBase64, 'base64');
  const password = passwordBytes.toString('utf8');
  passwordBytes.fill(0);

  if (!password) {
    throw new Error('Kafka password is empty or invalid');
  }

  const kafka = new Kafka({
    clientId: 'veloce-backend',
    brokers,
    ssl: {
      ca: [fs.readFileSync(caPath)],
      rejectUnauthorized: true
    },
    sasl: {
      mechanism: 'scram-sha-256',
      username,
      password
    },
    connectionTimeout: 15000,
    requestTimeout: 30000,
    retry: {
      initialRetryTime: 300,
      retries: 8
    },
    logLevel: logLevel.ERROR
  });

  producer = kafka.producer({
    allowAutoTopicCreation: false
  });

  return producer;
}

async function connectProducer() {
  if (connected) return;

  if (!connecting) {
    connecting = (async () => {
      const client = getProducer();
      await client.connect();
      connected = true;
      console.log('VELOCE Kafka producer connected.');
    })().finally(() => {
      connecting = null;
    });
  }

  await connecting;
}

async function publishKafkaEvent({
  topic,
  key,
  eventId,
  eventType,
  payload
}) {
  if (!topic || !key || !eventId || !eventType || !payload) {
    throw new Error('Incomplete Kafka event publishing arguments');
  }

  const client = getProducer();

  await connectProducer();

  try {
    return await client.send({
      topic,
      acks: -1,
      messages: [{
        key: String(key),
        value: JSON.stringify(payload),
        headers: {
          'event-id': String(eventId),
          'event-type': String(eventType)
        }
      }]
    });
  } catch (error) {
    connected = false;

    try {
      await client.disconnect();
    } catch (_) {
      // Preserve the original publishing error.
    }

    throw error;
  }
}

async function disconnectKafkaProducer() {
  if (!producer) return;

  if (connecting) {
    await connecting.catch(() => {});
  }

  if (connected) {
    await producer.disconnect();
    connected = false;
    console.log('VELOCE Kafka producer disconnected.');
  }
}

module.exports = {
  publishKafkaEvent,
  disconnectKafkaProducer
};
