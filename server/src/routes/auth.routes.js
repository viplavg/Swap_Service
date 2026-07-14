import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { registerUserValidator, loginUserValidator } from '../validators/auth.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';   

const router = express.Router();

router.post('/register', registerUserValidator, validateRequest, registerUser);
router.post('/login', loginUserValidator, validateRequest, loginUser);


export default router;