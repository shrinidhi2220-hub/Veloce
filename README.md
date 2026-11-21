# VELOCE ONLINE STORE

Team: INFINEX
Institution: Sapthagiri NPS University

VELOCE is an online marketplace supporting regular shopping, wholesale purchasing, circular shopping and customer engagement.

## Technology
- React and Vite
- Node.js and Express
- PostgreSQL on Aiven
- Prisma ORM
- Apache Kafka on Aiven
- OpenSearch (integration in progress)

## Project Structure
- backend/ - Express APIs, Prisma, database and Kafka services
- frontend/ - React application
- MEMBER1_API_DOCUMENTATION.md - API documentation

## Backend Setup
1. Open the backend folder.
2. Run npm ci.
3. Copy .env.example to .env.
4. Configure your own database and Kafka credentials.
5. Run npx prisma generate.
6. Run npx prisma migrate status.
7. Start using npm run dev.

Backend: http://localhost:3000
Health: http://localhost:3000/health

## Database Safety
Do not run npm run db:setup or npm run prisma:seed against the shared Aiven database. The general seed script contains destructive operations. Coordinate migrations with Member 1.

## Frontend Setup
Open another terminal, enter frontend, run npm ci and npm run dev.

## Implemented Backend
- Products, authentication and cart APIs
- COD checkout and transactional stock deduction
- Inventory events
- Reviews, resale, consent, rewards and surprise workflows
- Kafka producer and transactional outbox publisher

Core checkout and Kafka order-event publishing and consumption have been tested.

OpenSearch integration, wholesale pricing and full frontend/backend integration remain in progress.

## Team Responsibilities
- Member 1: Backend and database
- Member 2: Frontend
- Member 3: Search, wholesale and inventory
- Member 4: Resale, reviews and engagement

See MEMBER1_API_DOCUMENTATION.md for API details.

Never commit .env files, passwords or private certificates.

Member 1 branch: Shreeshant's_branch