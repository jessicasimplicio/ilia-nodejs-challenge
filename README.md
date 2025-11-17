

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

