import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Package,
  Zap,
  Grid3x3,
  List,
  Star,
} from "lucide-react";

interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  pictureURL: string | null;
  branch: {
    id: number;
    name: string;
  };
  productVariantResponses: Array<{
    id: number;
    value: number;
    price: number;
    currency: string;
  }> | null;
}

interface PageResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export default function Products() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    branchName: "",
    minPrice: "",
    maxPrice: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page, size, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.branchName) params.append("branchName", filters.branchName);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      const response = await axiosInstance.get(`/products/?${params}`);
      return response.data as PageResponse;
    },
  });

  const activeFiltersCount = [
    filters.keyword,
    filters.branchName,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      keyword: "",
      branchName: "",
      minPrice: "",
      maxPrice: "",
    });
    setPage(0);
  };

  const brandColors: { [key: string]: string } = {
    Steam: "from-blue-500 to-blue-700",
    PlayStation: "from-indigo-500 to-blue-600",
    Xbox: "from-green-500 to-emerald-600",
    Nintendo: "from-red-500 to-pink-600",
    "Epic Games": "from-slate-600 to-slate-800",
    "Battle.net": "from-blue-600 to-cyan-600",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -right-48 animate-pulse"></div>
          <div
            className="absolute w-96 h-96 bg-purple-400/20 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute w-64 h-64 bg-pink-400/20 rounded-full blur-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold mb-2 shadow-lg hover:bg-white/30 transition-all">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Premium Gift Cards Collection</span>
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">
              Discover Amazing
              <span className="block bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                Gift Cards
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-medium">
              Choose from hundreds of gaming platforms with instant delivery &
              best prices
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  type="text"
                  placeholder="Search for gift cards, games, or platforms..."
                  value={filters.keyword}
                  onChange={(e) => {
                    setFilters({ ...filters, keyword: e.target.value });
                    setPage(0);
                  }}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/40 dark:focus:ring-purple-500/50 shadow-2xl transition-all text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-16 md:h-24"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z"
              className="fill-slate-50 dark:fill-gray-950"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl transition-all duration-300 font-semibold text-gray-700 dark:text-gray-200 group"
          >
            <Filter className="w-5 h-5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2.5 py-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
            >
              <X className="w-4 h-4" />
              <span>Clear all</span>
            </button>
          )}

          {data && (
            <div className="ml-auto flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
              <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-indigo-900 dark:text-indigo-200">
                {data.totalElements}
              </span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                products
              </span>
            </div>
          )}
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-gray-100 dark:border-gray-700 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Filter Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Brand/Platform
                </label>
                <input
                  type="text"
                  placeholder="e.g., Steam, Xbox"
                  value={filters.branchName}
                  onChange={(e) => {
                    setFilters({ ...filters, branchName: e.target.value });
                    setPage(0);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Min Price (VND)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => {
                    setFilters({ ...filters, minPrice: e.target.value });
                    setPage(0);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Max Price (VND)
                </label>
                <input
                  type="number"
                  placeholder="1000000"
                  value={filters.maxPrice}
                  onChange={(e) => {
                    setFilters({ ...filters, maxPrice: e.target.value });
                    setPage(0);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
              <Zap className="w-10 h-10 text-indigo-600 dark:text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="mt-6 text-xl font-bold text-gray-700 dark:text-gray-300">
              Loading amazing deals...
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please wait while we fetch the best offers
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-700 dark:text-red-300 font-medium">
              {error instanceof Error
                ? error.message
                : "Failed to load products"}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {data && data.content.length > 0 && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.content.map((product, index) => {
                const variants = product.productVariantResponses || [];
                const hasVariants = variants.length > 0;
                const brandColor =
                  brandColors[product.branch.name] ||
                  "from-gray-600 to-gray-800";

                return (
                  <div
                    key={product.productId}
                    onClick={() => navigate(`/products/${product.productId}`)}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-105 border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Product Image */}
                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      {product.pictureURL ? (
                        <img
                          src={product.pictureURL}
                          alt={product.productName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                          <Package className="w-20 h-20 mb-2" />
                          <span className="text-sm font-semibold">
                            No Image
                          </span>
                        </div>
                      )}

                      {/* Brand Badge */}
                      <div
                        className={`absolute top-3 left-3 px-4 py-2 bg-gradient-to-r ${brandColor} text-white text-xs font-black rounded-lg shadow-xl backdrop-blur-sm border border-white/20`}
                      >
                        {product.branch.name}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                        {product.productName}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {product.productDescription}
                      </p>

                      {/* Variants */}
                      {hasVariants ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>Available Amounts:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {variants.slice(0, 3).map((variant) => (
                              <span
                                key={variant.id}
                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-700 shadow-sm"
                              >
                                {variant.value.toLocaleString()}{" "}
                                {variant.currency}
                              </span>
                            ))}
                            {variants.length > 3 && (
                              <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-600">
                                +{variants.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
                          <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                            No variants available
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      {hasVariants && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                              Starting from
                            </span>
                            <div className="text-right">
                              <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                {Math.min(
                                  ...variants.map((v) => v.price),
                                ).toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1 font-bold">
                                VND
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:shadow-none transition-all duration-300 group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: Math.min(5, data.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (data.totalPages <= 5) {
                        pageNum = i;
                      } else if (page < 3) {
                        pageNum = i;
                      } else if (page > data.totalPages - 4) {
                        pageNum = data.totalPages - 5 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-12 h-12 rounded-xl font-black transition-all duration-300 ${
                            page === pageNum
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white shadow-xl scale-110 border-2 border-transparent"
                              : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg hover:scale-105"
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:shadow-none transition-all duration-300 group"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Showing
                </span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  {page * size + 1} -{" "}
                  {Math.min((page + 1) * size, data.totalElements)}
                </span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  of
                </span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  {data.totalElements}
                </span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  products
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {data && data.content.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 text-center border-2 border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Try adjusting your filters or search terms to find what you're
              looking for
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
