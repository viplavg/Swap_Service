import express from 'express';
import { createShiftValidator } from '../validators/shift.validator.js';
import { authenticateUser, validateRequest } from '../middleware/validation.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { createShift, deleteShift, getAllShifts, getAvailableShiftsForSwap, getMyShifts, updateShift } from '../controllers/shift.controller.js';

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

router.get(
    '/available-for-swap',
    authenticateUser,
    authorizeRoles('EMPLOYEE'),
    getAvailableShiftsForSwap
)

router.get(
  "/",
  authenticateUser,
  authorizeRoles("MANAGER"),
  getAllShifts
);

router.patch(
  "/:id",
  authenticateUser,
  authorizeRoles("MANAGER"),
  updateShift
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("MANAGER"),
  deleteShift
);

export default router;