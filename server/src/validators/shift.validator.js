import {body} from 'express-validator';

export const createShiftValidator = [
    body('employee')
        .notEmpty()
        .withMessage('Employee ID is required')
        .isMongoId()
        .withMessage('Invalid employee ID'),
    body('date')
        .notEmpty()
        .withMessage('Date is required'),
    body('startTime')
        .notEmpty()
        .withMessage('Start time is required'),
    body('endTime')
        .notEmpty()
        .withMessage('End time is required'),    
];