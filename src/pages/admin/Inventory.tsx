import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  Search,
  RefreshCw,
  Grid3x3,
  List,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  CalendarX,
  ShoppingBag,
  Layers,
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

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

type SortField =
  | "storageId"
  | "serial"
  | "productName"
  | "status"
  | "expirationDate";
type SortDirection = "asc" | "desc";

export default function Inventory() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortField, setSortField] = useState<SortField>("storageId");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);
  const [searchDebounce, setSearchDebounce] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [filters, setFilters] = useState({
    variantId: "",
    status: "",
    codeKeyword: "",
    expirationDateFrom: "",
    expirationDateTo: "",
    priceMin: "",
    priceMax: "",
  });

  // Fetch inventory status
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["inventory-status"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/inventory/status`);
      return response.data as InventoryItem[];
    },
  });

  // Calculate enhanced totals
  const totals = useMemo(() => {
    if (!statusData) return null;
    const lowStockItems = statusData.filter(
      (item) => item.quantityInStock > 0 && item.quantityInStock < 10,
    ).length;
    const outOfStock = statusData.filter(
      (item) => item.quantityInStock === 0,
    ).length;
    return {
      totalProducts: statusData.length,
      totalStock: statusData.reduce(
        (sum, item) => sum + item.quantityInStock,
        0,
      ),
      totalValue: statusData.reduce(
        (sum, item) => sum + item.price * item.quantityInStock,
        0,
      ),
      lowStockItems,
      outOfStock,
    };
  }, [statusData]);

  // Debounced filter update
  const updateFilterDebounced = useCallback(
    (key: string, value: string) => {
      if (searchDebounce) clearTimeout(searchDebounce);
      const timeout = setTimeout(() => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(0);
      }, 500);
      setSearchDebounce(timeout);
    },
    [searchDebounce],
  );

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
        `/admin/inventory/cards?${params}`,
      );
      return response.data as PageResponse;
    },
  });

  // Sort data client-side
  const sortedData = useMemo(() => {
    if (!data?.content) return [];
    const sorted = [...data.content].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "expirationDate") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortField, sortDirection]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (storageId: number) => {
      await axiosInstance.delete(`/admin/inventory/cards/${storageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-cards"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-status"] });
      toast.success("Card deleted successfully!");
      setDeleteModalOpen(false);
      setCardToDelete(null);
    },
    onError: (error: any) => {
      toast.error("Error: " + (error.response?.data?.message || error.message));
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleRowExpand = (id: number) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "UNUSED":
        return {
          color:
            "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
          icon: CheckCircle,
        };
      case "USED":
        return {
          color:
            "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
          icon: CheckCircle,
        };
      case "PENDING_PAYMENT":
        return {
          color:
            "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
          icon: Clock,
        };
      case "ERROR":
        return {
          color:
            "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
          icon: XCircle,
        };
      default:
        return {
          color:
            "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600",
          icon: Package,
        };
    }
  };

  // Delete Confirmation Modal
  function DeleteModal() {
    return (
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 backdrop-blur-sm bg-slate-900/60 dark:bg-black/70"
              onClick={() => setDeleteModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Delete Card
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Are you sure you want to delete this card? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    cardToDelete && deleteMutation.mutate(cardToDelete)
                  }
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DeleteModal />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Inventory Management
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Monitor stock levels and manage activation cards
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: ["inventory-status"],
                });
                refetch();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </motion.button>
          </div>

          {/* Stats Cards */}
          {statusLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 animate-pulse"
                >
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-3"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            totals && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Variants
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {totals.totalProducts}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Total Stock
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {totals.totalStock}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Total Value
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {(totals.totalValue / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Low Stock
                      </p>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {totals.lowStockItems}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Out of Stock
                      </p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {totals.outOfStock}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </motion.div>

        {/* Stock by Variant Table */}
        {statusData && statusData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden mb-6"
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Stock by Variant
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Variant ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Quantity in Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {statusData.map((item, index) => (
                    <motion.tr
                      key={item.variantId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                        #{item.variantId}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {item.productName}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                        {item.price.toLocaleString()} VND
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={clsx(
                            "inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border",
                            item.quantityInStock === 0
                              ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                              : item.quantityInStock < 10
                                ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                                : "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
                          )}
                        >
                          {item.quantityInStock}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Filter Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Variant ID
              </label>
              <input
                type="number"
                defaultValue={filters.variantId}
                onChange={(e) =>
                  updateFilterDebounced("variantId", e.target.value)
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
                placeholder="Filter by ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setPage(0);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
              >
                <option value="">All Statuses</option>
                <option value="UNUSED">UNUSED</option>
                <option value="USED">USED</option>
                <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Code Keyword
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  defaultValue={filters.codeKeyword}
                  onChange={(e) =>
                    updateFilterDebounced("codeKeyword", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
                  placeholder="Search codes..."
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => refetch()}
                className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* View Toggle & Results Info */}
        {data && data.content.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6"
          >
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing{" "}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {data.content.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {data.totalElements}
              </span>{" "}
              cards
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
              <button
                onClick={() => setViewMode("table")}
                className={clsx(
                  "p-2 rounded-lg transition-all",
                  viewMode === "table"
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
                )}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "p-2 rounded-lg transition-all",
                  viewMode === "grid"
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
                )}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600 dark:text-purple-400 mb-4" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Loading cards...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-5 py-4 rounded-xl mb-6"
          >
            Error:{" "}
            {error instanceof Error ? error.message : "Failed to load cards"}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && data && data.content.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No cards found
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Try adjusting your filters or add new inventory cards
            </p>
          </motion.div>
        )}

        {/* Table View */}
        {!isLoading &&
          !error &&
          data &&
          data.content.length > 0 &&
          viewMode === "table" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden mb-6"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("storageId")}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          Storage ID
                          {sortField === "storageId" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </th>
                      {/* <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("serial")}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          Serial
                          {sortField === "serial" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </th> */}
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Activation Code
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("productName")}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          Product
                          {sortField === "productName" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          Status
                          {sortField === "status" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("expirationDate")}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          Expiration
                          {sortField === "expirationDate" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <AnimatePresence mode="popLayout">
                      {sortedData.map((card, index) => (
                        <motion.tr
                          key={card.storageId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: index * 0.02 }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                            #{card.storageId}
                          </td>
                          {/* <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono text-slate-700 dark:text-slate-300">
                                {card.serial}
                              </code>
                              <button
                                onClick={() =>
                                  copyToClipboard(card.serial, "Serial")
                                }
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Copy className="h-3.5 w-3.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400" />
                              </button>
                            </div>
                          </td> */}
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono text-slate-700 dark:text-slate-300">
                                {card.activateCode}
                              </code>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    card.activateCode,
                                    "Activation code",
                                  )
                                }
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Copy className="h-3.5 w-3.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                            {card.productName}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {(() => {
                              const config = getStatusConfig(card.status);
                              const Icon = config.icon;
                              return (
                                <span
                                  className={clsx(
                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border",
                                    config.color,
                                  )}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                  {card.status}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                            {card.expirationDate
                              ? new Date(
                                  card.expirationDate,
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              {/* <button
                                onClick={() => toggleRowExpand(card.storageId)}
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                              >
                                {expandedRows.has(card.storageId) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button> */}
                              <button
                                onClick={() => {
                                  setCardToDelete(card.storageId);
                                  setDeleteModalOpen(true);
                                }}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        {/* Grid View */}
        {!isLoading &&
          !error &&
          data &&
          data.content.length > 0 &&
          viewMode === "grid" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
            >
              <AnimatePresence mode="popLayout">
                {sortedData.map((card, index) => {
                  const statusConfig = getStatusConfig(card.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <motion.div
                      key={card.storageId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-5 shadow-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Storage #{card.storageId}
                          </p>
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {card.productName}
                          </h3>
                        </div>
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border",
                            statusConfig.color,
                          )}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {card.status}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        {/* <div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                            Serial
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded">
                              {card.serial}
                            </code>
                            <button
                              onClick={() =>
                                copyToClipboard(card.serial, "Serial")
                              }
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5 text-slate-400" />
                            </button>
                          </div>
                        </div> */}

                        <div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                            Activation Code
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded">
                              {card.activateCode}
                            </code>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  card.activateCode,
                                  "Activation code",
                                )
                              }
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5 text-slate-400" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">
                            Expiration
                          </span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {card.expirationDate
                              ? new Date(
                                  card.expirationDate,
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setCardToDelete(card.storageId);
                            setDeleteModalOpen(true);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Delete</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-4"
          >
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Page{" "}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {page + 1}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {data.totalPages}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages - 1}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
