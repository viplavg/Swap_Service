# Deployment Plan

## Overview

The solution is implemented as a backend REST API service backed by MongoDB.

The deployment architecture consists of:

- Express.js backend API
- MongoDB Atlas database
- Postman collection for API testing and validation

The backend and database are deployed independently, allowing the API service to scale separately from the database layer.

---

## Backend Deployment

### Platform

Render

For the assessment deployment, the backend can use Render's free web service tier. The free tier may spin down during inactivity, so the first request after an idle period can experience a cold-start delay. A paid instance would be recommended for production workloads requiring consistent availability.

### Deployment Steps

1. Connect the GitHub repository to Render.
2. Create a new Web Service.
3. Select the backend project directory.
4. Configure the build command:

```bash
npm install
```

5. Configure the start command:

```bash
npm start
```

6. Add required environment variables:

- PORT
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN

7. Deploy the service.

### Benefits

- Managed Node.js hosting.
- Automatic GitHub-based deployments.
- Built-in HTTPS support.
- Easy environment variable management.
- Simple rollback support.

---

## Database Deployment

### Platform

MongoDB Atlas

### Deployment Steps

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Configure network access.
4. Obtain the connection string.
5. Store the connection string in the backend environment variables.
6. Verify successful connectivity after deployment.

### Benefits

- Managed database infrastructure.
- Automated backups.
- Monitoring and performance insights.
- High availability options.

---

## Environment Configuration

Sensitive values should never be committed to source control.

Required backend environment variables:

```env
PORT=5000
MONGO_URI=<mongodb_connection_string>
JWT_SECRET=<jwt_secret>
JWT_EXPIRES_IN=2d
```

Environment variables should be configured through the hosting platform and secret management facilities.

---

## Continuous Deployment

The deployment process supports continuous deployment through GitHub integration.

### Workflow

1. Changes are pushed to the repository.
2. The hosting platform detects the update.
3. A new build is created.
4. Automated tests should be executed before deployment.
5. The new version is deployed automatically if the build succeeds.
6. Post-deployment smoke tests are executed.

---

## Migration Strategy

The current application does not require schema migrations.

Changes are additive and MongoDB collections are created automatically through Mongoose models when needed.

For future schema changes:

1. Deploy backward-compatible changes first.
2. Validate application behavior.
3. Perform data migration if required.
4. Remove deprecated fields only after successful verification.

This approach minimizes deployment risk and avoids downtime.

---

## Health Checks

The backend exposes a health endpoint:

```http
GET /health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running successfully"
}
```

The endpoint verifies that the API process is running and capable of serving requests.

Health checks allow hosting platforms to detect unhealthy instances and restart them when necessary.

---

## Post-Deployment Validation

After deployment, the following checks should be performed:

1. Verify the health endpoint.
2. Verify database connectivity.
3. Register a test user.
4. Log in and obtain a JWT token.
5. Create test shifts using a manager account.
6. Submit a swap request.
7. Approve a swap request.
8. Verify that shift ownership changes correctly.

The included Postman collection can be used for smoke testing these flows.

---

## Production Considerations

Before production deployment, the following improvements are recommended:

- Restrict MongoDB Atlas network access.
- Rotate secrets periodically.
- Configure centralized logging.
- Configure monitoring and alerting.
- Enable automated backups.
- Implement rate limiting for public endpoints.
- Configure audit logging for sensitive operations.
- Introduce CI/CD quality gates.

---

## Recovery Strategy

If a deployment fails:

1. Stop traffic to the failing version.
2. Redeploy the previous stable version.
3. Verify application health.
4. Verify database connectivity.
5. Review deployment logs.
6. Fix the issue and redeploy.

This approach minimizes downtime and reduces deployment risk.