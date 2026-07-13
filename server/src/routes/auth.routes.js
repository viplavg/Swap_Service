import express from 'express';
import { registerUser } from '../controllers/auth.controller.js';
import { registerUserValidator } from '../validators/auth.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';   

const router = express.Router();

router.post('/register', registerUserValidator, validateRequest, registerUser);

export default router;