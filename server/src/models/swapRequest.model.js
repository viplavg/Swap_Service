import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        targetEmployee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        requesterShift: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shift',
            required: true,
        },
        targetShift: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shift',
            required: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING',
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        reviewedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,           
    }
);

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;