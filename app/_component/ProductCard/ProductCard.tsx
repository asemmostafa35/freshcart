"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, RefreshCw, Eye, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { productType } from "@/app/api/types/productType";
import AddToCartBtn from "../AddToCartBtn/AddToCartBtn";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/app/api/actions/addToWishlist/addToWishlist";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ProductCardProps {
  product: productType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [guestInWishlist, setGuestInWishlist] = useState(false);

  // طلب واحد مشترك لكل كروت المنتجات بدل ما كل كارت يعمل طلبه الخاص
  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist");
      if (!res.ok) return null;
      return res.json();
    },
    enabled: isLoggedIn,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      const guestWishlist: string[] = JSON.parse(
        localStorage.getItem("guestWishlist") || "[]",
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read from localStorage on mount, not available during SSR
      setGuestInWishlist(guestWishlist.includes(product._id));
    }
  }, [product._id, isLoggedIn]);

  const isInWishlist = isLoggedIn
    ? !!wishlistData?.data?.some(
        (item: { _id?: string; id?: string } | string) =>
          (typeof item === "string" ? item : item._id) === product._id ||
          (typeof item === "string" ? item : item.id) === product._id,
      )
    : guestInWishlist;

  const handleWishlistToggle = async () => {
    setIsLoading(true);

    try {
      if (isLoggedIn) {
        if (isInWishlist) {
          await removeFromWishlist(product._id);
          toast.success("Removed from wishlist");
        } else {
          await addToWishlist(product._id);
          toast.success("Added to wishlist ❤️");
        }
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        return;
      }

      // للزائر (LocalStorage)
      let guestWishlist: string[] = JSON.parse(
        localStorage.getItem("guestWishlist") || "[]",
      );

      if (!isInWishlist) {
        guestWishlist.push(product._id);
        localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
        setGuestInWishlist(true);
        toast.success("Added to local wishlist ❤️");
      } else {
        guestWishlist = guestWishlist.filter((id) => id !== product._id);
        localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
        setGuestInWishlist(false);
        toast.success("Removed from local wishlist");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative flex flex-col">
      <div className="relative w-full aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden">
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          className="object-cover w-full h-full"
        />

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition-opacity z-10">
          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-green-600 hover:bg-gray-50 transition cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : (
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isInWishlist ? "text-red-500 fill-red-500" : ""
                }`}
                strokeWidth={1.8}
              />
            )}
          </button>

          <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-green-600 hover:bg-gray-50 transition">
            <RefreshCw className="w-4 h-4" strokeWidth={1.8} />
          </button>

          <Link href={`/productDetails/${product._id}`}>
            <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-green-600 hover:bg-gray-50 transition">
              <Eye className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </Link>
        </div>
      </div>

      <Link href={`/productDetails/${product._id}`}>
        <span className="text-xs text-gray-500 font-medium mb-1.5 mt-5">
          {product.category?.name}
        </span>
        <h3 className="text-base font-bold text-[#0a0f1c] mb-3 line-clamp-1">
          {product.title}
        </h3>
      </Link>

      <div className="flex items-center gap-1.5 mb-5">
        <div className="flex items-center text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4"
              fill={i < Math.round(product.ratingsAverage) ? "#fbbf24" : "none"}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {product.ratingsAverage} ({product.ratingsQuantity})
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-extrabold text-[#0a0f1c]">
          {product.price} EGP
        </span>

        <AddToCartBtn
          productId={product._id}
          variant="icon"
          className="w-10 h-10 bg-[#16a34a] hover:bg-green-700 text-white rounded-full shadow-sm transition active:scale-95"
        />
      </div>
    </div>
  );
}
