"use server";

import { getTokenData } from "@/utilites/getTokenData";

export async function addToWishlist(productId: string) {
  const { token } = await getTokenData();

  if (!token) {
    throw new Error("You must be logged in to add items to wishlist");
  }

  const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({ productId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to add to wishlist");
  }

  return data;
}

export async function removeFromWishlist(productId: string) {
  const { token } = await getTokenData();

  if (!token) {
    throw new Error("You must be logged in to modify wishlist");
  }

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to remove from wishlist");
  }

  return data;
}
