"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type SliderType = {
  pageList: string[];
  spaceBetween?: number;
  slidesPerView?: number;
};

const slideContent = [
  {
    title: "Fresh Products Delivered to your Door",
    subtitle: "Get 20% off your first order",
    btnPrimary: "Shop Now",
    linkPrimary: "/products",
    btnSecondary: "View Deals",
    linkSecondary: "/categories",
  },
  {
    title: "Premium Quality Guaranteed",
    subtitle: "Fresh from farm to your table",
    btnPrimary: "Shop Now",
    linkPrimary: "/products",
    btnSecondary: "Learn More",
    linkSecondary: "/about",
  },
  {
    title: "Fast & Free Delivery",
    subtitle: "Same day delivery available",
    btnPrimary: "Order Now",
    linkPrimary: "/cart",
    btnSecondary: "Delivery Info",
    linkSecondary: "/delivery",
  },
];

export default function Slider({
  pageList,
  spaceBetween = 0,
  slidesPerView = 1,
}: SliderType) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-0 outline-none ring-0 shadow-none group [transform:translateZ(0)]">
      <Swiper
        loop={true}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation={{
          nextEl: ".custom-swiper-next",
          prevEl: ".custom-swiper-prev",
        }}
        pagination={{
          clickable: true,
          el: ".custom-swiper-pagination",
        }}
        className="w-full h-[400px] md:h-[450px] border-0 outline-none"
      >
        {pageList?.map((url, index) => {
          const content = slideContent[index % slideContent.length];

          return (
            <SwiperSlide key={index} className="border-0 outline-none">
              <div className="relative w-full h-full border-0 outline-none">
                <Image
                  src={url}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover border-0 outline-none"
                  priority={index === 0}
                />

                {/* غطاء أخضر موحد ببراند FreshCart الخالي من التدرجات */}
                <div className="absolute inset-0 bg-[#00c758]/70 flex flex-col justify-center px-8 md:px-20 text-white border-0 outline-none">
                  <div className="max-w-xl flex flex-col gap-3">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                      {content.title}
                    </h1>
                    <p className="text-sm md:text-lg font-semibold text-white/95">
                      {content.subtitle}
                    </p>

                    {/* أزرار توجيه باستعمال next/link */}
                    <div className="flex items-center gap-3 mt-4">
                      <Link
                        href={content.linkPrimary}
                        className="bg-white text-[#00c758] hover:bg-emerald-50 font-bold px-6 py-3 rounded-xl transition text-sm md:text-base shadow-md active:scale-95 inline-block border-0 outline-none"
                      >
                        {content.btnPrimary}
                      </Link>
                      <Link
                        href={content.linkSecondary}
                        className="border-2 border-white text-white hover:bg-white/20 font-bold px-6 py-3 rounded-xl transition text-sm md:text-base backdrop-blur-sm active:scale-95 inline-block"
                      >
                        {content.btnSecondary}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* أسهم التنقل */}
      <button
        type="button"
        aria-label="Previous slide"
        className="custom-swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-gray-100 text-[#00c758] rounded-full flex items-center justify-center shadow-lg transition active:scale-90 border-0 outline-none"
      >
        <ChevronLeft className="w-6 h-6 stroke-[3]" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className="custom-swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-gray-100 text-[#00c758] rounded-full flex items-center justify-center shadow-lg transition active:scale-90 border-0 outline-none"
      >
        <ChevronRight className="w-6 h-6 stroke-[3]" />
      </button>

      {/* نقاط التنقل السفلية البيضاوية */}
      <div className="custom-swiper-pagination absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center gap-2"></div>

      {/* إلغاء كافة الحدود والظلال الافتراضية للـ Swiper */}
      <style jsx global>{`
        .swiper,
        .swiper-container,
        .swiper-wrapper,
        .swiper-slide {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .custom-swiper-pagination .swiper-pagination-bullet {
          background-color: white !important;
          opacity: 0.6;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none !important;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          opacity: 1;
          width: 32px !important;
          border-radius: 999px !important;
        }
      `}</style>
    </div>
  );
}
