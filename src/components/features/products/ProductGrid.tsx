import React from "react";
import type { ProductDetailResponse } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductDetailResponse[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
};
