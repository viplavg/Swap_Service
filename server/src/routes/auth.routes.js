import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { registerUserValidator, loginUserValidator } from '../validators/auth.validator.js';
import { authenticateUser, validateRequest } from '../middleware/validation.middleware.js';   
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.post('/register', registerUserValidator, validateRequest, registerUser);
router.post('/login', loginUserValidator, validateRequest, loginUser);
router.get(
    '/profile',
    authenticateUser,
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: 'Protected route accessed successfully',
            user: req.user,
        });
    }
);

router.get(
    '/manager-test',
    authenticateUser,
    authorizeRoles('MANAGER'),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: 'Manager route accessed successfully',
        });
    }
);

export default router;