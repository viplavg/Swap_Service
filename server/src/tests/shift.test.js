import request from 'supertest';
import app from '../app.js';
import User from '../models/user.model.js';

describe('Shift API', () => {
    const employeeData = {
        name: 'Test Employee',
        email: 'employee@test.com',
        password: 'Password@123',
        role: 'EMPLOYEE',
    };

    const registerUser = async (userData) => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(userData);

        return response.body.data;
    };

    describe('POST /api/v1/shifts', () => {
        it('should allow a manager to create a shift', async () => {
            const manager = await User.create({
                name: 'Test Manager',
                email: 'manager@test.com',
                password: 'Password@123',
                role: 'MANAGER',
            });

            const managerToken = manager.generateToken();

            const employee = await registerUser(employeeData);

            const response = await request(app)
                .post('/api/v1/shifts')
                .set('Authorization', `Bearer ${managerToken}`)
                .send({
                    employee: employee.user.id,
                    date: '2026-07-20',
                    startTime: '09:00',
                    endTime: '18:00',
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                'Shift created successfully'
            );
            expect(response.body.data.employee).toBe(
                employee.user.id
            );
            expect(response.body.data.startTime).toBe('09:00');
            expect(response.body.data.endTime).toBe('18:00');
        });

        it('should not allow an employee to create a shift', async () => {
            const employee = await registerUser(employeeData);

            const response = await request(app)
                .post('/api/v1/shifts')
                .set('Authorization', `Bearer ${employee.token}`)
                .send({
                    employee: employee.user.id,
                    date: '2026-07-20',
                    startTime: '09:00',
                    endTime: '18:00',
                });

            expect(response.statusCode).toBe(403);
            expect(response.body.success).toBe(false);
        });
    });
});