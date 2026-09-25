"use server";
import { getTokenData } from "@/utilites/getTokenData";

export async function addToCart(productId: string) {
  try {
    // 1. جلب التوكن
    const { token } = await getTokenData();

    if (!token) {
      return {
        status: "fail",
        message: "You must be logged in to add items to cart.",
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ productId }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    const result = await response.json();

    if (!response.ok) {
      return {
        status: "fail",
        message: result.message || "Failed to add to cart",
      };
    }

    return { status: "success", ...result };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        status: "fail",
        message: "Server is taking too long to respond. Please try again.",
      };
    }
    return {
      status: "fail",
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getCart() {
  try {
    const { token } = await getTokenData();
    if (!token) return null;

    const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      method: "GET",
      headers: { token: token },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) return null;
    return data;
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    return null;
  }
}
