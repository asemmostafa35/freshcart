"use server";
import { getTokenData } from "@/utilites/getTokenData";

export async function clearUserCart() {
  try {
    const { token } = await getTokenData();

    if (!token) {
      return {
        status: "fail",
        message: "You must be logged in to remove items.",
      };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/cart`,
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
      console.error("API Error Response:", result);
      return {
        status: "fail",
        message: result.message || "Failed to clear cart",
      };
    }

    return { status: "success", ...result };
  } catch (error) {
    console.error("Server Action Exception:", error);
    return {
      status: "fail",
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
