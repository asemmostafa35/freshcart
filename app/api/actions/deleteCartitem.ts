"use server";
import { getTokenData } from "@/utilites/getTokenData";

export async function deleteCartitem(productId: string) {
  const { token } = await getTokenData();

  if (!token) {
    throw new Error("You must be logged in to remove items.");
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v2/cart/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to remove item from cart");
  }

  return result;
}
