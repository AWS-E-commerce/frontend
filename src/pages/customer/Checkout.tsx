import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Wallet,
  Building2,
  CheckCircle,
  ArrowLeft,
  Lock,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useCreateOrder } from "@/queries/useOrders";
import { Button } from "@/components/common/Button/Button";
import { formatCurrency } from "@/utils/formatters";
import { useTranslation } from "react-i18next";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
} from "@/types/order.types";

type PaymentMethod = "MOMO" | "BANK_TRANSFER" | "CREDIT_CARD";

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

const Checkout = () => {
  const { t } = useTranslation(["common", "checkout"]);
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("MOMO");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const createOrderMutation = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      fullName: user?.memberProfile?.name || "",
      email: user?.email || "",
      phone: user?.memberProfile?.phone || "",
      address: user?.memberProfile?.address || "",
    },
  });

  React.useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate("/cart");
    }
  }, [items.length, orderSuccess, navigate]);

  const onSubmit = async (formData: CheckoutFormData) => {
    try {
      const orderRequest: CreateOrderRequest = {
        orderItemRequests: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        paymentMethod: selectedPayment,
      };

      const response: CreateOrderResponse =
        await createOrderMutation.mutateAsync(orderRequest);

      clearCart();

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
    }
  };

  const paymentMethods = [
    {
      id: "MOMO" as PaymentMethod,
      name: "MoMo",
      icon: Wallet,
      description: t("checkout:payment.momoDescription"),
      gradient: "from-pink-500 via-pink-600 to-rose-600",
    },
    {
      id: "BANK_TRANSFER" as PaymentMethod,
      name: t("checkout:payment.bankTransfer"),
      icon: Building2,
      description: t("checkout:payment.bankDescription"),
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
    },
    {
      id: "CREDIT_CARD" as PaymentMethod,
      name: t("checkout:payment.creditCard"),
      icon: CreditCard,
      description: t("checkout:payment.cardDescription"),
      gradient: "from-purple-500 via-purple-600 to-indigo-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center py-12"
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl text-center border border-slate-200 dark:border-slate-700"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3"
            >
              {t("checkout:success.title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 dark:text-slate-400 mb-4 text-lg"
            >
              {t("checkout:success.message")}
            </motion.p>
            {orderId && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-slate-500 dark:text-slate-400 mb-8"
              >
                {t("checkout:success.orderNumber")}:{" "}
                <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  #{orderId}
                </span>
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-8 border border-green-200 dark:border-green-800"
            >
              <p className="text-green-800 dark:text-green-300 font-medium">
                {t("checkout:success.emailSent")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={() => navigate("/orders")}
                className="px-8 py-3 text-lg"
              >
                {t("checkout:success.viewOrders")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t("buttons.backToCart")}</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-indigo-200 dark:to-slate-100 bg-clip-text text-transparent mb-2">
            {t("checkout:title")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t("checkout:subtitle")}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700/50"
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  {t("checkout:contactInfo.title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    className="md:col-span-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("checkout:contactInfo.fullName")} *
                    </label>
                    <input
                      type="text"
                      {...register("fullName", {
                        required: t("checkout:validation.fullNameRequired"),
                      })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.fullName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                      } bg-white dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400`}
                      placeholder={t(
                        "checkout:contactInfo.fullNamePlaceholder",
                      )}
                    />
                    <AnimatePresence>
                      {errors.fullName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.fullName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("checkout:contactInfo.email")} *
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: t("checkout:validation.emailRequired"),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t("checkout:validation.emailInvalid"),
                        },
                      })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                      } bg-white dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400`}
                      placeholder="your@email.com"
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("checkout:contactInfo.phone")} *
                    </label>
                    <input
                      type="tel"
                      {...register("phone", {
                        required: t("checkout:validation.phoneRequired"),
                        pattern: {
                          value: /^[0-9]{10,11}$/,
                          message: t("checkout:validation.phoneInvalid"),
                        },
                      })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                      } bg-white dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400`}
                      placeholder="0123456789"
                    />
                    <AnimatePresence>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.phone.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    className="md:col-span-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("checkout:contactInfo.address")} *
                    </label>
                    <input
                      type="text"
                      {...register("address", {
                        required: t("checkout:validation.addressRequired"),
                      })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.address
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                      } bg-white dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400`}
                      placeholder={t("checkout:contactInfo.addressPlaceholder")}
                    />
                    <AnimatePresence>
                      {errors.address && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.address.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    className="md:col-span-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("checkout:contactInfo.notes")}
                    </label>
                    <textarea
                      {...register("notes")}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all placeholder:text-slate-400"
                      placeholder={t("checkout:contactInfo.notesPlaceholder")}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700/50"
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  {t("checkout:payment.title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method, index) => (
                    <motion.button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        selectedPayment === method.id
                          ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-700/30"
                      }`}
                    >
                      <AnimatePresence>
                        {selectedPayment === method.id && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                            className="absolute -top-2 -right-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full p-1 shadow-lg"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 bg-gradient-to-br ${method.gradient} rounded-xl flex items-center justify-center mb-3 mx-auto shadow-lg`}
                      >
                        <method.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-center mb-2">
                        {method.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                        {method.description}
                      </p>
                    </motion.button>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50"
                >
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-300">
                      <p className="font-semibold mb-1">
                        {t("checkout:payment.securePayment")}
                      </p>
                      <p className="text-blue-700 dark:text-blue-400">
                        {t("checkout:payment.secureNote")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="lg:col-span-1">
              <motion.div
                className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700/50 sticky top-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  {t("checkout:summary.title")}
                </h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 group"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 ring-2 ring-slate-200 dark:ring-slate-600 group-hover:ring-indigo-400 dark:group-hover:ring-indigo-500 transition-all">
                        <img
                          src={item.product.pictureUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          ${item.amount} × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {formatCurrency(item.amount * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3 mb-6 pt-6 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>{t("checkout:summary.subtotal")}</span>
                    <span className="font-semibold">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>{t("checkout:summary.processingFee")}</span>
                    <span className="font-semibold">{formatCurrency(0)}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-slate-100">
                      <span>{t("checkout:summary.total")}</span>
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 dark:from-indigo-500 dark:via-purple-500 dark:to-indigo-500 dark:hover:from-indigo-600 dark:hover:via-purple-600 dark:hover:to-indigo-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t("checkout:processing")}
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        {t("checkout:placeOrder")}
                      </>
                    )}
                  </Button>
                </motion.div>

                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
                  {t("checkout:terms")}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </form>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
