export async function forgotPassword({ email }: { email: string }) {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Something went wrong");
  }

  return payload;
}

export async function VerifyResetCode({ resetCode }: { resetCode: string }) {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resetCode }),
    },
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Something went wrong");
  }

  return payload;
}

export async function ResetPassword({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        newPassword,
      }),
    },
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Something went wrong");
  }

  return payload;
}
