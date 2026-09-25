import React from "react";
import { getSingleProducts } from "../../api/services/productApi";
import ProductContent from "@/app/ProductContent/ProductContent";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await getSingleProducts(resolvedParams.id);

  if (!product) {
    return (
      <div className="text-center py-20 text-xl font-bold text-red-500">
        Product not found!
      </div>
    );
  }

  return <ProductContent product={product} />;
}
