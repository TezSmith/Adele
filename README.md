# Adele

A full-stack chat application built with Vue.js and Node.js, featuring WebSocket communication and PostgreSQL message persistence.

## Tech Stack

### Frontend
- Vue 3 with TypeScript
- Vite for build tooling
- WebSocket for real-time communication
- Vue Router for navigation
- Pinia for state management

### Backend
- Node.js with TypeScript
- WebSocket server
- PostgreSQL for data persistence
- SQL query typing with pgTyped

### Infrastructure
- Docker Compose for local PostgreSQL database

## Getting Started

1. Install all dependencies. From this root directory:
```bash
npm run install:all
```
This will run `npm install` in this directory, as well as the frontend and server directories.


2. Next, from this directory, start the development environment:
```bash
npm run dev
````
This will start the PostgreSQL database on Docker, the frontend development server, and the backend server.

Alternatively, to also include a WebSocket test client (see `WebSocket Test Client` below), you can run the following instead:
```bash
npm run dev:mock
```

The application will then be available at:
- Frontend: http://localhost:8080
- Backend: http://localhost:3000

## Project Structure

```
├── frontend/               # Vue.js frontend application
│   ├── src/
│   │   ├── assets/         # Static assets and styles
│   │   ├── components/     # Reusable Vue components
│   │   ├── router/         # Vue Router configuration
│   │   ├── stores/         # Pinia state management
│   │   └── views/          # Page components
│
├── server/                 # Node.js backend server
│   ├── config/             # Server configuration
│   ├── db-init/            # Database schema init files (see `Schema `Migrations"` for more details)
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic
│   ├── repositories/       # Repositories for interacting with the database
│   │   ├── sql/            # SQL queries
│   │   └── types/          # PgTyped definitions (see `PgTyped Definitions` for more details)
│   ├── tests/              # Jest unit tests
│   └── types/              # TypeScript type definitions
```

## Schema "Migrations"
If you want to do a database migration, add a new file to `server/db-init`, with your SQL
schema changes, then restart the server. Make sure the SQL is idempotent (i.e. use statements like `CREATE TABLE IF NOT EXISTS`) as this rudimentary "migration" system runs every time the server starts up.

If you want to clear the entire database, you can just restart the database with `npm run docker:down`then restart the dev environment.

## PgTyped Definitions
This project uses a library called [PgTyped](https://pgtyped.dev/) that will generate TypeScript types of your SQL inputs and outputs. You can write your SQL queries in the appropriate `.sql` file, then run `npm run sql:codegen` (this is a watch command, so you could also just always have it running). 

The command generates the appropriate types in a `<entity>.pgqueries.ts` file that matches the `<entity>.sql` file name. You can then import the `<entity>.pgqueries.ts` file and call those methods to execute your SQL.

### Quick PgTyped Notes
Input parameters are suffixed with `:`, so for example, to get all the messages by a user id, you would do `WHERE user_id = :userId`. If you add a `!` at the end of the
input variable, it tells PgTyped to make the input parameter required (`WHERE user_id = :userId!`), otherwise
it's optional.

## WebSocket Test Client
To simulate having a partner in the chat that simply echos back whatever you have written
a second later, you can start up the WebSocket test client, either by starting it with
the rest of the development environment with `npm run dev:mock`, or on its own with 
`npm run dev:websocket-test-client`.

## Available Scripts

### Root Level
- `npm run install:all`: Installs dependencies for all projects.
- `npm run docker:up`: Starts PostgreSQL database.
- `npm run docker:down`: Stops PostgreSQL database
- `npm run db:connect`: Connect to the PostgreSQL database (once it's running with `npm run docker:up`).
- `npm run sql:codegen`: Generates TypeScript types from SQL queries.
- `npm run dev`: Starts the database, frontend, and server.
- `npm run dev:mock`: Starts database, frontend, server, and a WebSocket test client.
- `npm run dev:frontend`: Starts frontend development server.
- `npm run dev:server`: Starts backend server.
- `npm run dev:websocket-test-client`: Starts the WebSocket test client (see `WebSocket Test Client` above).
