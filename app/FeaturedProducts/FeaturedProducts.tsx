import React from "react";
import { getAllProducts } from "../api/services/productApi";
import { ProductCard } from "../_component/ProductCard/ProductCard";
import { productType } from "../api/types/productType";

export default async function FeaturedProducts() {
  const data: productType[] = await getAllProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a0f1c]">
          Featured <span className="text-green-600">Products</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {data?.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
