import { z } from "zod";
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^[A-Z][a-zA-Z0-9@#$%^&+=!]{5,}$/,
        "Password must start with a capital letter and be at least 6 characters",
      ),

    rePassword: z.string().min(1, "Confirm password is required"),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^01[0125][0-9]{8}$/,
        "Must be a valid Egyptian phone number (e.g., 01010700701)",
      ),

    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
