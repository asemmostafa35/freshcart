"use server";
import { getTokenData } from "@/utilites/getTokenData";

export async function updateCartItem(productId: string, count: number) {
  const { token } = await getTokenData();

  if (!token) {
    throw new Error("You must be logged in to add items to cart.");
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ count }), // Using the passed count parameter
    },
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to add to cart");
  }
  return result;
}
