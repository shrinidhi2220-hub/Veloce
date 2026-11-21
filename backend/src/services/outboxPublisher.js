const { prisma } = require('../config/database');
const { publishKafkaEvent } = require('./kafkaProducer');

const BATCH_SIZE = 5;
const POLL_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 10;

let drainPromise = null;
let workerTimer = null;
let activeRun = null;
let stopping = false;

async function claimBatch() {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw`
      SELECT "id"
      FROM "OutboxEvent"
      WHERE (
        "status" = 'PENDING'
        AND "nextAttemptAt" <= NOW()
      )
      OR (
        "status" = 'PROCESSING'
        AND "lockedAt" IS NOT NULL
        AND "lockedAt" < NOW() - INTERVAL '5 minutes'
      )
      ORDER BY "createdAt" ASC
      LIMIT ${BATCH_SIZE}
      FOR UPDATE SKIP LOCKED
    `;

    if (rows.length === 0) return [];

    const ids = rows.map(row => row.id);
    const lockedAt = new Date();

    await tx.outboxEvent.updateMany({
      where: { id: { in: ids } },
      data: {
        status: 'PROCESSING',
        lockedAt,
        attempts: { increment: 1 }
      }
    });

    return tx.outboxEvent.findMany({
      where: { id: { in: ids } },
      orderBy: { createdAt: 'asc' }
    });
  }, {
    maxWait: 5000,
    timeout: 15000
  });
}

async function markPublished(event) {
  const result = await prisma.outboxEvent.updateMany({
    where: {
      id: event.id,
      status: 'PROCESSING',
      lockedAt: event.lockedAt
    },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
      lockedAt: null,
      lastError: null
    }
  });

  if (result.count !== 1) {
    console.warn(`Outbox lease changed before completion: ${event.eventId}`);
  }
}

async function markFailed(event, error) {
  const dead = event.attempts >= MAX_ATTEMPTS;

  const exponent = Math.min(event.attempts - 1, 10);
  const delayMs = Math.min(
    1000 * (2 ** exponent),
    15 * 60 * 1000
  );

  const result = await prisma.outboxEvent.updateMany({
    where: {
      id: event.id,
      status: 'PROCESSING',
      lockedAt: event.lockedAt
    },
    data: {
      status: dead ? 'DEAD' : 'PENDING',
      lockedAt: null,
      nextAttemptAt: new Date(Date.now() + delayMs),
      lastError: String(error.message || error).slice(0, 4000)
    }
  });

  if (result.count === 1) {
    console.error(
      `Outbox event ${event.eventId} failed. ` +
      `Attempt ${event.attempts}/${MAX_ATTEMPTS}. ` +
      `Status: ${dead ? 'DEAD' : 'PENDING'}`
    );
  } else {
    console.warn(`Outbox lease changed after failure: ${event.eventId}`);
  }
}

async function publishOne(event) {
  try {
    await publishKafkaEvent({
      topic: event.topic,
      key: event.messageKey,
      eventId: event.eventId,
      eventType: event.eventType,
      payload: event.payload
    });

    await markPublished(event);

    console.log(`Outbox event published: ${event.eventId}`);
  } catch (error) {
    try {
      await markFailed(event, error);
    } catch (updateError) {
      console.error(
        `Could not update failed event ${event.eventId}:`,
        updateError.message
      );
    }
  }
}

async function drainOutboxOnce() {
  if (drainPromise) return drainPromise;

  drainPromise = (async () => {
    const events = await claimBatch();

    if (events.length === 0) {
      return { claimed: 0, processed: 0 };
    }

    for (const event of events) {
      await publishOne(event);
    }

    return {
      claimed: events.length,
      processed: events.length
    };
  })();

  try {
    return await drainPromise;
  } finally {
    drainPromise = null;
  }
}

function startOutboxWorker() {
  if (workerTimer) return;

  stopping = false;

  const run = () => {
    if (stopping || activeRun) return;

    activeRun = drainOutboxOnce()
      .catch(error => {
        console.error('Outbox worker cycle failed:', error.message);
      })
      .finally(() => {
        activeRun = null;
      });
  };

  run();

  workerTimer = setInterval(run, POLL_INTERVAL_MS);
  workerTimer.unref?.();

  console.log('VELOCE Outbox worker started.');
}

async function stopOutboxWorker() {
  stopping = true;

  if (workerTimer) {
    clearInterval(workerTimer);
    workerTimer = null;
  }

  if (activeRun) {
    await activeRun;
  }

  if (drainPromise) {
    await drainPromise;
  }

  console.log('VELOCE Outbox worker stopped.');
}

module.exports = {
  drainOutboxOnce,
  startOutboxWorker,
  stopOutboxWorker
};
