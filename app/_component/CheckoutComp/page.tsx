"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import CheckoutForm from "./checkoutFrom";

type CheckoutItem = {
  _id?: string;
  count: number;
  price: number;
  product?: { imageCover?: string; title?: string };
};

export default function CheckoutComp() {
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading checkout...</div>
    );
  }

  const items: CheckoutItem[] = cart?.data?.products || [];
  const totalItems =
    cart?.numOfCartItems ?? items.reduce((s, i) => s + i.count, 0);
  const subtotal = cart?.data?.totalCartPrice ?? 0;
  const shipping = 0;
  const total = subtotal + shipping;
  const cartId = cart?.cartId || cart?.data?._id;

  if (totalItems === 0 || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* 🛒 أيقونة السلة باللون الأخضر */}
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-500">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-1 text-sm text-gray-500">
          When you add products to your cart, you can complete your checkout
          here.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-green-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-green-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-3 text-sm text-gray-400">
        <Link href="/" className="hover:text-green-600">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/cart" className="hover:text-green-600">
          Cart
        </Link>{" "}
        / <span className="font-semibold text-gray-700">Checkout</span>
      </div>

      {/* Title */}
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M9 12h6M9 16h6M9 8h1" />
              <rect x="5" y="3" width="14" height="18" rx="2" />
            </svg>
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
            Complete Your Order
          </h1>
        </div>
        <Link
          href="/cart"
          className="hidden items-center gap-1.5 text-sm font-semibold text-green-600 hover:underline sm:flex"
        >
          ← Back to Cart
        </Link>
      </div>
      <p className="mb-6 text-sm text-gray-600">
        Review your items and complete your purchase
      </p>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left column: Form */}
        <CheckoutForm cartId={cartId} />

        {/* Right column: Order Summary */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white lg:sticky lg:top-4">
          <div className="bg-gradient-to-br from-green-600 to-green-700 px-5 py-4 text-white">
            <div className="flex items-center gap-2 text-base font-extrabold">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Order Summary
            </div>
            <div className="mt-1 text-sm opacity-90">{totalItems} items</div>
          </div>

          <div className="px-5 py-5">
            <div className="mb-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-2.5"
                >
                  <div className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <Image
                      src={item.product?.imageCover || ""}
                      alt={item.product?.title || "Product"}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-gray-900">
                      {item.product?.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.count} × {item.price} EGP
                    </div>
                  </div>
                  <div className="flex-none text-sm font-bold text-gray-900">
                    {item.count * item.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-2 text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">
                {subtotal} EGP
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <hr className="my-2 border-dashed border-gray-200" />
            <div className="flex items-baseline justify-between py-2 pb-2">
              <span className="text-base font-extrabold text-gray-900">
                Total
              </span>
              <span className="text-xl font-extrabold text-gray-900">
                {total}
                <span className="ml-1 text-xs font-semibold text-gray-400">
                  EGP
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
