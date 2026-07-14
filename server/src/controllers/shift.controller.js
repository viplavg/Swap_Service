import Shift from '../models/shift.model.js';
import User from '../models/user.model.js';

export const createShift = async (req, res) => {
    try {
        const {employee, date, startTime, endTime} = req.body;

        const employeeExists = await User.findById(employee);

        if (!employeeExists) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
            });
        }

        const existingShift = await Shift.findOne({ employee, date });

        if (existingShift) {
            return res.status(409).json({
                success: false,
                message: 'Employee already has a shift for the given date',
            });
        }

        const newShift = new Shift({
            employee,
            date,
            startTime,
            endTime,
        });

        await newShift.save();

        return res.status(201).json({
            success: true,
            message: 'Shift created successfully',
            data: newShift,
        });
    } catch (error) {
        console.error('Error creating shift:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const getMyShifts = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const shifts = await Shift.find({ employee: employeeId });
        return res.status(200).json({
            success: true,
            count: shifts.length,
            data: shifts,
        });
    } catch (error) {
        console.error('Error fetching shifts:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}