"use server";

import { RegisterFormValues } from "@/app/(auth)/register/registerSchema";

export type RegisterPayload = Omit<RegisterFormValues, "terms">;
export type LoginPayload = Pick<RegisterFormValues, "email" | "password">;

export const registerUser = async (payload: RegisterPayload) => {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "An error occurred during sign up");
  }
  return result;
};
