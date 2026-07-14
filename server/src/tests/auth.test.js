import request from 'supertest';
import app from '../app.js';

describe('Auth API', () => {

    describe('POST /api/v1/auth/register', () => {

        it('should register a user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Test Employee',
                    email: 'employee@test.com',
                    password: 'Password@123',
                    role: 'EMPLOYEE',
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.success).toBe(true);

            expect(response.body.data).toHaveProperty('token');

            expect(response.body.data.user.email).toBe(
                'employee@test.com'
            );

            expect(response.body.data.user.role).toBe(
                'EMPLOYEE'
            );

            expect(response.body.data.user).not.toHaveProperty(
                'password'
            );
        });

        it('should not register user with duplicate email', async () => {
            const userData = {
                name: 'Test Employee',
                email: 'employee@test.com',
                password: 'Password@123',
                role: 'EMPLOYEE',
            };

            await request(app)
                .post('/api/v1/auth/register')
                .send(userData);

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData);

            expect(response.statusCode).toBe(409);

            expect(response.body.success).toBe(false);
        });

    });

    describe('POST /api/v1/auth/login', () => {

        beforeEach(async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Login User',
                    email: 'login@test.com',
                    password: 'Password@123',
                    role: 'EMPLOYEE',
                });
        });

        it('should login successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'login@test.com',
                    password: 'Password@123',
                });

            expect(response.statusCode).toBe(200);

            expect(response.body.success).toBe(true);

            expect(response.body.data).toHaveProperty(
                'token'
            );

            expect(response.body.data.user.email).toBe(
                'login@test.com'
            );
        });

        it('should return error for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'login@test.com',
                    password: 'WrongPassword',
                });

            expect(response.statusCode).toBe(401);

            expect(response.body.success).toBe(false);
        });

    });

});