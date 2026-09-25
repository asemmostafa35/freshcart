import { getTokenData } from "@/utilites/getTokenData";
import { NextResponse } from "next/server";

export async function GET() {
  const { token } = await getTokenData();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
      method: "GET",
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    });

    const payload = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: payload.message || "Failed to fetch wishlist" },
        { status: res.status },
      );
    }

    return NextResponse.json(payload);
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
