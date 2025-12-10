// src/pages/customer/Products.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gift Cards</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Brand name..."
            value={filters.branchName}
            onChange={(e) =>
              setFilters({ ...filters, branchName: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="text-lg">Loading products...</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load products"}
        </div>
      )}

      {/* Products Grid */}
      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.content.map((product) => {
              const variants = product.productVariantResponses || [];
              const hasVariants = variants.length > 0;

              return (
                <div
                  key={product.productId}
                  onClick={() => navigate(`/products/${product.productId}`)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    {product.pictureURL ? (
                      <img
                        src={product.pictureURL}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="text-sm">No Image</div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">
                      {product.branch.name}
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.productDescription}
                    </p>

                    {/* Variants */}
                    {hasVariants ? (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Available:</div>
                        <div className="flex flex-wrap gap-2">
                          {variants.slice(0, 3).map((variant) => (
                            <span
                              key={variant.id}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                            >
                              {variant.value.toLocaleString()}{" "}
                              {variant.currency}
                            </span>
                          ))}
                          {variants.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{variants.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">
                        No variants available
                      </div>
                    )}

                    {/* Price Range */}
                    {hasVariants && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm text-gray-500">From</div>
                        <div className="text-xl font-bold text-blue-600">
                          {Math.min(
                            ...variants.map((v) => v.price),
                          ).toLocaleString()}{" "}
                          VND
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
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page + 1} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages - 1}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Showing {data.content.length} of {data.totalElements} products
          </div>
        </>
      )}

      {/* Empty State */}
      {data && data.content.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No products found</div>
          <p className="text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
