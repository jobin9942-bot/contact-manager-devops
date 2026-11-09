# Northstar Contacts

A beginner-friendly, three-tier contact management application built with React, Express, and MySQL. The frontend talks to a REST API; only the backend connects to MySQL. This repository contains application code and local setup instructions only. It does not include infrastructure, deployment automation, containers, or monitoring configuration.

## Architecture

```text
React + Vite (presentation)  →  Express REST API (application)  →  MySQL 8 (data)
       configurable URL                configured connection pool
```

The tiers can run on separate hosts. Set `VITE_API_BASE_URL` to the reachable backend URL and set backend `DB_HOST` to the reachable MySQL hostname. The browser must be able to reach the frontend and the API; the API host must be able to reach MySQL.

## Features

- Database-backed dashboard statistics and recently added contacts.
- Create, view, edit, delete, search, and paginate contacts.
- Search by first/last name, email, phone, or company; sort by name or creation date.
- Frontend and backend input checks, parameterized SQL, safe API errors, Helmet, explicit-origin CORS, and rate limiting.
- No demo contacts are inserted automatically. The UI does not provide authentication; use only in a controlled demonstration environment.

## Structure

```text
backend/src/config       MySQL pool
backend/src/controllers  HTTP handlers
backend/src/middleware   Error handling
backend/src/routes       REST routes
backend/src/services     SQL access
backend/src/validators   Input and query validation
backend/sql/schema.sql   Repeatable schema initialization
backend/test             Unit tests for validation
frontend/src/components  Shared layout and form
frontend/src/pages       Dashboard and contact screens
frontend/src/services    Configurable API client
```

## Prerequisites

- Node.js 20 or newer and npm.
- MySQL 8.x reachable from the backend host.

## Local setup

1. Initialize the schema in MySQL, for example with the MySQL command-line client:

   ```sh
   mysql -u root -p < backend/sql/schema.sql
   ```

   Create a MySQL application user with access to `contact_manager` using your usual local database administration process. No application password is committed here.

2. Copy `backend/.env.example` to `backend/.env` and fill in the local database username/password and host. `DB_HOST` accepts a hostname or IP address; it is not hard-coded to localhost. Set `FRONTEND_ORIGIN` to the exact browser origin serving the Vite app (comma-separated origins are supported).

3. Install dependencies and start the API:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

   The API listens on port 3001 by default. `GET http://localhost:3001/api/health` checks API and database connectivity without revealing secrets.

4. In a second terminal, copy `frontend/.env.example` to `frontend/.env`. Set `VITE_API_BASE_URL` to the full API base URL, including `/api` (for local use, `http://localhost:3001/api`). Then start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Open the Vite URL printed in the terminal (usually `http://localhost:5173`). Restart Vite after changing its environment file.

## API overview

Responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "error": "..." }`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | API and database health |
| GET | `/api/contacts?page=1&pageSize=10&search=ada&sort=name&direction=asc` | Paginated, searchable contacts |
| GET | `/api/contacts/:id` | Contact details |
| POST | `/api/contacts` | Create a contact |
| PUT | `/api/contacts/:id` | Update a contact |
| DELETE | `/api/contacts/:id` | Delete a contact (204) |
| GET | `/api/stats` | Dashboard counts and five recent contacts |

Example create request:

```sh
curl -X POST http://localhost:3001/api/contacts \
  -H 'Content-Type: application/json' \
  -d '{"first_name":"Ada","last_name":"Lovelace","email":"ada@example.com","company":"Analytical Engines"}'
```

The page defaults to 1, page size defaults to 10 and is capped at 100. Sort fields are restricted to `name` and `created_at`; direction is `asc` or `desc`. Search is performed in MySQL, and is case-insensitive under the schema's `utf8mb4_0900_ai_ci` collation.

## Tests and build

Backend validation tests do not use a database:

```sh
cd backend
npm install
npm test
```

The API's CRUD and dashboard requests require a configured, reachable MySQL database. To build the frontend, run `npm install` then `npm run build` in `frontend`.

Database-backed endpoint coverage is included as an opt-in integration test. Create and initialize a dedicated database whose name ends in `_test`, then set `RUN_DB_TESTS=1` and `TEST_DB_HOST`, `TEST_DB_PORT`, `TEST_DB_USER`, `TEST_DB_PASSWORD`, and `TEST_DB_NAME` before `npm test`. The test refuses database names without the `_test` suffix and inserts/deletes only its own contact. Do not point these variables at a database containing real contacts.

## Troubleshooting

- **Database connection refused:** Check MySQL is running, `DB_HOST`/`DB_PORT` are correct, and the database host accepts connections from the backend host. For a separate database server, use its DNS name or reachable IP in `DB_HOST` and ensure routing/firewall rules are configured outside this application.
- **Access denied:** Check the configured MySQL user/password and that the user has privileges for `contact_manager`.
- **Unknown database/table:** Run `backend/sql/schema.sql` against the intended MySQL server.
- **CORS error:** `FRONTEND_ORIGIN` must exactly match the frontend origin, including scheme and port. Restart the backend after changing it.
- **Frontend cannot reach the API:** Set `VITE_API_BASE_URL` to an API URL reachable from the user's browser, then restart Vite. The API must also allow that browser origin.

## Security limitation

This portfolio demo has no sign-in, authorization, or user separation. Anyone who can reach the API can manage its contacts. Do not expose it with real personal data or treat the basic security middleware as production-grade access control.
