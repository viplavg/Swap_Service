import User from '../models/user.model.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists',
            });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        const token = newUser.generateToken();

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                    user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
                token,
            },
        });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}