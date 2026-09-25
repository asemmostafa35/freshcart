"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart, Check, Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { addToCart } from "@/app/api/actions/addToCart/addToCart";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AddToCartBtnProps {
  productId: string;
  variant?: "full" | "icon";
  className?: string;
}

export default function AddToCartBtn({
  productId,
  variant = "full",
  className = "",
}: AddToCartBtnProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // نفس queryKey بتاع النافبار، فكل الأزرار والكروت بتشارك نفس الطلب
  // بدل ما كل زر يعمل نداء API منفصل لوحده
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 0,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag to avoid SSR/client mismatch
    setIsMounted(true);
  }, []);

  const isInCart = (() => {
    const products = cartData?.data?.products;
    if (!Array.isArray(products)) return false;
    return products.some(
      (item: { product?: string | { _id?: string; id?: string } }) => {
        const p = item.product;
        if (typeof p === "string") return p === productId;
        return p?._id === productId || p?.id === productId;
      },
    );
  })();

  async function handleAddtoCart(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart || isLoading) return;

    if (!isAuthenticated) {
      toast.error("Please login first to add items to cart.");
      return;
    }

    setIsLoading(true);

    try {
      await addToCart(productId);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart successfully! 🛒");
    } catch (error) {
      console.error("Add to cart error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to add to cart";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isMounted) {
    return (
      <button
        type="button"
        disabled
        className={`flex items-center justify-center gap-2 font-bold ${className}`}
      >
        {variant === "icon" ? <Plus className="w-5 h-5" /> : "Add to Cart"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddtoCart}
      disabled={isInCart}
      aria-label="Add to cart"
      className={`flex items-center justify-center gap-2 font-bold transition-all duration-300 active:scale-95 cursor-pointer ${
        isInCart
          ? variant === "icon"
            ? `${className} cursor-default`
            : "!bg-emerald-50 !text-emerald-700 cursor-default"
          : className
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isInCart ? (
        variant === "icon" ? (
          <Check className="w-5 h-5 text-white stroke-[3]" />
        ) : (
          <>
            <Check className="w-4 h-4 text-emerald-700" />
            In Cart
          </>
        )
      ) : variant === "icon" ? (
        <Plus className="w-5 h-5" />
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </>
      )}
    </button>
  );
}
