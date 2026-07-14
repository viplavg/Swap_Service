# Shift Swap Request and Approval System

A small full-stack application that allows employees to request shift swaps with other employees and allows managers to approve or reject those requests.

The project focuses on a correct and tested core workflow, role-based authorization, transaction-safe approvals, and a clear deployment and operational plan.

## Features

### Employee

- Register and log in
- View assigned shifts
- Request a shift swap with another employee
- View swap requests involving them

### Manager

- Log in with a manager account
- Create and assign shifts
- View pending swap requests
- Approve swap requests
- Reject swap requests

### System

- JWT-based authentication
- Role-based authorization
- Request validation
- MongoDB transaction for swap approval
- Automated API tests
- Structured error responses

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- express-validator
- Jest
- Supertest
- mongodb-memory-server

### Frontend

- React
- Vite

## Project Structure

```text
ukg-shift-swap/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── tests/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── jest.config.js
│   └── package.json
├── client/
└── README.md
```

## Prerequisites

Before running the application, make sure you have:

- Node.js (v18 or later)
- npm
- MongoDB Atlas account or a local MongoDB instance

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=2d
```

A sample `.env.example` file is included for reference.

## Backend Setup

Navigate to the backend directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run the production server:

```bash
npm start
```

The backend will be available at:

```text
http://localhost:5000
```

Health Check:

```http
GET /health
```

## Frontend Setup

Navigate to the frontend directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend application will be available at:

```text
http://localhost:5173
```

## Running Tests

Navigate to the backend directory:

```bash
cd server
```

Run all tests:

```bash
npm test
```

## Test Results

Current test status:

- Test Suites: 3 passed, 3 total
- Tests: 10 passed, 10 total

## Automated Test Coverage

- User registration
- Duplicate user registration prevention
- User login
- Invalid login credentials
- Manager shift creation
- Employee authorization checks
- Swap request creation
- Duplicate swap request prevention
- Swap approval workflow
- Prevention of duplicate approvals

## API Endpoints

### Authentication

| Method | Endpoint                | Description             |
|--------|-------------------------|-------------------------|
| POST   | `/api/v1/auth/register` | Register a new employee |
| POST   | `/api/v1/auth/login`    | Login user              |

### Shifts

| Method | Endpoint                  | Description                                   |
|--------|---------------------------|-----------------------------------------------|
| POST   | `/api/v1/shifts`          | Create a shift (Manager only)                 | 
| GET    | `/api/v1/shifts/my-shifts`| Get shifts assigned to the authenticated user |

### Swap Requests

| Method | Endpoint                      | Description                                        |
|--------|-------------------------------|----------------------------------------------------|
| POST   | `/api/v1/swaps`               | Create a swap request                              |
| GET    | `/api/v1/swaps/my-requests`   | Get swap requests involving the authenticated user |
| GET    | `/api/v1/swaps/pending`       | Get all pending swap requests (Manager only)       |
| PATCH  | `/api/v1/swaps/:id/approve`   | Approve a swap request (Manager only)              |
| PATCH  | `/api/v1/swaps/:id/reject`    | Reject a swap request (Manager only)               |

## Assumptions

- Every shift belongs to a single employee.
- A swap request involves exactly two shifts.
- Employees can only request swaps for shifts assigned to them.
- Employees cannot request a swap with their own shift.
- Managers are responsible for approving or rejecting swap requests.
- Only pending swap requests can be approved or rejected.
- Duplicate pending swap requests between the same shifts are not allowed.

## Design Decisions

### Authentication

JWT-based authentication is used because the API is stateless and the frontend can send the token with each protected request. Tokens include the user ID and role so the backend can identify the authenticated user and apply role-based access control.

### Authorization

Role-based authorization is implemented through reusable middleware. Employee routes and manager-only routes are separated so unauthorized users cannot create shifts or approve and reject swap requests.

### Validation

Request validation is performed using `express-validator` before controller logic runs. This keeps controllers focused on business logic and ensures malformed or missing input is rejected with a clear response.

### Data Model

The application uses separate `User`, `Shift`, and `SwapRequest` collections. This avoids duplicating employee and shift information while allowing swap requests to reference both employees and both shifts involved in the request.

### Transactions

Approving a swap updates both shifts and the swap request status. MongoDB transactions are used so all updates either succeed together or are rolled back together, preventing partial or inconsistent shift ownership.

### API Structure

The backend follows a controller, route, middleware, model, and validator structure. This separation improves readability, testing, and maintainability without introducing unnecessary complexity for the current scope.

## Additional Documentation

- DESIGN.md
- FAILURE_MODES.md
- DEPLOYMENT_PLAN.md
- SECURITY_REVIEW.md
- OBSERVABILITY.md
- ROLLOUT_AND_ROLLBACK.md
- AI_USAGE_DISCLOSURE.md