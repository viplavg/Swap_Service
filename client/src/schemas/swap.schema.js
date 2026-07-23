import {z} from "zod";

export const createSwapSchema = z.object({
    requesterShift: z.string().min(1, "Please select your shift to swap"),
    targetShift: z.string().min(1, "Please select a target shift"),
});