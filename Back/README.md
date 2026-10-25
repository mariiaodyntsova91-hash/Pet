# Pet API

NestJS API for the Angular application in `Front/`. User records are stored in PostgreSQL through Prisma. Passwords are hashed before they are stored.

## Run locally

Requirements: Node.js and Docker with Compose.

From `Back/`, install dependencies and create your local environment file:

```bash
npm install
cp .env.example .env
```

Replace `JWT_SECRET` in `.env` with a private random value. Then start PostgreSQL, apply the database migration, and start the API:

```bash
docker-compose up -d database
npm run db:migrate -- --name create_user
npm run start:dev
```

The API listens on `http://localhost:3000`. `GET /api/health` returns `{ "status": "ok" }`.

## Authentication endpoints

- `POST /api/auth/register` creates a user and returns an access token. The request body is `{ "email": "person@example.com", "password": "at-least-8-characters" }`.
- `POST /api/auth/login` checks the credentials and returns `{ "accessToken": "..." }`. The request body accepts `email`, `password`, and optional `rememberMe`.

Email is normalized to lowercase. Only a bcrypt hash is stored in the `User` table. `rememberMe: true` gives the access token a 30-day lifetime; otherwise it lasts one hour. The token is currently held in the Angular SignalStore memory and is cleared on page reload.

The local database uses the development-only credentials from `.env.example`. Do not use those credentials or the example JWT secret outside local development.

In a second terminal, run `cd Front && npm start` to start Angular. Set `FRONTEND_ORIGIN`, `PORT`, or `DATABASE_URL` in `Back/.env` to adjust the local setup.
