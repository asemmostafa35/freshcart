import { getTokenData } from "@/utilites/getTokenData";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. جلب التوكين
    const tokenData = await getTokenData();
    const token = tokenData?.token;

    if (!token) {
      return NextResponse.json(
        { message: "المستخدم غير مسجل دخول (Unauthorized)" },
        { status: 401 },
      );
    }

    // 2. طلب البيانات من RouteMisr API
    const res = await fetch(
      "https://ecommerce.routemisr.com/api/v1/addresses",
      {
        method: "GET",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        cache: "no-store", // لضمان عدم تخزين العناوين القديمة
      },
    );

    const payload = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: payload.message || "فشل في جلب العناوين" },
        { status: res.status },
      );
    }

    // 3. إرجاع البيانات فور نجاح الطلب (هذا السطر كان مفقوداً)
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/addresses:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "حدث خطأ في السيرفر الداخلي",
      },
      { status: 500 },
    );
  }
}
