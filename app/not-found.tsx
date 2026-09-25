"use client";

import React from "react";
import Link from "next/link";
import { Home, ArrowLeft, ShoppingCart, Apple, Carrot } from "lucide-react";
import TrustBadges from "./_component/TrustBadges/TrustBadges";

export default function Notfound() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-white flex flex-col justify-between font-sans relative overflow-hidden">
        {/* عناصر زخرفية في الخلفية */}
        <Apple
          className="absolute top-24 left-12 w-10 h-10 text-green-200/70 rotate-[-12deg]"
          strokeWidth={1.5}
        />
        <Carrot
          className="absolute top-32 right-16 w-10 h-10 text-green-200/70 rotate-[15deg]"
          strokeWidth={1.5}
        />
        <Apple
          className="absolute bottom-24 left-24 w-8 h-8 text-green-200/60 rotate-[8deg]"
          strokeWidth={1.5}
        />
        <Carrot
          className="absolute bottom-32 right-10 w-9 h-9 text-green-200/60 rotate-[-10deg]"
          strokeWidth={1.5}
        />

        <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center relative z-10">
          {/* صندوق الأيقونة وشارة 404 */}
          <div className="relative mb-8">
            <div className="w-36 h-36 bg-white rounded-3xl shadow-lg border border-gray-100 flex items-center justify-center">
              <ShoppingCart
                className="w-16 h-16 text-[#00c758]"
                strokeWidth={1.8}
              />
            </div>
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#00c758] text-white text-xl font-black rounded-full shadow-lg border-4 border-white flex items-center justify-center">
              404
            </div>
          </div>

          {/* نقاط زخرفية تحت الصندوق */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00c758]" />
            <span className="w-8 h-2 rounded-full bg-[#00c758]/40" />
            <span className="w-2 h-2 rounded-full bg-[#00c758]" />
          </div>

          {/* النصوص */}
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
            Oops! Nothing Here
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-8 font-medium">
            Looks like this page went out of stock! Don&apos;t worry,
            there&apos;s plenty more fresh content to explore.
          </p>

          {/* أزرار التوجيه - عرض المحتوى بس، مش full width */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-[#00c758] hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md shadow-green-100 transition"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold py-3.5 px-8 rounded-2xl shadow-sm transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* قسم الوجهات الشائعة */}
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Popular Destinations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <Link
                href="/"
                className="px-4 py-2 bg-green-50 text-[#00c758] text-xs font-bold rounded-xl hover:bg-green-100 transition"
              >
                All Products
              </Link>
              <Link
                href="/categories"
                className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Today&apos;s Deals
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      <TrustBadges />
    </>
  );
}
