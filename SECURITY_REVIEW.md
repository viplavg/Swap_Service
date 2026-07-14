# Security and Privacy Review

## Overview

The application includes several security measures to protect user accounts, application data, and backend resources. Authentication, authorization, password hashing, input validation, and environment-based secret management help reduce common security risks.

## Password Security

User passwords are never stored in plain text.

Passwords are hashed using bcrypt in a Mongoose pre-save hook before the user document is stored in the database.

The hashing logic runs only when the password field is newly created or modified, preventing unnecessary re-hashing during unrelated user updates.

### Benefits

- Protects user credentials if database data is exposed.
- Prevents recovery of original passwords from stored hashes.
- Ensures password hashing is applied consistently at the model layer.

## Authentication Security

The application uses JWT-based authentication.

After successful login, the backend generates a signed JWT containing the user's ID and role.

Protected routes require a valid JWT in the Authorization header.

### Benefits

- Stateless authentication.
- Reduced server-side session management complexity.
- Secure user identification across requests.

## Authorization Security

Role-based authorization is enforced through middleware.

Supported roles:

- EMPLOYEE
- MANAGER

Manager-only operations include:

- Shift creation
- Swap approval
- Swap rejection

### Benefits

- Prevents unauthorized access to privileged operations.
- Separates employee and manager responsibilities.

## Input Validation

The application validates incoming requests before executing business logic.

Examples include:

- Required field validation.
- Shift existence checks.
- Duplicate request checks.
- Business rule validation.

### Benefits

- Reduces invalid data entry.
- Helps prevent unexpected application behavior.
- Improves API reliability.

## Environment Variable Management

Sensitive configuration values are stored in environment variables.

Examples:

- JWT_SECRET
- MONGO_URI

These values are excluded from source control and configured separately for each deployment environment.

### Benefits

- Prevents accidental exposure of secrets.
- Simplifies secret rotation.
- Supports environment-specific configuration.

## Database Security

MongoDB Atlas provides database-level security controls.

Recommended production practices include:

- Restricting network access.
- Using strong database credentials.
- Enabling database backups.
- Applying least-privilege access policies.

## Error Handling Security

The application returns generic error messages for unexpected server failures.

Internal implementation details, stack traces, and sensitive system information are not exposed to API consumers.

### Benefits

- Reduces information disclosure risk.
- Makes reconnaissance more difficult for attackers.

## API Security Considerations

Current protections include:

- Authentication middleware.
- Authorization middleware.
- Request validation.
- Password hashing.
- Environment-based secret management.

Recommended future improvements include:

- API rate limiting.
- Request throttling.
- Refresh token support.
- Security audit logging.
- Account lockout mechanisms after repeated failed login attempts.

## Privacy Considerations

The application stores only the information required for authentication and shift management.

Stored user data includes:

- Name
- Email address
- Password hash
- Role information

The application does not intentionally collect unnecessary personal information.

## Security Limitations

The current implementation is designed for assessment purposes and does not include every security control expected in a large-scale production environment.

Examples include:

- Multi-factor authentication (MFA)
- Advanced intrusion detection
- Centralized security monitoring
- Automated secret rotation

These controls can be added as the system evolves.

## Conclusion

The application implements foundational security practices including password hashing, JWT authentication, role-based authorization, input validation, and secure secret management. These controls provide an appropriate security baseline for the current project scope while allowing additional protections to be introduced in future iterations.