import { Category, productType } from "../types/productType";
import { RegisterFormValues } from "@/app/(auth)/register/registerSchema";
import { getSession } from "next-auth/react";
export async function getAllProducts(): Promise<productType[]> {
  try {
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/products",
    );
    if (!response.ok) throw new Error("API Error");
    const payload = await response.json();
    return payload.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
type SessionWithToken = {
  token?: string;
  accessToken?: string;
  user?: { token?: string };
};

async function getToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const session = (await getSession()) as SessionWithToken | null;
    return (
      session?.token || session?.user?.token || session?.accessToken || null
    );
  } catch (error) {
    console.error("Error fetching session token:", error);
    return null;
  }
}
export async function getCart(): Promise<unknown> {
  try {
    const token = await getToken();
    if (!token) {
      return null;
    }

    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v2/cart",
      {
        headers: {
          token: token,
        },
      },
    );

    if (!response.ok) throw new Error("API Error");

    const payload = await response.json();
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getShopCategory(): Promise<Category[]> {
  try {
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/categories",
    );
    if (!response.ok) throw new Error("API Error");
    const payload = await response.json();
    return payload.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getspecificCategory({ id }: { id: string }) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${id}`,
    );
    if (!response.ok) throw new Error("API Error");
    const payload = await response.json();
    return payload.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getSubcategoriesOnCategory(categoryId: string) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${categoryId}/subcategories`,
    );
    if (!response.ok) throw new Error("Failed to fetch subcategories");
    const payload = await response.json();
    return payload.data; // مصفوفة الأقسام الفرعية
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSingleProducts(prodId: string) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${prodId}`,
    );
    if (!response.ok) throw new Error("API Error");
    const payload = await response.json();
    return payload.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export type RegisterPayload = Omit<RegisterFormValues, "terms">;

export const registerUser = async (payload: RegisterPayload) => {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "An error occurred during sign up");
  }

  return result;
};

export type lgoinPayload = Omit<RegisterFormValues, "terms">;

export const loginUser = async (payload: RegisterPayload) => {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/signin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "An error occurred during sign in");
  }

  return result;
};
