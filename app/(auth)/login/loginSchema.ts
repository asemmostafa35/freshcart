import { z } from "zod";
export const loginSchema = z.object({
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
});

export type loginFormValues = z.infer<typeof loginSchema>;
