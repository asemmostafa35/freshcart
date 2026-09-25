import { getTokenData } from "@/utilites/getTokenData";
export async function changeUserPassword(passwordsData: {
  currentPassword: string;
  password: string;
  rePassword: string;
}) {
  const { token } = await getTokenData();

  if (!token) {
    throw new Error("You must be logged in to change your password.");
  }

  const res = await fetch(
    "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify(passwordsData),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update password");
  }

  return data;
}
