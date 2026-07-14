import express from 'express';
import { authenticateUser, validateRequest } from '../middleware/validation.middleware.js';
import { createSwapRequestValidator, swapRequestIdValidator } from '../validators/swap.validator.js';
import { approveSwapRequest, createSwapRequest, getMySwapRequests, getPendingSwapRequests, rejectSwapRequest } from '../controllers/swap.controller.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.post(
    '/',
    authenticateUser,
    createSwapRequestValidator,
    validateRequest,
    createSwapRequest
);

router.patch(
    '/:id/approve',
    authenticateUser,
    authorizeRoles('MANAGER'),
    swapRequestIdValidator,
    validateRequest,
    approveSwapRequest      
);  

router.patch(
    '/:id/reject',
    authenticateUser,
    authorizeRoles('MANAGER'),
    swapRequestIdValidator,
    validateRequest,
    rejectSwapRequest
);

router.get(
    '/pending',
    authenticateUser,
    authorizeRoles('MANAGER'),
    getPendingSwapRequests
)

router.get(
    '/my-requests',
    authenticateUser,
    getMySwapRequests
);

export default router;