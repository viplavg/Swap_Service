import {validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(
            {
                success: false,
                errors: errors.array().map((error) => ({
                    field: error.path,
                    message: error.msg,
                })),
            }
        );
    }
    next();
}

export const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access',
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access',
        });
    }
}

