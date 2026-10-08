import { z } from "zod";

export const entitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),

  type: z.enum(["vehicle", "iot_device", "facility"], {
    message: "Entity type is required",
  }),

  status: z.enum(["active", "inactive"], {
    message: "Status is required",
  }),

  latitude: z
    .number()
    .min(-90, "Latitude must be at least -90")
    .max(90, "Latitude must not exceed 90"),

  longitude: z
    .number()
    .min(-180, "Longitude must be at least -180")
    .max(180, "Longitude must not exceed 180"),
});

export type EntityFormValues = z.infer<typeof entitySchema>;
