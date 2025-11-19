# Service 1: Wallet Microservice

Digital Wallet where the user transactions are stored.

## Features

- Create credit/debit transactions
- Get transaction history
- Check current balance
- MongoDB database
- JWT authentication in all endpoints

## Running the project:

1. Run `npm install`
2. Copy `.env.example` to `.env` and set environment variables
4. Run `docker-compose up --build`

## Authentication
All endpoints require JWT token in Authorization header: `Bearer <token>`.

Create a jwt token with the secret given in the challenge.

## Endpoints
- `GET /health` - Health check
- `GET /transactions` - Get transaction history
- `POST /transactions` - Create new transaction
- `GET /transactions/balance` - Get current balance


# Service 2: Users Microservice

Managiment of users of the Digital Wallet.

## Features

- Register and authenticate a user
- CRUD of the users
- JWT authentication for private routes
- MongoDB database

## Running the project:

1. Run `npm install`
2. Copy `.env.example` to `.env` and set environment variables
4. Run `docker-compose up --build`

### Development mode:
- Run `npm run dev`

## Authentication
All private endpoints require JWT token in Authorization header: `Bearer <token>`.

Create a jwt token with the secret given in the challenge.

## Endpoints

### Public

- `POST /api/users` - Register new user
- `POST /api/auth` - User login

### Private

- `GET /api/users` - Find all users
- `GET /api/users/:id` - Find user by id
- `PATCH /api/users/:id` - Update user by id
- `DELETE /api/users/:id` - Delete user by id
