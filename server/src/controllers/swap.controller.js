import Shift from "../models/shift.model.js";
import SwapRequest from "../models/swapRequest.model.js";
import mongoose from "mongoose";

export const createSwapRequest = async (req, res) => {
    try {
        const { requesterShift, targetShift } = req.body;
        const requester = req.user.id;

        if(requesterShift === targetShift) {
            return res.status(400).json({
                success: false,
                message: 'Requester shift and target shift cannot be the same',
            });
        }

        const requesterShiftDoc = await Shift.findById(requesterShift);
        const targetShiftDoc = await Shift.findById(targetShift);

        if (!requesterShiftDoc || !targetShiftDoc) {
            return res.status(404).json({
                success: false,
                message: 'One or both shifts not found',
            });
        }

        if (requesterShiftDoc.employee.toString() !== requester.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only request a swap for your own shift',
            });
        }

        if (targetShiftDoc.employee.toString() === requester.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot swap shifts with yourself',
            });
        }

        const existingPendingRequest = await SwapRequest.findOne({
            requester,
            requesterShift,
            targetShift,
            status: 'PENDING',
        });

        if (existingPendingRequest) {
            return res.status(409).json({
                success: false,
                message: 'A pending swap request already exists for these shifts',
            });
        }

        const newSwapRequest = await SwapRequest.create({
            requester,
            targetEmployee: targetShiftDoc.employee,
            requesterShift,
            targetShift,
        });
        
        return res.status(201).json({
            success: true,
            message: 'Swap request created successfully',
            data: newSwapRequest,
        });

    } catch (error) {
        console.error('Error creating swap request:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const approveSwapRequest = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {id} = req.params;
        const managerId = req.user.id;

        const swapRequest = await SwapRequest.findById(id).populate('requesterShift targetShift').session(session);

        if (!swapRequest) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Swap request not found',
            });
        }

        if (swapRequest.status !== 'PENDING') {
            await session.abortTransaction();
            return res.status(409).json({
                success: false,
                message: 'Only pending swap requests can be approved',
            });
        }

        // Swap the shifts between employees
        const requesterShift = swapRequest.requesterShift;
        const targetShift = swapRequest.targetShift;

        if(!requesterShift || !targetShift) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'One or both shifts no longer exist',
            });
        }

        const tempEmployee = requesterShift.employee;
        requesterShift.employee = targetShift.employee;
        targetShift.employee = tempEmployee;

        await requesterShift.save({ session });
        await targetShift.save({ session });

        swapRequest.status = 'APPROVED';
        swapRequest.reviewedBy = managerId;
        swapRequest.reviewedAt = new Date();

        await swapRequest.save({ session });

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: 'Swap request approved and shifts swapped successfully',
            data: swapRequest,
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error approving swap request:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    } finally {
        await session.endSession();
    }
}

export const rejectSwapRequest = async (req, res) => {
    try {
        const {id} = req.params;
        const managerId = req.user.id;
        
        const swapRequest = await SwapRequest.findById(id);

        if (!swapRequest) {
            return res.status(404).json({
                success: false,
                message: 'Swap request not found',
            });
        }

        if (swapRequest.status !== 'PENDING') {
            return res.status(409).json({
                success: false,
                message: 'Only pending swap requests can be rejected',
            });
        }

        // Assuming the manager has the authority to reject the swap
        swapRequest.status = 'REJECTED';
        swapRequest.reviewedBy = managerId;
        swapRequest.reviewedAt = new Date();

        await swapRequest.save();

        return res.status(200).json({
            success: true,
            message: 'Swap request rejected successfully',
            data: swapRequest,
        });

    } catch (error) {
        console.error('Error rejecting swap request:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const getPendingSwapRequests = async (req, res) => {
    try {
        const pendingSwapRequests = await SwapRequest.find({ status: 'PENDING' })
            .populate('requester', 'name email')
            .populate('targetEmployee', 'name email')
            .populate('requesterShift')
            .populate('targetShift');
        return res.status(200).json({
            success: true,
            count: pendingSwapRequests.length,
            data: pendingSwapRequests,
        });
    } catch (error) {
        console.error('Error fetching pending swap requests:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const getMySwapRequests = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const swapRequests = await SwapRequest.find({
            $or: [
                { requester: employeeId },
                { targetEmployee: employeeId }
            ]
        })
        .populate('requester', 'name email')
        .populate('targetEmployee', 'name email')
        .populate('requesterShift')
        .populate('targetShift')
        .populate('reviewedBy', 'name email');

        return res.status(200).json({
            success: true,
            count: swapRequests.length,
            data: swapRequests,
        });
    } catch (error) {
        console.error('Error fetching my swap requests:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}