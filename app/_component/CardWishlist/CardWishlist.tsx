"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Check, Trash2, ArrowLeft, ShoppingCart } from "lucide-react";
import { productType } from "@/app/api/types/productType";
import AddToCartBtn from "../AddToCartBtn/AddToCartBtn";

type WishlistProduct = productType & {
  id?: string;
  images?: string[];
};

interface CardWishlistProps {
  dataWishlist:
    | { data?: WishlistProduct[]; count?: number }
    | WishlistProduct[];
  onDelete: (productId: string) => void;
  cartIds?: Set<string>;
}

export default function CardWishlist({
  dataWishlist,
  onDelete,
  cartIds = new Set(),
}: CardWishlistProps) {
  const products: WishlistProduct[] = Array.isArray(dataWishlist)
    ? dataWishlist
    : dataWishlist?.data || [];

  const itemCount = Array.isArray(dataWishlist)
    ? dataWishlist.length
    : dataWishlist?.count || products.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb - تم التكبير لـ text-sm */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800 transition">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Wishlist</span>
      </nav>

      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        </div>
        <div>
          {/* Title - تم التكبير لـ text-3xl */}
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          {/* Subtitle - تم التكبير لـ text-base */}
          <p className="text-base text-gray-500">
            {itemCount} {itemCount === 1 ? "item" : "items"} saved
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {/* Table Header - تم التكبير لـ text-sm */}
        <div className="grid grid-cols-12 px-6 py-3.5 bg-gray-50/80 text-sm font-semibold text-gray-500 border-b border-gray-100">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body / Products List */}
        <div className="divide-y divide-gray-100">
          {products.map((product) => {
            const productId = (product._id || product.id) as string;
            const isInCart = cartIds.has(productId);

            return (
              <div
                key={productId}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
              >
                {/* Product Info */}
                <div className="col-span-6 flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 p-1">
                    <Image
                      src={
                        product.imageCover ||
                        product.images?.[0] ||
                        "/placeholder.png"
                      }
                      alt={product.title || "Product"}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    {/* اسم المنتج - تم التكبير لـ text-base */}
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    {/* فئة المنتج - تم التكبير لـ text-sm */}
                    <p className="text-sm text-gray-500 mt-1">
                      {product.category?.name}
                    </p>
                  </div>
                </div>

                {/* Price - تم التكبير لـ text-base */}
                <div className="col-span-2 text-center font-bold text-gray-900 text-base">
                  {product.price} EGP
                </div>

                {/* Status - تم التكبير لـ text-sm */}
                <div className="col-span-2 flex justify-center">
                  {isInCart ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-600">
                      <ShoppingCart className="w-4 h-4" /> In Cart
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Actions - تم تكبير الأزرار لـ text-sm */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  {isInCart ? (
                    <Link
                      href="/cart"
                      className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                      <Check className="w-4 h-4" /> View Cart
                    </Link>
                  ) : (
                    <AddToCartBtn
                      productId={productId}
                      variant="full"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-xl"
                    />
                  )}

                  <button
                    onClick={() => onDelete && onDelete(productId)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-gray-100"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Shopping Link - تم التكبير لـ text-base */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-base text-gray-600 hover:text-emerald-600 transition font-medium"
      >
        <ArrowLeft className="w-5 h-5" /> Continue Shopping
      </Link>
    </div>
  );
}
