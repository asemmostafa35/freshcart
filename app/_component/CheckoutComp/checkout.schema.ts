import { z } from "zod";

export const checkoutSchema = z.object({
  city: z.string().min(1, "City is required"),
  postalCode: z.string().optional(),
  details: z.string().min(1, "Street address is required"),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
