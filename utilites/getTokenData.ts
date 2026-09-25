"use server";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function getTokenData() {
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    return { token: null, role: null, id: null };
  }

  try {
    const decoded = (await decode({
      secret: process.env.NEXTAUTH_SECRET || "",
      token: sessionToken,
    })) as {
      token?: string;
      accessToken?: string;
      role?: string;
      id?: string;
      _id?: string;
      user?: { token?: string; role?: string; id?: string; _id?: string };
    } | null;

    const token =
      decoded?.token ||
      decoded?.accessToken ||
      decoded?.user?.token ||
      sessionToken;

    const role = decoded?.role || decoded?.user?.role;

    const id =
      decoded?.id || decoded?._id || decoded?.user?.id || decoded?.user?._id;

    return { token, role, id };
  } catch (error) {
    console.error("Error decoding token:", error);
    return { token: null, role: null, id: null };
  }
}
