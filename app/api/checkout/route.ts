import { getTokenData } from "@/utilites/getTokenData";
import { NextRequest, NextResponse } from "next/server";

const ORDERS_URL = "https://ecommerce.routemisr.com/api/v1/orders";

export async function POST(req: NextRequest) {
  const { token } = await getTokenData();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { cartId, paymentMethod, shippingAddress } = body;

    if (!cartId || !shippingAddress) {
      return NextResponse.json(
        { message: "cartId and shippingAddress are required" },
        { status: 400 },
      );
    }

    // Cash on Delivery -> POST /orders/:cartId
    if (paymentMethod === "cash") {
      const res = await fetch(`${ORDERS_URL}/${cartId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ shippingAddress }),
      });
      const payload = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { message: payload.message || "Failed to create order" },
          { status: res.status },
        );
      }
      return NextResponse.json(payload);
    }

    // Pay Online -> POST /orders/checkout-session/:cartId?url=<returnUrl>
    // Adjust `origin` below if your app runs behind a different public URL.
    const origin = req.nextUrl.origin;
    const res = await fetch(
      `${ORDERS_URL}/checkout-session/${cartId}?url=${encodeURIComponent(origin)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ shippingAddress }),
      },
    );
    const payload = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { message: payload.message || "Failed to start checkout session" },
        { status: res.status },
      );
    }
    return NextResponse.json(payload); // { status, session: { url, ... } }
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
