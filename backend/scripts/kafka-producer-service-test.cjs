require('dotenv').config();

const { randomUUID } = require('crypto');
const {
  publishKafkaEvent,
  disconnectKafkaProducer
} = require('../src/services/kafkaProducer');

async function main() {
  const eventId = randomUUID();

  const payload = {
    eventId,
    eventType: 'VELOCE_KAFKA_SERVICE_TEST',
    source: 'veloce-backend',
    timestamp: new Date().toISOString(),
    message: 'Reusable Kafka producer verified'
  };

  const result = await publishKafkaEvent({
    topic: process.env.KAFKA_ORDERS_TOPIC,
    key: eventId,
    eventId,
    eventType: payload.eventType,
    payload
  });

  console.log('KAFKA PRODUCER SERVICE TEST PASSED');

  console.log(JSON.stringify({
    eventId,
    topic: process.env.KAFKA_ORDERS_TOPIC,
    partition: result[0].partition,
    offset: result[0].baseOffset
  }, null, 2));
}

main()
  .catch(error => {
    console.error('KAFKA SERVICE TEST FAILED:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectKafkaProducer();
  });
