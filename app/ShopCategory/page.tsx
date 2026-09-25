import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getShopCategory } from "@/app/api/services/productApi";
import { Category } from "@/app/api/types/productType";

export default async function ShopCategory() {
  const categories = await getShopCategory();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* العنوان */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1.5 h-8 bg-[#00c758] rounded-full"></span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a0f1c]">
          Shop By <span className="text-[#00c758]">Category</span>
        </h2>
      </div>

      {/* شبكة عرض الأقسام */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {categories?.map((category: Category, index: number) => (
          <Link
            key={category._id || index}
            href={`/categories/${category._id}`}
            className="group flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-emerald-50/50 rounded-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 text-center hover:shadow-sm"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 overflow-hidden rounded-full bg-white shadow-sm">
              <Image
                src={category.image}
                alt={category.name || "Category"}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                className="object-cover "
              />
            </div>
            <h3 className="text-sm font-semibold text-[#0a0f1c] group-hover:text-[#00c758] transition-colors line-clamp-1">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
