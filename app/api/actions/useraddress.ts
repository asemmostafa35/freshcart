"use server";

import { getTokenData } from "@/utilites/getTokenData";

// 1. إضافة عنوان جديد (POST)
export async function addAddress(addressData: {
  name: string;
  details: string;
  phone: string;
  city: string;
}) {
  const tokenData = await getTokenData();
  const token = typeof tokenData === "string" ? tokenData : tokenData?.token;

  if (!token) {
    throw new Error("غير مصرح لك، يرجى تسجيل الدخول أولاً");
  }

  const res = await fetch("https://ecommerce.routemisr.com/api/v1/addresses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify(addressData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "فشل إضافة العنوان");
  }

  return data;
}

// 2. حذف عنوان محدد (DELETE)
export async function deleteAddress(addressId: string) {
  const tokenData = await getTokenData();
  const token = typeof tokenData === "string" ? tokenData : tokenData?.token;

  if (!token) {
    throw new Error("غير مصرح لك، يرجى تسجيل الدخول أولاً");
  }

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`,
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
    throw new Error(data.message || "فشل حذف العنوان");
  }

  return data;
}

// 3. جلب تفاصيل عنوان محدد (GET Specific Address)
export async function getSpecificAddress(addressId: string) {
  const tokenData = await getTokenData();
  const token = typeof tokenData === "string" ? tokenData : tokenData?.token;

  if (!token) {
    throw new Error("غير مصرح لك، يرجى تسجيل الدخول أولاً");
  }

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "فشل جلب تفاصيل العنوان");
  }

  return data;
}
