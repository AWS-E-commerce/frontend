// src/pages/admin/Inventory.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";

interface InventoryItem {
  variantId: number;
  productName: string;
  price: number;
  quantityInStock: number;
}

interface Card {
  storageId: number;
  serial: string;
  activateCode: string;
  expirationDate: string;
  status: string;
  productName: string;
}

interface PageResponse {
  content: Card[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export default function Inventory() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState({
    variantId: "",
    status: "",
    codeKeyword: "",
  });

  // Fetch inventory status (list of variants with stock)
  const { data: statusData } = useQuery({
    queryKey: ["inventory-status"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/inventory/status`);
      return response.data as InventoryItem[];
    },
  });

  // Calculate totals from status data
  const totals = statusData
    ? {
        totalProducts: statusData.length,
        totalStock: statusData.reduce(
          (sum, item) => sum + item.quantityInStock,
          0,
        ),
        totalValue: statusData.reduce(
          (sum, item) => sum + item.price * item.quantityInStock,
          0,
        ),
      }
    : null;

  // Fetch cards list
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["inventory-cards", page, size, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      if (filters.variantId) params.append("variantId", filters.variantId);
      if (filters.status) params.append("status", filters.status);
      if (filters.codeKeyword)
        params.append("codeKeyword", filters.codeKeyword);

      const response = await axiosInstance.get(
        `admin/inventory/cards?${params}`,
      );
      return response.data as PageResponse;
    },
  });

  // Delete card
  const deleteMutation = useMutation({
    mutationFn: async (storageId: number) => {
      const token = localStorage.getItem("auth_token");
      await axiosInstance.delete(`/admin/inventory/cards/${storageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-cards"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-status"] });
      alert("Card deleted successfully!");
    },
    onError: (error: any) => {
      alert("Error: " + (error.response?.data?.message || error.message));
    },
  });

  const handleDelete = (storageId: number) => {
    if (confirm("Are you sure you want to delete this card?")) {
      deleteMutation.mutate(storageId);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      {/* Status Summary */}
      {totals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-500 text-sm">Total Product Variants</div>
            <div className="text-2xl font-bold mt-1">
              {totals.totalProducts}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="text-green-600 text-sm">Total Cards in Stock</div>
            <div className="text-2xl font-bold mt-1 text-green-700">
              {totals.totalStock}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <div className="text-blue-600 text-sm">Total Inventory Value</div>
            <div className="text-2xl font-bold mt-1 text-blue-700">
              {totals.totalValue.toLocaleString()} VND
            </div>
          </div>
        </div>
      )}

      {/* Inventory Status Table */}
      {statusData && (
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="font-bold">Stock by Variant</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Variant ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity in Stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statusData.map((item) => (
                <tr key={item.variantId}>
                  <td className="px-6 py-4 text-sm">{item.variantId}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.price.toLocaleString()} VND
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        item.quantityInStock === 0
                          ? "bg-red-100 text-red-800"
                          : item.quantityInStock < 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.quantityInStock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards List Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-bold mb-4">Card Details</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Variant ID</label>
            <input
              type="number"
              value={filters.variantId}
              onChange={(e) =>
                setFilters({ ...filters, variantId: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              placeholder="Filter by variant ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All</option>
              <option value="UNUSED">UNUSED</option>
              <option value="USED">USED</option>
              <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Code Keyword
            </label>
            <input
              type="text"
              value={filters.codeKeyword}
              onChange={(e) =>
                setFilters({ ...filters, codeKeyword: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              placeholder="Search code"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => refetch()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && <div className="text-center py-8">Loading cards...</div>}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load cards"}
        </div>
      )}

      {/* Cards Table */}
      {data && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Storage ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Serial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Activation Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Expiration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.content.map((card) => (
                  <tr key={card.storageId}>
                    <td className="px-6 py-4 text-sm">{card.storageId}</td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {card.serial}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {card.activateCode}
                    </td>
                    <td className="px-6 py-4 text-sm">{card.productName}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          card.status === "UNUSED"
                            ? "bg-green-100 text-green-800"
                            : card.status === "USED"
                              ? "bg-blue-100 text-blue-800"
                              : card.status === "PENDING_PAYMENT"
                                ? "bg-yellow-100 text-yellow-800"
                                : card.status === "ERROR"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {card.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {card.expirationDate
                        ? new Date(card.expirationDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(card.storageId)}
                        className="text-red-600 hover:text-red-800"
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {data.content.length} of {data.totalElements} cards
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page + 1} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages - 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
