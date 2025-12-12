// src/pages/admin/Orders.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  X,
  Eye,
  RefreshCw,
  DollarSign,
  Calendar,
  User as UserIcon,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import type { User } from "@/types";

interface Order {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  totalAmount: number;
}

interface OrderDetail {
  orderId: number;
  payment: string;
  orderStatus: string;
  createdAt: string;
  totalAmount: number;
  user: User;
  userId: number;
  username: string;
  orderItems: any[];
  transaction: any;
  orderDate: string;
  purchasedItems: Array<{
    cards: any[];
    pricePerUnit: number;
    productName: string;
    quantity: number;
  }>;
}

interface PageResponse {
  content: Order[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export default function Orders() {
  const { t } = useTranslation("order");
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    username: "",
    status: "",
  });
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showConfirmModal, setShowConfirmModal] = useState<{
    type: "status" | "refund" | null;
    orderId: number | null;
    status?: string;
  }>({ type: null, orderId: null });

  // Fetch orders list
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-orders", page, size, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      if (filters.username) params.append("username", filters.username);
      if (filters.status) params.append("status", filters.status);

      const response = await axiosInstance.get(`/admin/orders?${params}`);
      return response.data as PageResponse;
    },
  });

  // Fetch order detail
  const { data: orderDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["admin-order-detail", selectedOrderId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/orders/${selectedOrderId}`,
      );
      return response.data as OrderDetail;
    },
    enabled: !!selectedOrderId,
  });

  // Update order status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: number;
      status: string;
    }) => {
      await axiosInstance.put(
        `/admin/orders/${orderId}/status?status=${status}`,
        {},
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-detail"] });
      toast.success("Order status updated successfully!");
      setShowConfirmModal({ type: null, orderId: null });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  // Refund order
  const refundMutation = useMutation({
    mutationFn: async (orderId: number) => {
      await axiosInstance.post(`/admin/orders/${orderId}/refund`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-detail"] });
      toast.success("Order refunded successfully!");
      setShowConfirmModal({ type: null, orderId: null });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const handleStatusChange = (orderId: number, status: string) => {
    setShowConfirmModal({ type: "status", orderId, status });
  };

  const handleRefund = (orderId: number) => {
    setShowConfirmModal({ type: "refund", orderId });
  };

  const confirmAction = () => {
    if (showConfirmModal.type === "status" && showConfirmModal.orderId) {
      updateStatusMutation.mutate({
        orderId: showConfirmModal.orderId,
        status: showConfirmModal.status!,
      });
    } else if (showConfirmModal.type === "refund" && showConfirmModal.orderId) {
      refundMutation.mutate(showConfirmModal.orderId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      case "FAILED":
        return <AlertCircle className="w-4 h-4" />;
      case "REFUNDED":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "PENDING":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "REFUNDED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "FAILED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedData = data?.content
    ? [...data.content].sort((a, b) => {
        if (!sortField) return 0;
        const aVal = a[sortField as keyof Order];
        const bVal = b[sortField as keyof Order];
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  // Calculate statistics
  const stats = data?.content
    ? {
        total: data.totalElements,
        completed: data.content.filter((o) => o.orderStatus === "COMPLETED")
          .length,
        pending: data.content.filter((o) => o.orderStatus === "PENDING").length,
        totalRevenue: data.content
          .filter((o) => o.orderStatus === "COMPLETED")
          .reduce((sum, o) => sum + o.totalAmount, 0),
      }
    : { total: 0, completed: 0, pending: 0, totalRevenue: 0 };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("admin.orderTitle")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("admin.orderDesc")}
          </p>
        </div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label={t("admin.totalOrders")}
            value={stats.total.toString()}
            color="blue"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label={t("admin.completedOrders")}
            value={stats.completed.toString()}
            color="green"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label={t("admin.pendingOrders")}
            value={stats.pending.toString()}
            color="yellow"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label={t("admin.totalRevenue")}
            value={`${stats.totalRevenue.toLocaleString()} VND`}
            color="purple"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900/50 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                {t("admin.filter.fromDate")}
              </label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) =>
                  setFilters({ ...filters, from: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                {t("admin.filter.toDate")}
              </label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4 mr-2" />
                {t("admin.filter.status")}
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                <option value="">{t("detail.status.allStatus")}</option>
                <option value="PENDING">{t("detail.status.pending")}</option>
                <option value="COMPLETED">
                  {t("detail.status.completed")}
                </option>
                <option value="CANCELLED">
                  {t("detail.status.cancelled")}
                </option>
                <option value="FAILED">{t("detail.status.failed")}</option>
                <option value="REFUNDED">{t("detail.status.refunded")}</option>
              </select>
            </div>
            {/* <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <UserIcon className="w-4 h-4 mr-2" />
                {t("admin.filter.username")}
              </label>
              <input
                type="text"
                value={filters.username}
                onChange={(e) =>
                  setFilters({ ...filters, username: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                placeholder={t("admin.filter.searchUsername")}
              />
            </div> */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => refetch()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                {t("admin.filter.search")}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {t("history.loading")}
            </p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-6 py-4 rounded-xl mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>
              {t("history.error")}:{" "}
              {error instanceof Error
                ? error.message
                : t("history.errorGeneral")}
            </span>
          </motion.div>
        )}

        {/* Orders Table */}
        {data && sortedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
                      onClick={() => handleSort("orderId")}
                    >
                      <div className="flex items-center gap-2">
                        {t("detail.orderID")}
                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
                      onClick={() => handleSort("orderDate")}
                    >
                      <div className="flex items-center gap-2">
                        {t("detail.orderDate")}
                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
                      onClick={() => handleSort("totalAmount")}
                    >
                      <div className="flex items-center gap-2">
                        {t("detail.totalAmount")}
                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      {t("detail.orderStatus")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      {t("admin.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {sortedData.map((order, index) => (
                      <motion.tr
                        key={order.orderId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                          #{order.orderId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {new Date(order.orderDate).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {order.totalAmount.toLocaleString()} VND
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <motion.span
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200",
                              getStatusStyles(order.orderStatus),
                            )}
                          >
                            {getStatusIcon(order.orderStatus)}
                            {t(
                              `detail.status.${order.orderStatus.toLowerCase()}`,
                            )}
                          </motion.span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedOrderId(order.orderId)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 font-medium"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {t("admin.view")}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRefund(order.orderId)}
                              disabled={refundMutation.isPending}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              {t("admin.refund.refundButton")}
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-100">
                {t("admin.page.showing", {
                  count: data.content.length,
                  total: data.totalElements,
                })}
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t("admin.page.previous")}
                </motion.button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("admin.page.current", {
                    count: Number(page + 1),
                    total: data.totalPages,
                  })}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages - 1}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {t("admin.page.next")}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {data && sortedData.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-16 text-center border border-gray-200 dark:border-gray-700"
          >
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("admin.page.noOrders")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("admin.page.noOrdersDesc")}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrderId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrderId(null)}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 my-8"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  {t("detail.orderId", { id: selectedOrderId })}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedOrderId(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="p-6">
                {detailLoading && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("history.loading")}
                    </p>
                  </div>
                )}

                {orderDetail && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Customer Info */}
                    {orderDetail.userId && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800"
                      >
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          {t("detail.userInfo")}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <InfoItem
                            label={t("detail.username")}
                            value={orderDetail.username}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Order Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                      <InfoCard
                        icon={<FileText className="w-5 h-5" />}
                        label={t("detail.orderStatus")}
                        value={t(
                          `detail.status.${orderDetail.orderStatus.toLowerCase()}`,
                        )}
                        color="blue"
                      />
                      <InfoCard
                        icon={<CreditCard className="w-5 h-5" />}
                        label={t("detail.paymentMethod")}
                        value={orderDetail.payment}
                        color="green"
                      />
                      <InfoCard
                        icon={<DollarSign className="w-5 h-5" />}
                        label={t("detail.totalAmount")}
                        value={`${orderDetail.totalAmount.toLocaleString()} VND`}
                        color="purple"
                      />
                      <InfoCard
                        icon={<Calendar className="w-5 h-5" />}
                        label={t("detail.orderDate")}
                        value={new Date(orderDetail.orderDate).toLocaleString()}
                        color="orange"
                      />
                    </motion.div>

                    {/* Order Items */}
                    {orderDetail.purchasedItems && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                      >
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          {t("detail.orderItems")}
                        </h3>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                                    {t("detail.productName")}
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                                    {t("detail.quantity")}
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                                    {t("detail.price")}
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                                    {t("detail.total")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {orderDetail.purchasedItems.map(
                                  (item: any, idx: number) => (
                                    <motion.tr
                                      key={idx}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.4 + idx * 0.05 }}
                                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                                        {item.productName || "N/A"}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                        {item.quantity}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                        {item.pricePerUnit} VND
                                      </td>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                                        {item.pricePerUnit * item.quantity} VND
                                      </td>
                                    </motion.tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Transaction Info */}
                    {orderDetail.transaction && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800"
                      >
                        {/* <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          Transaction Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <InfoItem
                            label="Transaction ID"
                            value={orderDetail.transaction.transactionId}
                          />
                          <InfoItem
                            label="Status"
                            value={orderDetail.transaction.transactionStatus}
                          />
                          <InfoItem
                            label="Payment Code"
                            value={orderDetail.transaction.paymentCode}
                          />
                          {orderDetail.transaction.paidAt && (
                            <InfoItem
                              label="Paid At"
                              value={new Date(
                                orderDetail.transaction.paidAt,
                              ).toLocaleString()}
                            />
                          )}
                        </div> */}
                      </motion.div>
                    )}

                    {/* Status Update */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3"
                    >
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        {t("admin.changeStatus.changeStatus")}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <StatusButton
                          onClick={() =>
                            handleStatusChange(selectedOrderId, "PENDING")
                          }
                          disabled={updateStatusMutation.isPending}
                          color="yellow"
                          icon={<Clock className="w-4 h-4" />}
                        >
                          {t("detail.status.pending")}
                        </StatusButton>
                        <StatusButton
                          onClick={() =>
                            handleStatusChange(selectedOrderId, "COMPLETED")
                          }
                          disabled={updateStatusMutation.isPending}
                          color="green"
                          icon={<CheckCircle className="w-4 h-4" />}
                        >
                          {t("detail.status.completed")}
                        </StatusButton>
                        <StatusButton
                          onClick={() =>
                            handleStatusChange(selectedOrderId, "CANCELLED")
                          }
                          disabled={updateStatusMutation.isPending}
                          color="red"
                          icon={<XCircle className="w-4 h-4" />}
                        >
                          {t("detail.status.cancelled")}
                        </StatusButton>
                        <StatusButton
                          onClick={() =>
                            handleStatusChange(selectedOrderId, "FAILED")
                          }
                          disabled={updateStatusMutation.isPending}
                          color="gray"
                          icon={<AlertCircle className="w-4 h-4" />}
                        >
                          {t("detail.status.failed")}
                        </StatusButton>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal.type && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmModal({ type: null, orderId: null })}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-full",
                      showConfirmModal.type === "refund"
                        ? "bg-orange-100 dark:bg-orange-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30",
                    )}
                  >
                    {showConfirmModal.type === "refund" ? (
                      <RefreshCw className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("admin.refund.refundTitle")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("admin.refund.refundAction")}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {showConfirmModal.type === "status"
                    ? t("admin.changeStatus.changeConfirm", {
                        status: showConfirmModal.status?.toLowerCase(),
                      })
                    : t("admin.refund.refundConfirm")}
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setShowConfirmModal({ type: null, orderId: null })
                    }
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    {t("admin.refund.refundNo")}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmAction}
                    disabled={
                      updateStatusMutation.isPending || refundMutation.isPending
                    }
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                      showConfirmModal.type === "refund"
                        ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 dark:from-orange-500 dark:to-orange-600"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600",
                    )}
                  >
                    {(updateStatusMutation.isPending ||
                      refundMutation.isPending) && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {t("admin.refund.refundYes")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
    green:
      "from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700",
    yellow: "from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700",
    purple:
      "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            "p-3 rounded-lg bg-gradient-to-br text-white",
            colorClasses[color as keyof typeof colorClasses],
          )}
        >
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </motion.div>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
    >
      <div
        className={cn(
          "p-2 rounded-lg inline-block mb-2",
          colorClasses[color as keyof typeof colorClasses],
        )}
      >
        {icon}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900 dark:text-white break-words">
        {value}
      </div>
    </motion.div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-gray-600 dark:text-gray-400 font-medium">
      {label}:
    </span>{" "}
    <span className="text-gray-900 dark:text-white font-semibold">{value}</span>
  </div>
);

const StatusButton = ({
  onClick,
  disabled,
  color,
  icon,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  color: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  const colorClasses = {
    yellow:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700 shadow-amber-500/30",
    green:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-700 shadow-emerald-500/30",
    red: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 shadow-red-500/30",
    gray: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 dark:from-gray-600 dark:to-gray-700 shadow-gray-500/30",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-6 py-2.5 text-white rounded-lg font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
        colorClasses[color as keyof typeof colorClasses],
      )}
    >
      {icon}
      {children}
    </motion.button>
  );
};
