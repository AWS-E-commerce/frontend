// src/pages/admin/Inventory.tsx

import React, { useState } from "react";
import {
  Package,
  Search,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  useInventoryStatus,
  useInventoryCards,
  useDeleteCard,
} from "@/queries/useAdminInventory";
import { LoadingSpinner } from "@/components/common/LoadingSpinner/LoadingSpinner";
import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { Modal } from "@/components/common/Modal/Modal";
import AddStockModal from "@/components/features/admin/AddStockModal";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { StorageStatus } from "@/types/common.types";

const statusColors: Record<StorageStatus, string> = {
  USED: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  UNUSED: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  PENDING_PAYMENT:
    "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  ERROR: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
};

const AdminInventory = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "cards" | "addStock">(
    "overview",
  );

  // Overview data
  const { data: inventoryStatus, isLoading: statusLoading } =
    useInventoryStatus();

  // Cards list
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(25);
  const [filters, setFilters] = useState({
    variantId: undefined as number | undefined,
    status: "" as StorageStatus | "",
    codeKeyword: "",
  });

  const { data: cardsData, isLoading: cardsLoading } = useInventoryCards({
    ...filters,
    page,
    size,
    sort: "storageId,desc",
  });

  const deleteMutation = useDeleteCard();

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);

  const handleDeleteCard = async () => {
    if (deleteConfirm) {
      await deleteMutation.mutateAsync(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const totalStock =
    inventoryStatus?.reduce((sum, item) => sum + item.quantityInStock, 0) || 0;
  const lowStockCount =
    inventoryStatus?.filter((item) => item.quantityInStock < 10).length || 0;
  const outOfStockCount =
    inventoryStatus?.filter((item) => item.quantityInStock === 0).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product inventory and activation codes
          </p>
        </div>
        <Button
          onClick={() => setIsAddStockOpen(true)}
          //   icon={<Plus className="w-5 h-5" />}
        >
          Add Stock
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Stock
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalStock}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Products
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {inventoryStatus?.length || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Low Stock
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {lowStockCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Out of Stock
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {outOfStockCount}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("cards")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "cards"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Card List
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {statusLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">
                          In Stock
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {inventoryStatus?.map((item) => (
                        <tr
                          key={item.variantId}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {item.productName}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-gray-100">
                            {item.quantityInStock}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                item.quantityInStock === 0
                                  ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                  : item.quantityInStock < 10
                                    ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                                    : "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                              }`}
                            >
                              {item.quantityInStock === 0
                                ? "Out of Stock"
                                : item.quantityInStock < 10
                                  ? "Low Stock"
                                  : "In Stock"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Cards List Tab */}
          {activeTab === "cards" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        status: e.target.value as StorageStatus | "",
                      });
                      setPage(0);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">All Statuses</option>
                    <option value="UNUSED">Unused</option>
                    <option value="USED">Used</option>
                    <option value="PENDING_PAYMENT">Pending Payment</option>
                    <option value="ERROR">Error</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Code
                  </label>
                  <Input
                    value={filters.codeKeyword}
                    onChange={(e) => {
                      setFilters({ ...filters, codeKeyword: e.target.value });
                      setPage(0);
                    }}
                    placeholder="Search activation code..."
                    // icon={<Search className="w-4 h-4" />}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Per Page
                  </label>
                  <select
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      setPage(0);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Cards Table */}
              {cardsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                            ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                            Serial
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                            Activation Code
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                            Expiration
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                            Status
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {cardsData?.content.map((card) => (
                          <tr
                            key={card.storageId}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              #{card.storageId}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              {card.productName}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">
                              {card.serial}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">
                              {card.activateCode}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(card.expirationDate)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[card.status]}`}
                              >
                                {card.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => setDeleteConfirm(card.storageId)}
                                // icon={<Trash2 className="w-4 h-4" />}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {cardsData && cardsData.totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {page + 1} of {cardsData.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= cardsData.totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Card"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this card? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCard}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Stock Modal */}
      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
      />
    </div>
  );
};

export default AdminInventory;
