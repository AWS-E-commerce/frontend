import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  Shield,
  Clock,
  Info,
  Minus,
  Plus,
  Check,
  Star,
} from "lucide-react";
import { useProduct } from "@/queries/useProducts";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/common/Button/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner/LoadingSpinner";
import { formatCurrency } from "@/utils/formatters";
import type { VariantResponse } from "@/types";
import { useTranslation } from "react-i18next";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "product"]);
  const { data: product, isLoading, error } = useProduct(Number(id));
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] =
    useState<VariantResponse | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  React.useEffect(() => {
    if (
      product?.productVariantResponses &&
      product.productVariantResponses.length > 0
    ) {
      setSelectedVariant(product.productVariantResponses[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      addToCart(
        {
          id: product.productId.toString(),
          name: product.productName,
          description: product.productDescription,
          imageUrl: product.pictureURL,
          category: product.branch.name,
        },
        selectedVariant.price,
        quantity,
      );
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const getTotalPrice = () => {
    if (!selectedVariant) return 0;
    return selectedVariant.price * quantity;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t("product:notFound")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("product:notFoundDescription")}
          </p>
          <Button onClick={() => navigate("/products")}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("buttons.back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-all"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t("buttons.back")}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Image & Info */}
          <div className="space-y-6">
            {/* Product Image Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                )}
                <img
                  src={product.pictureURL}
                  alt={product.productName}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                {/* Floating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      4.8
                    </span>
                  </div>
                </div>
              </div>

              {/* Brand Badge */}
              <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-400 rounded-full border border-primary-200 dark:border-primary-700">
                <span className="font-semibold text-sm">
                  {product.branch.name}
                </span>
              </div>
            </div>

            {/* Features Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {t("product:instantDelivery")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {t("product:secure")}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  24/7
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details & Purchase */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-xl">
            <div className="space-y-6">
              {/* Title & Description */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                  {product.productName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg leading-relaxed">
                  {product.productDescription}
                </p>
              </div>

              {/* Price Display */}
              {selectedVariant && (
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-700">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t("product:price")}
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                          {formatCurrency(selectedVariant.price)}
                        </span>
                        <span className="text-lg text-gray-500 dark:text-gray-400">
                          / ${selectedVariant.value}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300">
                    <Check className="w-4 h-4" />
                    <span>{t("product:digitalDelivery")}</span>
                  </div>
                </div>
              )}

              {/* Variant Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {t("product:selectAmount")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.productVariantResponses.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedVariant?.id === variant.id
                          ? "border-primary-600 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg scale-105"
                          : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md hover:scale-102"
                      }`}
                    >
                      {selectedVariant?.id === variant.id && (
                        <div className="absolute -top-2 -right-2 bg-primary-600 dark:bg-primary-500 text-white rounded-full p-1 shadow-lg">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                          ${variant.value}
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {formatCurrency(variant.price)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {t("product:quantity")}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-12 h-12 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-xl transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="w-16 h-12 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-xl transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {t("product:totalPrice")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(getTotalPrice())}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleBuyNow}
                  disabled={!selectedVariant}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  {t("buttons.buyNow")}
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant}
                  variant="outline"
                  className="w-full h-14 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {t("buttons.addToCart")}
                </Button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-300">
                    <p className="font-semibold mb-1">
                      {t("product:importantInfo")}
                    </p>
                    <p className="text-blue-700 dark:text-blue-400">
                      {t("product:deliveryNote")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
