import TrustBadges from "@/app/_component/TrustBadges/TrustBadges";
import {
  getspecificCategory,
  getSubcategoriesOnCategory,
} from "@/app/api/services/productApi";
import Link from "next/link";
import React from "react";
import { FaFolder, FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await getspecificCategory({ id });
  const subcategories = await getSubcategoriesOnCategory(id);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Category Not Found</h1>
        <p className="text-gray-600 mt-2">Could not load category details.</p>
      </div>
    );
  }

  return (
    <>
      {/* القسم الأخضر العلوي (Hero Banner) المضاف حديثاً */}
      <div className="bg-[#00c758] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* مسار التصفح Breadcrumbs */}
          <div className="text-sm mb-5 text-white/80 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/ShopCategory" className="hover:text-white transition">
              Categories
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{category.name}</span>
          </div>

          {/* عنوان القسم والأيقونة */}
          <div className="flex items-center">
            <div className="bg-white/20 p-4 rounded-2xl mr-5 backdrop-blur-sm">
              <FaFolder className="text-4xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
                {category.name}
              </h1>
              <p className="text-white/90 text-lg">
                Choose a subcategory to browse products
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/ShopCategory"
          className="inline-flex items-center gap-2 text-[15px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          Back to Categories
        </Link>

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a0f1c] mb-8">
          {subcategories.length} Subcategories in {category.name}
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subcategories.map((sub: { _id: string; name: string }) => (
            <Link
              key={sub._id}
              href={`/products?subcategory=${sub._id}`}
              className="group flex flex-col p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#00c758] transition-all duration-300 shadow-[0_2px_12px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgb(0,199,88,0.12)] min-h-[170px]"
            >
              {/* Folder Icon */}
              <div className="w-12 h-12 mb-4 rounded-xl bg-[#e8f8ef] flex items-center justify-center text-[#00c758]">
                <FaFolder className="w-5 h-5" />
              </div>

              {/* Subcategory Name */}
              <h3 className="text-[17px] font-bold text-[#0a0f1c] group-hover:text-[#00c758] transition-colors leading-snug">
                {sub.name}
              </h3>

              {/* Browse Products Link */}
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#00c758] opacity-0 group-hover:opacity-100 transition-opacity mt-auto pt-2">
                <span>Browse Products</span>
                <FaArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <TrustBadges />
    </>
  );
}
