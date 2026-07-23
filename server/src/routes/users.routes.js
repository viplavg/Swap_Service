import express from 'express';
import { authenticateUser } from '../middleware/validation.middleware.js';   
import { authorizeRoles } from '../middleware/role.middleware.js';
import { getEmployees } from '../controllers/user.controller.js';

const router = express.Router();

router.get(
  "/employees",
  authenticateUser,
  authorizeRoles("MANAGER"),
  getEmployees
);

export default router;