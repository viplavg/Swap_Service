import { z } from "zod";

export const createShiftSchema = z
  .object({
    employee: z
      .string()
      .min(1, "Please select an employee"),

    date: z
      .string()
      .min(1, "Please select a date"),

    startTime: z
      .string()
      .min(1, "Please select a start time"),

    endTime: z
      .string()
      .min(1, "Please select an end time"),
  })
  .refine(
    (data) => data.endTime > data.startTime,
    {
      message:
        "End time must be after start time",
      path: ["endTime"],
    }
  );