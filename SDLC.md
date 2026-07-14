# Software Development Life Cycle

## Requirements Clarification

The core requirements were interpreted as follows:

- An employee can request a shift swap with another employee.
- A manager can approve or reject a pending swap request.
- Employees can only request swaps involving their own shifts.
- Employees cannot swap a shift with themselves.
- Only managers can create shifts and review swap requests.
- Approved swaps must update both shift assignments atomically.
- The solution is implemented as a REST API service; a frontend is outside the current scope.

Assumptions:

- Users are registered with either the `EMPLOYEE` or `MANAGER` role.
- Shift records are created by managers before swap requests are submitted.
- A swap request requires an existing requester shift and target shift.
- A request cannot be changed after it is approved or rejected.
- Notifications and employee acceptance workflows are outside the current scope.

## Design

The service uses:

- Express for REST APIs.
- MongoDB and Mongoose for persistence.
- JWT for authentication.
- Role-based middleware for authorization.
- MongoDB transactions for atomic swap approval.

Detailed design decisions are documented in `DESIGN.md`.

## Implementation

The implementation is divided into:

- Routes for API endpoint definitions.
- Controllers for business logic.
- Models for users, shifts, and swap requests.
- Middleware for authentication, authorization, and validation.
- Validators for request payload validation.

The scope focuses on the core API workflow rather than a frontend application.

## Testing

Automated tests are implemented using Jest, Supertest, and MongoDB Memory Server.

The tests cover:

- Registration and login.
- Duplicate email handling.
- Manager-only shift creation.
- Employee authorization restrictions.
- Swap request creation.
- Duplicate pending request prevention.
- Swap approval.
- Repeated approval rejection.

Transactions are tested using an in-memory MongoDB replica set.

## Security and Privacy

Security and privacy considerations are documented in `SECURITY_REVIEW.md`.

Key controls include:

- Password hashing using bcrypt.
- JWT authentication.
- Role-based authorization.
- Input validation.
- Environment-based secret management.
- Generic server error responses.

## Deployment

The deployment approach is documented in `DEPLOYMENT_PLAN.md`.

The proposed deployment environment uses:

- Render for the backend API.
- MongoDB Atlas for the database.

The application can be validated after deployment using the provided Postman collection and the `/health` endpoint.

## Rollout and Rollback

The rollout and rollback process is documented in `ROLLOUT_AND_ROLLBACK.md`.

The process includes:

- Running tests before deployment.
- Performing health and smoke checks after deployment.
- Monitoring logs and availability.
- Redeploying the last stable version if critical issues occur.

## Observability and Post-Deployment Monitoring

Operational monitoring is documented in `OBSERVABILITY.md`.

Current signals include:

- Application logs.
- Error logs.
- The `/health` endpoint.
- Post-deployment smoke tests using the provided Postman collection.

Future production monitoring would include response time, error rate, request volume, database latency, and alerting.

## Failure Handling

Failure scenarios and recovery behavior are documented in `FAILURE_MODES.md`.

Covered scenarios include:

- Invalid or expired tokens.
- Unauthorized access.
- Invalid input.
- Missing shifts.
- Duplicate requests.
- Transaction failures.
- Database unavailability.
- Concurrent approval attempts.

## Maintenance and Future Enhancements

Possible future improvements include:

- Employee acceptance before manager review.
- Notifications.
- Pagination.
- Audit logs.
- Rate limiting.
- Refresh tokens.
- Structured logging.
- CI/CD automation.