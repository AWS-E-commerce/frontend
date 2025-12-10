import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { ProductDetailResponse } from "@/types";
import { Button } from "@/components/common/Button/Button";
import { formatCurrency } from "@/utils/formatters";
import { useTranslation } from "react-i18next";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: ProductDetailResponse;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "products"]);
  const { addToCart } = useCart();

  const handleClick = () => {
    navigate(`/products/${product.productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.productVariantResponses.length > 0) {
      const firstVariant = product.productVariantResponses[0];
      addToCart(
        {
          id: product.productId.toString(),
          name: product.productName,
          description: product.productDescription,
          imageUrl: product.pictureURL,
          category: product.branch.name,
        },
        firstVariant.price,
        1,
      );
    }
  };

  const minPrice = Math.min(
    ...product.productVariantResponses.map((v) => v.price),
  );
  const maxPrice = Math.max(
    ...product.productVariantResponses.map((v) => v.price),
  );

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={product.pictureURL}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-primary-600 dark:bg-primary-500 text-white text-sm font-semibold rounded-full">
          {product.branch.name}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {product.productName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {product.productDescription}
        </p>

        {/* Price Range */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {t("products:availableAmounts")}:
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(minPrice)}
            </span>
            {minPrice !== maxPrice && (
              <>
                <span className="text-gray-400">-</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(maxPrice)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Variants Count */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {product.productVariantResponses.length}{" "}
            {t("products:availableAmounts").toLowerCase()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {t("buttons.viewDetails")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.productVariantResponses.length === 0}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
