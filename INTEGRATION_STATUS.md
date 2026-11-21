# VELOCE integration branch — review status

This branch is a selective integration of the team branches, based on Member 1's tested backend.

## Included

- Member 1 backend remains the core: PostgreSQL, Prisma, COD checkout, stock protection, inventory events, Kafka producer and transactional outbox.
- Frontend branch is relocated under `frontend/`; the missing Vite `index.html` and `vite.config.js` are added. The Checkout React import for `useEffect` is fixed.
- Shrishti referral fields and relations, resale-purchase model/controller, referral-aware authentication, daily game and Word Puzzle routes/controller are included.
- A new forward-only migration `20261122010000_add_referrals_and_resale_purchases` is added after Member 1's Outbox migration.
- Pandey's wholesale experiments and tests are isolated under `backend/experiments/member3/`.
- Pandey's fuzzy search/filter/sort approach is reimplemented as `backend/src/services/openSearchService.js` and `backend/src/controllers/searchController.js`, with TLS certificate verification enabled and real PostgreSQL product IDs.

## Important boundaries

- This script does NOT apply Prisma migrations to Aiven. Review and test the new migration first; only then coordinate `npx prisma migrate deploy` with Member 1.
- Do NOT run `npm run db:setup` or `npm run prisma:seed` against the shared database.
- The OpenSearch integration requires `OPENSEARCH_URL`, `OPENSEARCH_USERNAME`, `OPENSEARCH_PASSWORD`, and ideally `OPENSEARCH_CA_PATH` in local `.env`. TLS verification stays enabled.
- After configuring OpenSearch, run `node scripts/sync-opensearch.cjs` from `backend/` to index actual active Product rows.
- Search endpoint: `GET /api/products/search?q=iphnoe&category=Electronics&city=Bengaluru&minPrice=100&maxPrice=90000&page=1&limit=10`.
- If OpenSearch is not configured or is unavailable, search falls back to basic PostgreSQL contains search (not typo-tolerant).
- Pandey's percentage-tier wholesale helper is NOT wired into checkout because it conflicts with the current Product.wholesalePrice/Product.wholesaleQty rule and the hackathon example (₹500 at quantity 10 should become ₹450). Agree one pricing policy before replacing Member 1's tested server-side calculation.
- The React app still has mock auth/cart/checkout state in its contexts and pages. The API client is real, but the UI components must be connected to it in the next integration pass. Checkout UI now shows COD only; the submit handler still simulates a local order until cart/session API wiring is completed.

## Required validation after this script

1. In `backend/`: `npm install @opensearch-project/opensearch@^3.10.0`
2. `npx prisma validate`
3. `npx prisma generate`
4. `node --check` on the new/changed backend files.
5. Review `npx prisma migrate status`; expect the new integration migration to be pending until deliberately deployed.
6. In `frontend/`: `npm ci` then `npm run build`.
7. Configure OpenSearch CA and credentials locally, then run `node scripts/sync-opensearch.cjs`.
8. Test authentication, resale purchase, Word Puzzle, products/search, cart, COD checkout and Kafka outbox end to end.