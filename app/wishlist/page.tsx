"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { removeFromWishlist } from "@/app/api/actions/addToWishlist/addToWishlist";
import { productType } from "@/app/api/types/productType";
import CardWishlist from "../_component/CardWishlist/CardWishlist";
import { useSession } from "next-auth/react";

export default function WishlistPage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [products, setProducts] = useState<productType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      if (!isAuthenticated) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/wishlist");
        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }

        const data = await response.json();
        setProducts(data?.data || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    }

    if (status !== "loading") {
      loadWishlist();
    }
  }, [isAuthenticated, status]);

  const handleDelete = async (productId: string) => {
    const previousProducts = products;
    // التحديث الفوري للواجهة (Optimistic Update)
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));

    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error("Error deleting item:", error);
      setProducts(previousProducts); // التراجع في حال حدوث خطأ
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500 font-medium text-lg">Loading Wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh]">
      {products.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
              <Heart className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-bold text-[#0a0f1c] mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-base text-gray-500 max-w-sm mb-6 leading-relaxed">
              Browse products and save your favorites here. Sign in to sync your
              wishlist across devices.
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Link
                href="/shop"
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-medium py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-sm text-base"
              >
                Browse Products
                <ArrowRight className="w-5 h-5" />
              </Link>

              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-6 rounded-xl border border-gray-200 transition duration-200 flex items-center justify-center text-base"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <CardWishlist dataWishlist={products} onDelete={handleDelete} />
      )}
    </div>
  );
}
