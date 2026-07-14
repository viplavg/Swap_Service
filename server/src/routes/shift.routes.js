import express from 'express';
import { createShiftValidator } from '../validators/shift.validator.js';
import { authenticateUser, validateRequest } from '../middleware/validation.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { createShift, getMyShifts } from '../controllers/shift.controller.js';

const router = express.Router();

router.post(
    '/', 
    authenticateUser, 
    authorizeRoles('MANAGER'), 
    createShiftValidator, 
    validateRequest, 
    createShift
);

router.get(
    '/my-shifts',
    authenticateUser,
    getMyShifts
)

export default router;