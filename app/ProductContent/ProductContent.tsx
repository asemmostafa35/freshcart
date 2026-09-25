"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  Zap,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import AddToCartBtn from "../_component/AddToCartBtn/AddToCartBtn";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { productType } from "../api/types/productType";

export default function ProductContent({ product }: { product: productType }) {
  const [selectedImage, setSelectedImage] = useState(product?.imageCover);
  const [count, setCount] = useState(1);
  const maxStock = product?.quantity || 1;

  const queryClient = useQueryClient();
  const productId = product?._id || product?.id;

  // جلب المفضلة للتحقق من وجود المنتج
  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        {
          headers: {
            token: localStorage.getItem("token") || "",
          },
          cache: "no-store",
        },
      );
      return await res.json();
    },
  });

  const isinWishlist = wishlistData?.data?.some((item: { _id?: string; id?: string } | string) => {
    if (typeof item === "string") {
      return item === productId;
    }
    return item?._id === productId || item?.id === productId;
  });

  const { mutate: toggleWishlistMutate, isPending: isWishlistPending } =
    useMutation({
      mutationFn: async () => {
        if (isinWishlist) {
          const res = await fetch(
            `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
            {
              method: "DELETE",
              headers: {
                token: localStorage.getItem("token") || "",
              },
            },
          );
          return await res.json();
        } else {
          const res = await fetch(
            "https://ecommerce.routemisr.com/api/v1/wishlist",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token") || "",
              },
              body: JSON.stringify({ productId }),
            },
          );
          return await res.json();
        }
      },
      onSuccess: (data) => {
        toast.success(
          data.message ||
            (isinWishlist
              ? "Removed from wishlist successfully"
              : "Added to wishlist successfully ❤️"),
        );
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Failed to update wishlist");
      },
    });

  // زرار الشير الذكي
  const handleShare = async () => {
    const shareData = {
      title: product?.title || "Product",
      text: product?.description || "Check out this amazing product!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully! 🚀");
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard! 📋");
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  // التحكم في العداد محلياً بحرية تامة بعيداً عن أي قيود للسلة
  const handleIncrement = () => {
    if (count < maxStock) {
      setCount((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Images Section */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="relative w-full h-[350px] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              className="object-contain p-4 transition-all duration-300"
              priority
            />
          </div>

          <div className="relative px-7">
            <Swiper
              modules={[Navigation]}
              spaceBetween={6}
              slidesPerView={3}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              className="w-full"
            >
              {product.images?.map((img: string, index: number) => (
                <SwiperSlide key={index}>
                  <div
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                      selectedImage === img
                        ? "border-green-600 shadow-sm"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md text-gray-700 hover:bg-gray-100 text-xs transition">
              ❮
            </button>
            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md text-gray-700 hover:bg-gray-100 text-xs transition">
              ❯
            </button>
          </div>
        </div>

        {/* Right Side: Product Details & Actions */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-green-50 text-green-700 font-semibold px-3 py-1 rounded-full">
              {product.category?.name}
            </span>
            {product.brand?.name && (
              <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-full">
                {product.brand?.name}
              </span>
            )}
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a0f1c] mb-3">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.ratingsAverage || 0)
                      ? "fill-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {product.ratingsAverage} ({product.ratingsQuantity || 14} reviews)
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-black text-[#0a0f1c]">
              {product.price} EGP
            </span>
          </div>

          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              In Stock
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-6 leading-relaxed border-b border-gray-100 pb-4">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-semibold text-gray-700">
              Quantity
            </span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button
                onClick={handleDecrement}
                className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-bold text-gray-800">{count}</span>
              <button
                onClick={handleIncrement}
                className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {maxStock} available
            </span>
          </div>

          {/* Total Price Box */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
            <span className="text-sm font-bold text-gray-600">
              Total Price:
            </span>
            <span className="text-2xl font-black text-green-600">
              {(product.price * count).toLocaleString()}.00 EGP
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <AddToCartBtn
              productId={productId}
              variant="full"
              className="w-full bg-[#16a34a] hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-sm transition active:scale-[0.98]"
            />

            <button className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]">
              <Zap className="w-5 h-5 fill-white" />
              Buy Now
            </button>
          </div>

          {/* Wishlist & Share */}
          <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-3 mb-8">
            <button
              onClick={() => toggleWishlistMutate()}
              disabled={isWishlistPending}
              className="flex-1 flex items-center justify-center gap-2 text-gray-700 hover:text-red-600 font-semibold text-sm transition disabled:opacity-50"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isinWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
                }`}
              />
              {isWishlistPending
                ? "Processing..."
                : isinWishlist
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
            </button>
            <div className="w-[1px] h-6 bg-gray-200"></div>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 text-gray-700 hover:text-green-600 font-semibold text-sm px-6 transition active:scale-95"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800">
                  Free Delivery
                </h4>
                <p className="text-[11px] text-gray-500">Orders over 500 EGP</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800">
                  30 Days Return
                </h4>
                <p className="text-[11px] text-gray-500">
                  Money back guarantee
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800">
                  Secure Payment
                </h4>
                <p className="text-[11px] text-gray-500">100% Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
