import React from "react";
import { ShoppingCart } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white">
      {/* Container with modern animation */}
      <div className="relative flex flex-col items-center gap-4">
        {/* Animated Icon Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center bg-green-50 rounded-full shadow-inner">
          {/* Outer Spinning Border */}
          <div className="absolute inset-0 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>

          {/* Inner Cart Icon */}
          <ShoppingCart className="w-8 h-8 text-green-600 animate-pulse" />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-lg font-bold text-[#0f172a] tracking-wide">
            Fresh<span className="text-green-600">Cart</span>
          </h3>
          <p className="text-xs text-gray-400 font-medium animate-pulse">
            Loading your products, please wait...
          </p>
        </div>
      </div>
    </div>
  );
}
