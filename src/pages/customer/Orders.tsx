import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "@/api/axios.config";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Package,
  Calendar,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingBag,
  Sparkles,
  Receipt,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Tag,
  Hash,
  CalendarDays,
} from "lucide-react";

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
  orderDate: string;
  totalAmount: number;
  purchasedItems: Array<{
    cards: [
      {
        code: string;
        expirationDate: string;
        serial: string;
      },
    ];
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
  const [size] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [revealedCodes, setRevealedCodes] = useState<Set<string>>(new Set());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["order-history", page, size],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/order/history?page=${page}&size=${size}`,
      );
      return response.data as PageResponse;
    },
  });

  const { data: orderDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["order-detail", selectedOrderId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/order/${selectedOrderId}`);
      return response.data as OrderDetail;
    },
    enabled: !!selectedOrderId,
  });

  const cancelMutation = useMutation({
    mutationFn: async (orderId: number) => {
      await axiosInstance.post(`/order/${orderId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-history"] });
      queryClient.invalidateQueries({ queryKey: ["order-detail"] });
      setShowCancelModal(false);
      setOrderToCancel(null);
      toast.success(t("order:cancelSuccess"));
    },
    onError: (error: any) => {
      setShowCancelModal(false);
      setOrderToCancel(null);
      toast.error(
        t("order:cancelError") +
          ": " +
          (error.response?.data?.message || error.message),
      );
    },
  });

  const handleCancelOrder = (orderId: number) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      cancelMutation.mutate(orderToCancel);
    }
  };

  const toggleCodeVisibility = (codeId: string) => {
    setRevealedCodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(codeId)) {
        newSet.delete(codeId);
      } else {
        newSet.add(codeId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const getStatusIcon = (orderStatus: string) => {
    if (!orderStatus) return <Package className="w-5 h-5" />;
    switch (orderStatus.toUpperCase()) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5" />;
      case "PENDING":
        return <Clock className="w-5 h-5" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5" />;
      case "REFUNDED":
        return <RefreshCw className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (orderStatus: string) => {
    if (!orderStatus) return "from-gray-500 to-gray-600";
    switch (orderStatus.toUpperCase()) {
      case "COMPLETED":
        return "from-emerald-500 to-emerald-600";
      case "PENDING":
        return "from-amber-500 to-orange-500";
      case "CANCELLED":
        return "from-red-500 to-red-600";
      case "REFUNDED":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-96 h-96 bg-purple-400/20 dark:bg-purple-400/10 rounded-full blur-3xl -top-48 -right-48"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute w-96 h-96 bg-blue-400/20 dark:bg-blue-400/10 rounded-full blur-3xl -bottom-48 -left-48"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-4"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t("history.pageTitle")}</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {t("history.pageTitle")}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {t("history.titleDesc")}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-12 md:h-20"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z"
              fill="currentColor"
              className="text-slate-50 dark:text-slate-950"
            />
          </svg>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full"
              />
              <Package className="w-8 h-8 text-indigo-600 dark:text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-400">
              {t("history.loading")}
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-950/50 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2">
              {t("history.error")}
            </h3>
            <p className="text-red-700 dark:text-red-300">
              {error instanceof Error
                ? error.message
                : t("history.errorGeneral")}
            </p>
          </motion.div>
        )}

        {/* Orders List */}
        {data && (
          <>
            {data.content.length === 0 ? (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {t("history.empty")}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/products")}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl font-semibold shadow-lg"
                >
                  {t("history.emptyShop")}
                </motion.button>
              </motion.div>
            ) : (
              /* Orders Cards */
              <div className="space-y-6">
                <AnimatePresence>
                  {data.content.map((order, index) => (
                    <motion.div
                      key={order.orderId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
                    >
                      <div className="p-6 md:p-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                {t("detail.orderId", { id: order.orderId })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {new Date(order.orderDate).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getStatusColor(order.orderStatus)} text-white rounded-xl font-bold shadow-lg`}
                          >
                            {getStatusIcon(order.orderStatus)}
                            <span>
                              {order.orderStatus
                                ? t(
                                    `detail.status.${order.orderStatus.toLowerCase()}`,
                                  )
                                : "N/A"}
                            </span>
                          </motion.div>
                        </div>

                        {/* Divider */}
                        <div className="border-t-2 border-gray-100 dark:border-slate-700 my-6" />

                        {/* Footer */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              {t("detail.totalAmount")}
                            </div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                              {order.totalAmount.toLocaleString()} VND
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedOrderId(order.orderId)}
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl font-semibold shadow-lg"
                            >
                              <FileText className="w-5 h-5" />
                              <span>{t("history.viewDetails")}</span>
                            </motion.button>
                            {order.orderStatus === "PENDING" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCancelOrder(order.orderId)}
                                disabled={cancelMutation.isPending}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-xl font-semibold hover:bg-red-700 dark:hover:bg-red-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <XCircle className="w-5 h-5" />
                                <span>{t("history.cancelOrder")}</span>
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {data.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-4 mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-indigo-600 dark:hover:border-indigo-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>{t("admin.page.previous")}</span>
                </motion.button>
                <div className="flex items-center gap-2">
                  <span className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl font-bold shadow-lg">
                    {t("admin.page.current", {
                      count: page + 1,
                      total: data.totalPages,
                    })}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-indigo-600 dark:hover:border-indigo-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{t("admin.page.next")}</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {/* Order Detail Modal */}
        <AnimatePresence>
          {selectedOrderId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedOrderId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-slate-900 dark:to-indigo-950 px-8 py-6 rounded-t-3xl z-10 border-b-4 border-purple-400/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {t("detail.orderId", { id: selectedOrderId })}
                        </h2>
                        <p className="text-white/80 text-sm">Order Details</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedOrderId(null)}
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all text-white"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-8">
                  {detailLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                      </motion.div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">
                        {t("history.loading")}
                      </p>
                    </motion.div>
                  )}

                  {orderDetail && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Order Status Card */}
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-2xl border-2 border-gray-100 dark:border-slate-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <Sparkles className="w-4 h-4" />
                              {t("detail.label")}
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getStatusColor(orderDetail.orderStatus)} text-white rounded-xl font-bold shadow-lg`}
                            >
                              {getStatusIcon(orderDetail.orderStatus)}
                              <span>
                                {orderDetail.orderStatus
                                  ? t(
                                      `detail.status.${orderDetail.orderStatus.toLowerCase()}`,
                                    )
                                  : "N/A"}
                              </span>
                            </motion.div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <CreditCard className="w-4 h-4" />
                              {t("detail.paymentMethod")}
                            </div>
                            <div className="font-bold text-lg text-gray-900 dark:text-white">
                              {orderDetail.payment}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <Calendar className="w-4 h-4" />
                              {t("detail.orderDate")}
                            </div>
                            <div className="font-medium text-gray-900 dark:text-gray-200">
                              {new Date(orderDetail.orderDate).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <Package className="w-4 h-4" />
                              {t("detail.totalAmount")}
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                              {orderDetail.totalAmount.toLocaleString()} VND
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Purchased Items with Codes */}
                      {orderDetail.purchasedItems &&
                        orderDetail.purchasedItems.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <Tag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                              Purchased Items & Codes
                            </h3>

                            {orderDetail.purchasedItems.map(
                              (item, itemIndex) => (
                                <motion.div
                                  key={itemIndex}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: itemIndex * 0.1 }}
                                  className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-indigo-950 p-6 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900"
                                >
                                  {/* Item Header */}
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {item.productName}
                                      </h4>
                                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span>Quantity: {item.quantity}</span>
                                        <span>•</span>
                                        <span>
                                          {item.pricePerUnit.toLocaleString()}{" "}
                                          VND/unit
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Total
                                      </div>
                                      <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {(
                                          item.pricePerUnit * item.quantity
                                        ).toLocaleString()}{" "}
                                        VND
                                      </div>
                                    </div>
                                  </div>

                                  {/* Codes Grid */}
                                  {item.cards && item.cards.length > 0 && (
                                    <div className="space-y-3 mt-4">
                                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                        <span>
                                          Your Codes (Click to reveal)
                                        </span>
                                      </div>
                                      <div className="grid gap-3">
                                        {item.cards.map((card, cardIndex) => {
                                          const codeId = `${itemIndex}-${cardIndex}`;
                                          const isRevealed =
                                            revealedCodes.has(codeId);

                                          return (
                                            <motion.div
                                              key={cardIndex}
                                              initial={{ opacity: 0, x: -20 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{
                                                delay: cardIndex * 0.1,
                                              }}
                                              className="bg-white dark:bg-slate-800 rounded-xl p-4 border-2 border-indigo-100 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                                            >
                                              <div className="space-y-3">
                                                {/* Code Field */}
                                                <div>
                                                  <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                      <Hash className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                      <span>Code</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                      <motion.button
                                                        whileHover={{
                                                          scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                          scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                          toggleCodeVisibility(
                                                            codeId,
                                                          )
                                                        }
                                                        className="p-2 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-lg transition-colors"
                                                      >
                                                        {isRevealed ? (
                                                          <EyeOff className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                        ) : (
                                                          <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                        )}
                                                      </motion.button>
                                                      {isRevealed && (
                                                        <motion.button
                                                          initial={{ scale: 0 }}
                                                          animate={{ scale: 1 }}
                                                          whileHover={{
                                                            scale: 1.1,
                                                          }}
                                                          whileTap={{
                                                            scale: 0.9,
                                                          }}
                                                          onClick={() =>
                                                            copyToClipboard(
                                                              card.code,
                                                              `code-${codeId}`,
                                                            )
                                                          }
                                                          className="p-2 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors"
                                                        >
                                                          {copiedCode ===
                                                          `code-${codeId}` ? (
                                                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                          ) : (
                                                            <Copy className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                          )}
                                                        </motion.button>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <motion.div
                                                    className="relative"
                                                    animate={{
                                                      filter: isRevealed
                                                        ? "blur(0px)"
                                                        : "blur(8px)",
                                                    }}
                                                    transition={{
                                                      duration: 0.3,
                                                    }}
                                                  >
                                                    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 rounded-lg font-mono text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700">
                                                      {isRevealed
                                                        ? card.code
                                                        : "••••••••••••••••"}
                                                    </div>
                                                  </motion.div>
                                                </div>

                                                {/* Serial Field */}
                                                <div>
                                                  <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                      <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                      <span>Serial</span>
                                                    </div>
                                                    {isRevealed && (
                                                      <motion.button
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        whileHover={{
                                                          scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                          scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                          copyToClipboard(
                                                            card.serial,
                                                            `serial-${codeId}`,
                                                          )
                                                        }
                                                        className="p-2 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors"
                                                      >
                                                        {copiedCode ===
                                                        `serial-${codeId}` ? (
                                                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                          <Copy className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                        )}
                                                      </motion.button>
                                                    )}
                                                  </div>
                                                  <motion.div
                                                    className="relative"
                                                    animate={{
                                                      filter: isRevealed
                                                        ? "blur(0px)"
                                                        : "blur(8px)",
                                                    }}
                                                    transition={{
                                                      duration: 0.3,
                                                    }}
                                                  >
                                                    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 rounded-lg font-mono text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700">
                                                      {isRevealed
                                                        ? card.serial
                                                        : "••••••••••••••••"}
                                                    </div>
                                                  </motion.div>
                                                </div>

                                                {/* Expiration Date Field */}
                                                <div>
                                                  <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                      <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                      <span>
                                                        Expiration Date
                                                      </span>
                                                    </div>
                                                    {isRevealed && (
                                                      <motion.button
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        whileHover={{
                                                          scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                          scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                          copyToClipboard(
                                                            card.expirationDate,
                                                            `expiry-${codeId}`,
                                                          )
                                                        }
                                                        className="p-2 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors"
                                                      >
                                                        {copiedCode ===
                                                        `expiry-${codeId}` ? (
                                                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                          <Copy className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                        )}
                                                      </motion.button>
                                                    )}
                                                  </div>
                                                  <motion.div
                                                    className="relative"
                                                    animate={{
                                                      filter: isRevealed
                                                        ? "blur(0px)"
                                                        : "blur(8px)",
                                                    }}
                                                    transition={{
                                                      duration: 0.3,
                                                    }}
                                                  >
                                                    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 rounded-lg font-mono text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700">
                                                      {isRevealed
                                                        ? card.expirationDate
                                                        : "••/••/••••"}
                                                    </div>
                                                  </motion.div>
                                                </div>
                                              </div>
                                            </motion.div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              ),
                            )}
                          </div>
                        )}

                      {/* Actions */}
                      {orderDetail.orderStatus === "PENDING" && (
                        <div className="flex justify-end pt-4 border-t-2 border-gray-100 dark:border-slate-700">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancelOrder(selectedOrderId)}
                            disabled={cancelMutation.isPending}
                            className="flex items-center gap-2 px-8 py-4 bg-red-600 dark:bg-red-700 text-white rounded-xl font-bold hover:bg-red-700 dark:hover:bg-red-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="w-5 h-5" />
                            <span>
                              {cancelMutation.isPending
                                ? t("history.cancelling")
                                : t("history.cancelOrder")}
                            </span>
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cancel Order Confirmation Modal */}
        <AnimatePresence>
          {showCancelModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() =>
                !cancelMutation.isPending && setShowCancelModal(false)
              }
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {t("order:cancelConfirm")}
                      </h2>
                      <p className="text-white/80 text-sm">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Are you sure you want to cancel order #{orderToCancel}? This
                    will immediately cancel your order and initiate a refund if
                    applicable.
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCancelModal(false)}
                      disabled={cancelMutation.isPending}
                      className="flex-1 px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      No, Keep Order
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={confirmCancelOrder}
                      disabled={cancelMutation.isPending}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {cancelMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span>Yes, Cancel Order</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
