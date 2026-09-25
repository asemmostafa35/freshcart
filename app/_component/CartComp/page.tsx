"use client";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCartitem } from "@/app/api/actions/deleteCartitem";
import { updateCartItem } from "@/app/api/actions/updateCartItem";
import { clearUserCart } from "@/app/api/actions/clearUserCart";
import { toast } from "react-hot-toast";

type CartProduct = {
  _id?: string;
  id?: string;
  title?: string;
  imageCover?: string;
  category?: { name?: string };
};

type CartItem = {
  _id?: string;
  product?: CartProduct | string;
  count: number;
  price: number;
};

function getCartProduct(item: CartItem): CartProduct {
  return typeof item.product === "string" ? {} : item.product || {};
}

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export default function CartComp() {
  const queryClient = useQueryClient();
  const FREE_SHIPPING_THRESHOLD = 1000;
  const SHIPPING_COST = 50;

  const {
    data: cart,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const {
    mutate: deleteMutate,
    isPending: isDeleting,
    variables: deletingId,
  } = useMutation({
    mutationFn: async (productId: string) => {
      const res = await deleteCartitem(productId);
      if (
        res &&
        (res.status === "fail" ||
          res.status === "error" ||
          res.message?.includes("error"))
      ) {
        throw new Error(res.message || "Failed to delete item");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Failed to delete item"));
    },
  });

  const { mutate: clearUserCartMutate, isPending: isDeletingAll } = useMutation(
    {
      mutationFn: async () => {
        const res = await clearUserCart();

        if (
          res &&
          (res.status === "fail" ||
            res.status === "error" ||
            res.message?.includes("error"))
        ) {
          throw new Error(res.message || "Failed to clear cart");
        }
        return res;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        toast.success("Cart cleared successfully");
      },
      onError: (err) => {
        toast.error(getErrorMessage(err, "Failed to clear cart"));
      },
    },
  );

  // 4. Update Quantity Mutation
  const {
    mutate: updateCountMutate,
    isPending: isUpdating,
    variables: updatingVars,
  } = useMutation({
    mutationFn: async ({
      productId,
      count,
    }: {
      productId: string;
      count: number;
    }) => {
      const res = await updateCartItem(productId, count);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Failed to update item"));
    },
  });

  const error = queryError ? queryError.message : null;
  const isPending = isDeleting || isUpdating || isDeletingAll;

  const isRowBusy = (currentId: string) =>
    (isDeleting && deletingId === currentId) ||
    (isUpdating && updatingVars?.productId === currentId);

  const getProductId = (item: CartItem): string =>
    (typeof item.product === "string"
      ? item.product
      : item.product?._id || item.product?.id) ||
    item._id ||
    "";

  const handleRemove = (item: CartItem) => {
    deleteMutate(getProductId(item));
  };

  const handleIncrement = (item: CartItem, currentCount: number) => {
    updateCountMutate({ productId: getProductId(item), count: currentCount + 1 });
  };

  const handleDecrement = (item: CartItem, currentCount: number) => {
    if (currentCount > 1) {
      updateCountMutate({ productId: getProductId(item), count: currentCount - 1 });
    }
  };

  const items: CartItem[] = cart?.data?.products || cart?.products || [];
  const totalItems = items.reduce((acc, item) => acc + item.count, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.count,
    0,
  );

  const freeShip = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shipping = freeShip ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading your shopping cart...
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-14 text-center">
        <h3 className="mb-1 text-lg font-bold text-gray-900">
          Sign in to see your cart
        </h3>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700"
        >
          Sign In
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
        / <span className="font-semibold text-gray-700">Shopping Cart</span>
      </div>

      {/* Title */}
      <div className="mb-1 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M6 6h15l-1.5 9h-12z" />
            <path d="M6 6L5 3H2" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="17" cy="20" r="1.5" />
          </svg>
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
          Shopping Cart
        </h1>
      </div>
      <p className="mb-6 text-sm text-gray-600">
        You have{" "}
        <span className="font-bold text-green-600">
          {totalItems} item{totalItems !== 1 ? "s" : ""}
        </span>{" "}
        in your cart
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 💡 الشرط الرئيسي: إذا كانت السلة فارغة نعرض كارت إعلامي فقط بعرض الصفحة */}
      {items.length === 0 ? (
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
          <h2 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>
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
      ) : (
        /* 💡 إذا كانت السلة تحتوي على منتجات، نعرض شبكة العمودين (المنتجات + Order Summary) */
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
          {/* Items column */}
          <div>
            {items.map((item) => {
              const currentId = getProductId(item);
              const busy = isRowBusy(currentId);
              const product = getCartProduct(item);
              return (
                <div
                  key={item._id}
                  className={`mb-4 flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-opacity ${
                    busy ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex flex-none flex-col items-center gap-2">
                    <div className="flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                      <Image
                        src={product.imageCover || ""}
                        alt={product.title || "Product Image"}
                        width={90}
                        height={90}
                        className="h-full w-full object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="whitespace-nowrap rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                      In Stock
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <h3 className="mb-1 line-clamp-1 text-base font-bold text-gray-900">
                        {product.title}
                      </h3>
                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                        {product.category?.name && (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                            {product.category.name}
                          </span>
                        )}
                        <span>
                          · SKU:{" "}
                          {product._id
                            ? product._id.slice(-6).toUpperCase()
                            : ""}
                        </span>
                      </div>
                      <div className="mb-3 text-lg font-extrabold text-green-600">
                        {item.price} EGP{" "}
                        <span className="text-xs font-medium text-gray-400">
                          per unit
                        </span>
                      </div>

                      <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-200">
                        <button
                          type="button"
                          disabled={busy || item.count <= 1}
                          onClick={() => handleDecrement(item, item.count)}
                          className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="w-9 text-center text-sm font-bold">
                          {item.count}
                        </span>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleIncrement(item, item.count)}
                          className="flex h-8 w-8 items-center justify-center bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-between">
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Total</div>
                        <div className="text-lg font-extrabold text-gray-900">
                          {item.price * item.count}
                          <span className="ml-1 text-xs font-medium text-gray-400">
                            EGP
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleRemove(item)}
                        aria-label="Remove item"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-40"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-between px-1 pt-1 text-sm">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-semibold text-green-600 hover:underline"
              >
                ← Continue Shopping
              </Link>
              <button
                type="button"
                disabled={isPending}
                onClick={() => clearUserCartMutate()}
                className="inline-flex items-center gap-1.5 text-gray-400 hover:text-red-500 disabled:opacity-40"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
                Clear all items
              </button>
            </div>
          </div>

          {/* Order summary column */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white lg:sticky lg:top-24">
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
              <div className="mt-1 text-sm opacity-90">
                {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
              </div>
            </div>

            <div className="px-5 py-5">
              <div
                className={`mb-4 flex items-center gap-3 rounded-lg px-3.5 py-3 ${
                  freeShip ? "bg-gray-50" : "bg-orange-50"
                }`}
              >
                <span
                  className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${
                    freeShip
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="1" y="6" width="15" height="12" rx="1" />
                    <path d="M16 10h4l3 3v5h-7z" />
                    <circle cx="5.5" cy="19.5" r="1.7" />
                    <circle cx="18.5" cy="19.5" r="1.7" />
                  </svg>
                </span>
                <div>
                  <b
                    className={`block text-sm ${freeShip ? "text-green-700" : "text-orange-700"}`}
                  >
                    {freeShip ? "Free Shipping!" : "Almost there!"}
                  </b>
                  <span
                    className={`text-xs ${freeShip ? "text-green-600" : "text-orange-600"}`}
                  >
                    {freeShip
                      ? "You qualify for free delivery"
                      : `Add ${FREE_SHIPPING_THRESHOLD - subtotal} EGP more for free delivery`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {subtotal} EGP
                </span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm text-gray-600">
                <span>Shipping</span>
                <span
                  className={`font-semibold ${freeShip ? "text-green-600" : "text-gray-900"}`}
                >
                  {freeShip ? "FREE" : `${shipping} EGP`}
                </span>
              </div>
              <hr className="my-2 border-dashed border-gray-200" />
              <div className="flex items-baseline justify-between py-2 pb-5">
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
              <Link href={`/checkout`} className="block">
                <button
                  type="button"
                  disabled={items.length === 0}
                  className="mb-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-green-600 to-green-700 text-sm font-extrabold text-white hover:brightness-105 disabled:opacity-40"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Secure Checkout
                </button>
              </Link>

              <Link
                href="/"
                className="block text-center text-sm font-semibold text-green-600 hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
