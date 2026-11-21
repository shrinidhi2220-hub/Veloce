# Veloce - Concurrent Inventory Test

## Scenario

Initial stock: 1
Customer A requests: 1
Customer B requests: 1

## Expected Results

- Exactly one purchase succeeds.
- Exactly one purchase fails due to insufficient stock.
- Final stock = 0.
- Stock must never become negative.
- Exactly one order must be committed.
- Exactly one successful inventory event must be recorded.

## Verification

Run both checkout requests simultaneously against the actual backend and PostgreSQL database.

Do not use an in-memory JavaScript simulation as proof of concurrency safety.
