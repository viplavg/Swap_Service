import Shift from '../models/shift.model.js';
import User from '../models/user.model.js';
import SwapRequest from '../models/swapRequest.model.js';

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

export const getAvailableShiftsForSwap = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const pendingSwapRequests = await SwapRequest.find({
            status: 'PENDING',
        }).select("requesterShift targetShift");

        const blockedShiftIds = pendingSwapRequests.flatMap(request => [request.requesterShift, request.targetShift]).filter(Boolean);

        const availableShifts = await Shift.find({
            employee: { $ne: currentUserId },
            date: { $gte: today },
            _id: { $nin: blockedShiftIds }
        }).select("_id employee date startTime endTime")
        .sort({
            date: 1,
            startTime: 1
        });

        return res.status(200).json({
            success: true,
            count: availableShifts.length,
            data: availableShifts,
        });

    } catch (error) {
        console.error('Error fetching available shifts for swap:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find()
      .populate("employee", "name email")
      .sort({
        date: 1,
        startTime: 1,
      });

    return res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts,
    });
  } catch (error) {
    console.error("Error fetching shifts:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    
    const shift = await Shift.findById(id);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    const updatedShift = await Shift.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: updatedShift,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteShift = async (req, res) => {
  try {
    const { id } = req.params;

    const shift = await Shift.findById(id);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    const pendingSwapRequest = await SwapRequest.findOne({
      status: "PENDING",
      $or: [
        { requesterShift: id },
        { targetShift: id },
      ],
    });

    if (pendingSwapRequest) {
      return res.status(409).json({
        success: false,
        message:
          "This shift cannot be deleted because it is involved in a pending swap request.",
      });
    }

    await shift.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Shift deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting shift:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};