"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link"; // أضفنا مكتبة الـ Link الخاصة بـ Next.js

export default function Banners() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
      {/* الكارت الأول (الأخضر) */}
      <motion.div
        initial={{ opacity: 0, x: -250 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
        className="relative overflow-hidden rounded-[20px] p-8 text-white bg-[#0AAD6A] shadow-sm flex flex-col justify-between min-h-[270px] max-w-[620px] w-full mx-auto"
      >
        {/* الزاوية الشفافة البسيطة */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-bl-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 w-fit">
            <span>🔥</span> Deal of the Day
          </div>
          <h2 className="text-[28px] font-bold mb-1 tracking-tight">
            Fresh Organic Fruits
          </h2>
          <p className="text-white/90 text-[15px] mb-6 font-light">
            Get up to 40% off on selected organic fruits
          </p>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[34px] font-extrabold tracking-tight leading-none">
              40% OFF
            </span>
            <span className="text-[13px] text-white/90 font-medium">
              Use code: <span className="font-bold text-white">ORGANIC40</span>
            </span>
          </div>
        </div>

        {/* ربط الزرار بـ Link */}
        <Link href="/shop" className="relative z-10 w-fit">
          <button className="bg-white text-[#0AAD6A] text-[15px] hover:bg-gray-50 font-bold px-6 py-2.5 rounded-full transition flex items-center gap-2 shadow-sm cursor-pointer">
            Shop Now <ArrowRight className="w-[18px] h-[18px]" />
          </button>
        </Link>
      </motion.div>

      {/* الكارت الثاني (البرتقالي) */}
      <motion.div
        initial={{ opacity: 0, x: 250 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
        className="relative overflow-hidden rounded-[20px] p-8 text-white bg-gradient-to-r from-[#FF8C1A] to-[#F54358] shadow-sm flex flex-col justify-between min-h-[270px] max-w-[620px] w-full mx-auto"
      >
        {/* الزاوية الشفافة البسيطة */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-bl-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 w-fit">
            <span>✨</span> New Arrivals
          </div>
          <h2 className="text-[28px] font-bold mb-1 tracking-tight">
            Exotic Vegetables
          </h2>
          <p className="text-white/90 text-[15px] mb-6 font-light">
            Discover our latest collection of premium vegetables
          </p>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[34px] font-extrabold tracking-tight leading-none">
              25% OFF
            </span>
            <span className="text-[13px] text-white/90 font-medium">
              Use code: <span className="font-bold text-white">FRESH25</span>
            </span>
          </div>
        </div>

        {/* ربط الزرار بـ Link */}
        <Link href="/shop" className="relative z-10 w-fit">
          <button className="bg-white text-[#F54358] text-[15px] hover:bg-gray-50 font-bold px-6 py-2.5 rounded-full transition flex items-center gap-2 shadow-sm cursor-pointer">
            Explore Now <ArrowRight className="w-[18px] h-[18px]" />
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
