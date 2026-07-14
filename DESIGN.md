# System Design

## Architecture Overview

The application follows a client-server architecture.

- The React frontend provides separate workflows for employees and managers.
- The Express backend exposes REST APIs for authentication, shift management, and swap request management.
- MongoDB stores users, shifts, and swap requests.
- JWT is used to authenticate protected API requests.
- Role-based middleware controls access to employee and manager operations.

The backend is organized into routes, controllers, middleware, models, and validators. This keeps responsibilities separated and makes the application easier to test and maintain.

## High-Level Flow

1. A user registers or logs in.
2. The backend returns a signed JWT.
3. The frontend sends the JWT with protected API requests.
4. Employees can view their shifts and create swap requests.
5. Managers can view pending requests and approve or reject them.
6. When a request is approved, both shift ownership records and the swap request status are updated inside a MongoDB transaction.

## Data Model Design

### User

The User collection stores authentication and authorization information.

Fields:

- name
- email
- password hash
- role (`EMPLOYEE` or `MANAGER`)

Responsibilities:

- Authentication
- Role-based access control
- Ownership of shifts

### Shift

The Shift collection represents a work shift assigned to an employee.

Fields:

- employee
- date
- startTime
- endTime

Responsibilities:

- Store employee shift assignments
- Serve as the source of truth for shift ownership

### SwapRequest

The SwapRequest collection stores shift exchange requests between employees.

Fields:

- requester
- targetEmployee
- requesterShift
- targetShift
- status
- reviewedBy
- reviewedAt

Responsibilities:

- Track the lifecycle of a swap request
- Record manager approval or rejection decisions
- Link the employees and shifts involved in the exchange

## Relationship Overview

- One User can have many Shifts.
- One User can participate in many Swap Requests.
- One Swap Request references two employees and two shifts.
- A Swap Request moves through the states: PENDING → APPROVED or PENDING → REJECTED.

## Authentication and Authorization Flow

### Authentication

When a user registers or logs in, the backend generates a signed JWT containing the user's ID and role.

The frontend sends this token in the `Authorization` header for protected requests:

```http
Authorization: Bearer <token>
```

The authentication middleware:

1. Reads the token from the request header.
2. Verifies the token using `JWT_SECRET`.
3. Extracts the user ID and role from the token payload.
4. Attaches the decoded payload to `req.user`.
5. Rejects the request if the token is missing, expired, or invalid.

This ensures that only authenticated users can access protected endpoints.

### Authorization

Authorization is implemented using role-based middleware.

Manager-only operations, such as shift creation and swap approval or rejection, require the authenticated user to have the `MANAGER` role.

Employee endpoints use the authenticated user ID stored in `req.user.id` to ensure users can only access or modify data related to themselves.

Separating authentication and authorization into dedicated middleware keeps the controller layer focused on business logic and improves code maintainability and reusability.

## Swap Approval Transaction Flow

Approving a swap request changes multiple documents:

- The requester shift is assigned to the target employee.
- The target shift is assigned to the requester.
- The swap request status is changed from `PENDING` to `APPROVED`.
- The reviewing manager and review timestamp are recorded.

These updates are executed inside a MongoDB transaction.

### Approval Steps

1. The manager sends an approval request.
2. The backend verifies that the authenticated user has the `MANAGER` role.
3. The swap request is fetched and checked to ensure its status is still `PENDING`.
4. Both referenced shifts are fetched.
5. The employee assignments of the two shifts are exchanged.
6. The swap request is marked as `APPROVED`.
7. The manager ID is stored in `reviewedBy`.
8. The current timestamp is stored in `reviewedAt`.
9. All changes are committed together.

If any step fails, the transaction is aborted and all database changes are rolled back.

### Why a Transaction Is Required

Without a transaction, one shift could be updated while another update fails. This would leave the system in an inconsistent state where only part of the swap has been completed.

Using a transaction ensures atomicity: either all approval-related updates succeed, or none of them are applied.

## Rejection Flow

Rejecting a swap request only changes the swap request document.

The request status is updated from `PENDING` to `REJECTED`, and the manager ID and review timestamp are recorded.

A transaction is not required for rejection because only one document is updated.

## Validation and Business Rules

The backend enforces the following rules:

- The requester shift and target shift cannot be the same shift.
- Both referenced shifts must exist.
- The requester shift must belong to the authenticated employee.
- The target shift must belong to another employee.
- A user cannot swap a shift with themselves.
- Duplicate pending requests for the same requester shift and target shift are not allowed.
- Only requests with `PENDING` status can be approved or rejected.
- Only managers can approve or reject requests.

These checks are handled through validators, authentication middleware, role middleware, and controller-level business logic.

## Failure Handling

The system handles common failure scenarios as follows:

- Missing or invalid JWT tokens return an authentication error.
- Users without the required role receive an authorization error.
- Invalid request bodies are rejected before controller execution.
- Missing users, shifts, or swap requests return a not-found response.
- Duplicate pending requests are rejected.
- Repeated approval or rejection attempts are rejected.
- Transaction failures trigger a rollback.
- Unexpected server errors return a structured error response without exposing sensitive internal details.

## Design Trade-offs

### JWT-Based Authentication

JWT was selected because it keeps the API stateless and works well with a separate React frontend.

Trade-off:

- Token revocation is more difficult than with server-side sessions.
- For the current scope, short-lived tokens and secure secret management are sufficient.

### MongoDB

MongoDB was selected because the application data maps naturally to document-based models and Mongoose simplifies schema validation and relationships.

Trade-off:

- Shift approval requires multi-document transactions.
- MongoDB must run as a replica set for transaction support.

### Separate Collections

Users, shifts, and swap requests are stored in separate collections to avoid data duplication and maintain clear ownership relationships.

Trade-off:

- Some API responses require population of referenced documents.
- This adds additional database work but keeps the data model normalized and maintainable.

### Simple Role Model

The current system uses only `EMPLOYEE` and `MANAGER` roles.

Trade-off:

- This is easy to understand and sufficient for the current requirements.
- A larger production system may require more granular permissions.

## Scalability Considerations

For the current assessment scope, a single backend service and MongoDB database are sufficient.

Possible future improvements include:

- Pagination for shift and swap request lists.
- Database indexes on employee, status, requester, and target employee fields.
- Rate limiting for authentication and write endpoints.
- Centralized logging and monitoring.
- Caching for frequently requested read operations.
- Background jobs for email or notification delivery.
- Audit logging for manager actions.
- Horizontal scaling of stateless API instances behind a load balancer.