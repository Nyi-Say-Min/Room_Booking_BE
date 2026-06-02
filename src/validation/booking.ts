import z from "zod";

export const bookingSchema = z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});
