import { getTokenData } from "@/utilites/getTokenData";

type ShippingAddress = {
  details: string;
  phone: string;
  city: string;
};

export async function payCash(cartId: string, shippingAddress: ShippingAddress) {
  try {
    const { token } = await getTokenData();

    if (!token) {
      return {
        status: "fail",
        message: "You must be logged in to add items to cart.",
      };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ shippingAddress: shippingAddress }),
      },
    );

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
