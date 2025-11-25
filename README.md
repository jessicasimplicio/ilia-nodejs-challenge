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
- Communication to the wallet service through REST

## Running the project:

1. Run `npm install`
2. Copy `.env.example` to `.env` and set environment variables
4. Run `docker-compose up --build`

### More about how to run docker:
- Build and start all services:
`docker-compose up --build`

- Build specific service:
`docker-compose build wallet-service`

- Start in detached mode:
`docker-compose up -d`

- View logs:
`docker-compose logs -f wallet-service`

- Stop all services
`docker-compose down`

- Stop and remove volumes`
`docker-compose down -v`

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


## Testing locally the communication between the services
It was created a integration between registering an new user and creating a (first or initial) transaction. 

It seems that the following flow makes sense from the perspective of a business rule:

- User registers → Create user account in Users service
- Initialize wallet → Create wallet in Wallet service
- Set initial balance → Start with 0 amount in CREDIT

### Testing:
1. Start all services: `docker-compose up --build`
2. Make a `POST` to `http://localhost:3002/api/users` with:

```
{
    "first_name": "Teste",
    "last_name": "@Teste",
    "email": "teste@example.com",
    "password": "password123"
}
  ```
3. Check if the transaction was created:
`GET http://localhost:3001/api/transactions`
Pass a JWT token in the Bearer (the JWT need to be created with the right secret)

In case of success you should be something like this:

```
[
  {
    "id": "123928392",
    "user_id": "507f1f77bcf86cd799439011", 
    "type": "CREDIT",
    "amount": 0
  }
]
```

4. If you want you can check internals calls while containers are running:

`docker-compose logs -f wallet-service`

`docker-compose logs -f users-service`


