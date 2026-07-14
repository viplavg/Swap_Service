import { body, param } from 'express-validator';

export const createSwapRequestValidator = [
    body('requesterShift')
        .notEmpty()
        .withMessage('Requester shift is required')
        .isMongoId()
        .withMessage('Invalid requester shift id'),
    body('targetShift')
        .notEmpty()
        .withMessage('Target shift is required')
        .isMongoId()
        .withMessage('Invalid target shift id'),
];

export const swapRequestIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid swap request id'),
];