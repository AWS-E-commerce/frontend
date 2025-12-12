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
  Award,
  TrendingUp,
  Package,
  Heart,
  Share2,
  Sparkles,
} from "lucide-react";
import { useProduct } from "@/queries/useProducts";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/common/Button/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner/LoadingSpinner";
import { formatCurrency } from "@/utils/formatters";
import type {
  VariantResponse,
  ProductDetail as ProductDetailType,
} from "@/types";
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
  const [isFavorited, setIsFavorited] = useState(false);

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
      const productDetail: ProductDetailType = {
        productId: product.productId,
        name: product.productName,
        description: product.productDescription,
        pictureUrl: product.pictureURL,
        branch: {
          branchId: product.branch.id,
          name: product.branch.name,
        },
        discount: undefined,
        variant: product.productVariantResponses.map((v) => ({
          variantId: v.id,
          value: v.value,
          price: v.price,
          currency: v.currency,
          product: {} as ProductDetailType,
          storageList: [],
        })),
      };
      addToCart(productDetail, selectedVariant.id, quantity);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            <Sparkles className="w-10 h-10 text-indigo-600 dark:text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-lg font-bold text-gray-700 dark:text-gray-300">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Info className="w-16 h-16 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
            {t("product:notFound")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            {t("product:notFoundDescription")}
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="px-8 py-4 text-lg font-bold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("buttons.back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">{t("buttons.back")}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Image & Info */}
          <div className="space-y-6">
            {/* Product Image Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 group">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                )}
                <img
                  src={product.pictureURL}
                  alt={product.productName}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />

                {/* Floating Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="w-12 h-12 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all group/fav"
                  >
                    <Heart
                      className={`w-5 h-5 transition-all ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400 group-hover/fav:text-red-500"}`}
                    />
                  </button>
                  <button className="w-12 h-12 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all group/share">
                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover/share:text-indigo-600 dark:group-hover/share:text-indigo-400 transition-colors" />
                  </button>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-white fill-white" />
                    <span className="font-black text-white text-lg">4.8</span>
                  </div>
                </div>

                {/* Verified Badge */}
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-white font-bold text-sm">Verified</span>
                </div>
              </div>

              {/* Brand Badge */}
              <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 shadow-lg">
                <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-black text-indigo-900 dark:text-indigo-200">
                  {product.branch.name}
                </span>
              </div>
            </div>

            {/* Enhanced Features Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-gray-100 dark:border-gray-700">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">
                    {t("product:instantDelivery")}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Within seconds
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-gray-100 dark:border-gray-700">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">
                    {t("product:secure")}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    100% Protected
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-gray-100 dark:border-gray-700">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">
                    24/7 Support
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Always here
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between text-white">
                <div className="text-center flex-1">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-black">2.5K+</p>
                  <p className="text-xs opacity-90 font-semibold">Sold</p>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center flex-1">
                  <Star className="w-6 h-6 mx-auto mb-2 fill-white" />
                  <p className="text-2xl font-black">4.8</p>
                  <p className="text-xs opacity-90 font-semibold">Rating</p>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center flex-1">
                  <Package className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-black">99%</p>
                  <p className="text-xs opacity-90 font-semibold">Satisfied</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details & Purchase */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="space-y-6">
              {/* Title & Description */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight flex-1">
                    {product.productName}
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg leading-relaxed">
                  {product.productDescription}
                </p>
              </div>

              {/* Price Display */}
              {selectedVariant && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur-xl opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border-2 border-indigo-200 dark:border-indigo-700 shadow-xl">
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          {t("product:price")}
                        </p>
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                            {formatCurrency(selectedVariant.price)}
                          </span>
                          <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                            / ${selectedVariant.value}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-xl">
                      <Check className="w-5 h-5" />
                      <span>{t("product:digitalDelivery")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Variant Selection */}
              <div>
                <label className="block text-base font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  {t("product:selectAmount")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.productVariantResponses.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedVariant?.id === variant.id
                          ? "border-indigo-600 dark:border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 shadow-xl scale-105"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:scale-102"
                      }`}
                    >
                      {selectedVariant?.id === variant.id && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-full p-1.5 shadow-xl">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                          ${variant.value}
                        </div>
                        <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
                          {formatCurrency(variant.price)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-base font-black text-gray-900 dark:text-white mb-4">
                  {t("product:quantity")}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-14 h-14 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-l-xl transition-all hover:scale-110"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <div className="w-20 h-14 flex items-center justify-center bg-white dark:bg-gray-800">
                      <span className="text-xl font-black text-gray-900 dark:text-white">
                        {quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-14 h-14 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-xl transition-all hover:scale-110"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 text-right bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 px-5 py-3 rounded-xl border border-indigo-200 dark:border-indigo-700">
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">
                      {t("product:totalPrice")}
                    </p>
                    <p className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
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
                  className="w-full h-16 text-lg font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 dark:hover:from-indigo-600 dark:hover:via-purple-600 dark:hover:to-pink-600 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Zap className="w-6 h-6 mr-2" />
                  {t("buttons.buyNow")}
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant}
                  variant="outline"
                  className="w-full h-16 text-lg font-black border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  {t("buttons.addToCart")}
                </Button>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-blue-900 dark:text-blue-200">
                    <p className="font-black mb-2 text-base">
                      {t("product:importantInfo")}
                    </p>
                    <p className="text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
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
