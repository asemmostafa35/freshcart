import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const authPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const protectedPages = [
    "/wishlist",
    "/checkout",
    "/profile",
    "/orders",
    "/dashboard",
    "/MyOrders",
    "/settings",
    "/addresses",
  ];
  const url = req.nextUrl.pathname;

  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET || "",
    secureCookie: process.env.NODE_ENV === "production",
  });

  const session = token as {
    token?: string;
    role?: string;
    user?: { role?: string };
  } | null;
  const accessToken = session?.token || token?.role;
  const userRole = session?.role || session?.user?.role;

  if (!accessToken && protectedPages.some((page) => url.startsWith(page))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (url.startsWith("/dashboard") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (accessToken && authPage.some((page) => url.startsWith(page))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/wishlist",
    "/checkout/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/MyOrders",
    "/settings",
    "/addresses",
  ],
};
