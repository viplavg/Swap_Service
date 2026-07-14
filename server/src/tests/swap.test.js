import request from 'supertest';
import app from '../app.js';

import User from '../models/user.model.js';
import Shift from '../models/shift.model.js';

describe('Swap API', () => {
    let requester;
    let targetEmployee;
    let manager;

    let requesterToken;
    let managerToken;

    let requesterShift;
    let targetShift;

    beforeEach(async () => {
        requester = await User.create({
            name: 'Requester Employee',
            email: 'requester@test.com',
            password: 'Password@123',
            role: 'EMPLOYEE',
        });

        targetEmployee = await User.create({
            name: 'Target Employee',
            email: 'target@test.com',
            password: 'Password@123',
            role: 'EMPLOYEE',
        });

        manager = await User.create({
            name: 'Test Manager',
            email: 'manager@test.com',
            password: 'Password@123',
            role: 'MANAGER',
        });

        requesterToken = requester.generateToken();
        managerToken = manager.generateToken();

        requesterShift = await Shift.create({
            employee: requester._id,
            date: '2026-07-20',
            startTime: '09:00',
            endTime: '18:00',
        });

        targetShift = await Shift.create({
            employee: targetEmployee._id,
            date: '2026-07-20',
            startTime: '13:00',
            endTime: '22:00',
        });
    });

    describe('POST /api/v1/swaps', () => {
        it('should allow an employee to create a swap request', async () => {
            const response = await request(app)
                .post('/api/v1/swaps')
                .set('Authorization', `Bearer ${requesterToken}`)
                .send({
                    requesterShift: requesterShift._id.toString(),
                    targetShift: targetShift._id.toString(),
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('PENDING');

            expect(response.body.data.requester).toBe(
                requester._id.toString()
            );

            expect(response.body.data.targetEmployee).toBe(
                targetEmployee._id.toString()
            );
        });

        it('should not allow duplicate pending swap requests', async () => {
            const requestData = {
                requesterShift: requesterShift._id.toString(),
                targetShift: targetShift._id.toString(),
            };

            await request(app)
                .post('/api/v1/swaps')
                .set('Authorization', `Bearer ${requesterToken}`)
                .send(requestData);

            const response = await request(app)
                .post('/api/v1/swaps')
                .set('Authorization', `Bearer ${requesterToken}`)
                .send(requestData);

            expect(response.statusCode).toBe(409);
            expect(response.body.success).toBe(false);
        });
    });

    describe('PATCH /api/v1/swaps/:id/approve', () => {
        it('should allow a manager to approve a swap request', async () => {
            const createResponse = await request(app)
                .post('/api/v1/swaps')
                .set('Authorization', `Bearer ${requesterToken}`)
                .send({
                    requesterShift: requesterShift._id.toString(),
                    targetShift: targetShift._id.toString(),
                });

            const swapRequestId = createResponse.body.data._id;

            const response = await request(app)
                .patch(`/api/v1/swaps/${swapRequestId}/approve`)
                .set('Authorization', `Bearer ${managerToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('APPROVED');
            expect(response.body.data.reviewedBy).toBe(
                manager._id.toString()
            );

            const updatedRequesterShift = await Shift.findById(
                requesterShift._id
            );

            const updatedTargetShift = await Shift.findById(
                targetShift._id
            );

            expect(updatedRequesterShift.employee.toString()).toBe(
                targetEmployee._id.toString()
            );

            expect(updatedTargetShift.employee.toString()).toBe(
                requester._id.toString()
            );
        });

        it('should not approve an already approved swap request', async () => {
            const createResponse = await request(app)
                .post('/api/v1/swaps')
                .set('Authorization', `Bearer ${requesterToken}`)
                .send({
                    requesterShift: requesterShift._id.toString(),
                    targetShift: targetShift._id.toString(),
                });

            const swapRequestId = createResponse.body.data._id;

            await request(app)
                .patch(`/api/v1/swaps/${swapRequestId}/approve`)
                .set('Authorization', `Bearer ${managerToken}`);

            const response = await request(app)
                .patch(`/api/v1/swaps/${swapRequestId}/approve`)
                .set('Authorization', `Bearer ${managerToken}`);

            expect(response.statusCode).toBe(409);
            expect(response.body.success).toBe(false);
        });
    });
});