import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  CreditCard,
  Wallet,
  Building2,
  CheckCircle,
  ArrowLeft,
  Lock,
  User,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useCreateOrder } from "@/queries/useOrders";
import { Button } from "@/components/common/Button/Button";
import { formatCurrency } from "@/utils/formatters";
import { useTranslation } from "react-i18next";
import type { CreateOrderRequest } from "@/types/order.types";

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

  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate("/cart");
    }
  }, [items.length, orderSuccess, navigate]);

  const onSubmit = async (formData: CheckoutFormData) => {
    try {
      // Build order request from cart items
      const orderRequest: CreateOrderRequest = {
        orderItemRequests: items.map((item) => ({
          variantId: 6, // Make sure this is set in cart
          quantity: item.quantity,
        })),
        paymentMethod: selectedPayment,
      };

      const order = await createOrderMutation.mutateAsync(orderRequest);

      // Success!
      setOrderId(order.orderId);
      setOrderSuccess(true);
      clearCart();

      // Redirect to orders after 3 seconds
      setTimeout(() => {
        navigate(`/orders/${order.orderId}`);
      }, 3000);
    } catch (error: any) {
      console.error("Checkout error:", error);
      // Error will be shown via toast from mutation
    }
  };

  const paymentMethods = [
    {
      id: "MOMO" as PaymentMethod,
      name: "MoMo",
      icon: Wallet,
      description: t("checkout:payment.momoDescription"),
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "BANK_TRANSFER" as PaymentMethod,
      name: t("checkout:payment.bankTransfer"),
      icon: Building2,
      description: t("checkout:payment.bankDescription"),
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "CREDIT_CARD" as PaymentMethod,
      name: t("checkout:payment.creditCard"),
      icon: CreditCard,
      description: t("checkout:payment.cardDescription"),
      color: "from-purple-500 to-purple-600",
    },
  ];

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl text-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {t("checkout:success.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
              {t("checkout:success.message")}
            </p>
            {orderId && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                {t("checkout:success.orderNumber")}:{" "}
                <span className="font-mono font-semibold">#{orderId}</span>
              </p>
            )}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-8">
              <p className="text-green-800 dark:text-green-300 font-medium">
                {t("checkout:success.emailSent")}
              </p>
            </div>
            <Button
              onClick={() => navigate("/orders")}
              className="px-8 py-3 text-lg"
            >
              {t("checkout:success.viewOrders")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t("buttons.backToCart")}</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t("checkout:title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("checkout:subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  {t("checkout:contactInfo.title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("checkout:contactInfo.fullName")} *
                    </label>
                    <input
                      type="text"
                      {...register("fullName", {
                        required: t("checkout:validation.fullNameRequired"),
                      })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.fullName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                      placeholder={t(
                        "checkout:contactInfo.fullNamePlaceholder",
                      )}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                      placeholder="0123456789"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("checkout:contactInfo.address")} *
                    </label>
                    <input
                      type="text"
                      {...register("address", {
                        required: t("checkout:validation.addressRequired"),
                      })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.address
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:border-transparent transition-all`}
                      placeholder={t("checkout:contactInfo.addressPlaceholder")}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("checkout:contactInfo.notes")}
                    </label>
                    <textarea
                      {...register("notes")}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
                      placeholder={t("checkout:contactInfo.notesPlaceholder")}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  {t("checkout:payment.title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        selectedPayment === method.id
                          ? "border-primary-600 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg scale-105"
                          : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600"
                      }`}
                    >
                      {selectedPayment === method.id && (
                        <div className="absolute -top-2 -right-2 bg-primary-600 dark:bg-primary-500 text-white rounded-full p-1">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      )}
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}
                      >
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        {method.description}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
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
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {t("checkout:summary.title")}
                </h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          ${item.amount} × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          {formatCurrency(item.amount * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t("checkout:summary.subtotal")}</span>
                    <span className="font-semibold">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t("checkout:summary.processingFee")}</span>
                    <span className="font-semibold">{formatCurrency(0)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100">
                      <span>{t("checkout:summary.total")}</span>
                      <span className="text-primary-600 dark:text-primary-400">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={createOrderMutation.isPending}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t("checkout:processing")}
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      {t("checkout:placeOrder")}
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                  {t("checkout:terms")}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
