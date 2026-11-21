const app = require('./app');
const { prisma, testConnection } = require('./config/database');

const {
  startOutboxWorker,
  stopOutboxWorker
} = require('./services/outboxPublisher');

const {
  disconnectKafkaProducer
} = require('./services/kafkaProducer');

const PORT = process.env.PORT || 3000;

let server;
let shuttingDown = false;

async function startServer() {
  const dbConnected = await testConnection();

  if (!dbConnected) {
    throw new Error(
      'Database unavailable. VELOCE server startup aborted.'
    );
  }

  server = app.listen(PORT, () => {
    console.log(`VELOCE Backend Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API URL: http://localhost:${PORT}`);

    // Start the durable PostgreSQL-to-Kafka publisher.
    startOutboxWorker();
  });

  server.on('error', (error) => {
    console.error('HTTP server error:', error.message);
    process.exitCode = 1;
  });
}

async function shutdown(signal) {
  if (shuttingDown) return;

  shuttingDown = true;
  console.log(`${signal} received. Shutting down VELOCE...`);

  let shutdownFailed = false;

  async function cleanup(label, operation) {
    try {
      await operation();
      console.log(`${label} shutdown completed.`);
    } catch (error) {
      shutdownFailed = true;
      console.error(`${label} shutdown failed:`, error.message);
    }
  }

  // Stop accepting requests and finish existing HTTP requests.
  if (server) {
    await cleanup('HTTP server', () =>
      new Promise((resolve, reject) => {
        server.close(error => {
          if (error) reject(error);
          else resolve();
        });
      })
    );
  }

  // Stop new outbox polling and wait for an active publishing cycle.
  await cleanup('Outbox worker', stopOutboxWorker);

  // Disconnect Kafka before closing the database connection.
  await cleanup('Kafka producer', disconnectKafkaProducer);

  await cleanup('Prisma', () => prisma.$disconnect());

  if (shutdownFailed) {
    process.exitCode = 1;
  }

  console.log('VELOCE shutdown sequence finished.');
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch(async error => {
  console.error('VELOCE startup failed:', error.message);

  try {
    await stopOutboxWorker();
  } catch (workerError) {
    console.error('Outbox worker cleanup failed:', workerError.message);
  }

  try {
    await disconnectKafkaProducer();
  } catch (kafkaError) {
    console.error('Kafka cleanup failed:', kafkaError.message);
  }

  try {
    await prisma.$disconnect();
  } catch (disconnectError) {
    console.error('Database disconnect failed:', disconnectError.message);
  }

  process.exitCode = 1;
});
