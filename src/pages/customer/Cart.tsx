import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  X,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/common/Button/Button";
import { formatCurrency } from "@/utils/formatters";
import { useTranslation } from "react-i18next";
import type { CartItem as CartItemType } from "@/types/cart.types";

const Cart = () => {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();
  const { items, totalItems, totalAmount } = useCartStore();
  const { updateQuantity, removeFromCart, updateRecipient, clearCart } =
    useCart();
  const [editingRecipient, setEditingRecipient] = useState<string | null>(null);
  const [recipientData, setRecipientData] = useState({
    email: "",
    name: "",
    message: "",
  });

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleEditRecipient = (item: CartItemType) => {
    setEditingRecipient(item.id);
    setRecipientData({
      email: item.recipientEmail || "",
      name: item.recipientName || "",
      message: item.message || "",
    });
  };

  const handleSaveRecipient = (itemId: string) => {
    updateRecipient(itemId, recipientData);
    setEditingRecipient(null);
    setRecipientData({ email: "", name: "", message: "" });
  };

  const handleCancelEdit = () => {
    setEditingRecipient(null);
    setRecipientData({ email: "", name: "", message: "" });
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {t("cart.empty")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                {t("cart.emptyDescription")}
              </p>
              <Button
                onClick={() => navigate("/products")}
                className="px-8 py-3 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t("cart.startShopping")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t("cart.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("cart.itemCount", { count: totalItems })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.product.category}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold">
                          ${item.amount}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title={t("buttons.remove")}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-xl transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="w-12 h-10 flex items-center justify-center">
                          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {item.quantity}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-xl transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("cart.subtotal")}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatCurrency(item.amount * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Recipient Info */}
                    {editingRecipient === item.id ? (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <Mail className="w-4 h-4 inline mr-1" />
                            {t("cart.recipientEmail")}
                          </label>
                          <input
                            type="email"
                            value={recipientData.email}
                            onChange={(e) =>
                              setRecipientData({
                                ...recipientData,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="recipient@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <User className="w-4 h-4 inline mr-1" />
                            {t("cart.recipientName")}
                          </label>
                          <input
                            type="text"
                            value={recipientData.name}
                            onChange={(e) =>
                              setRecipientData({
                                ...recipientData,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder={t("cart.recipientNamePlaceholder")}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            {t("cart.message")}
                          </label>
                          <textarea
                            value={recipientData.message}
                            onChange={(e) =>
                              setRecipientData({
                                ...recipientData,
                                message: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                            rows={2}
                            placeholder={t("cart.messagePlaceholder")}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSaveRecipient(item.id)}
                            className="flex-1"
                            size="sm"
                          >
                            {t("buttons.save")}
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            className="flex-1"
                            size="sm"
                          >
                            {t("buttons.cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        {item.recipientEmail || item.recipientName ? (
                          <div className="space-y-2">
                            {item.recipientName && (
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                <User className="w-4 h-4 inline mr-1" />
                                <span className="font-medium">
                                  {item.recipientName}
                                </span>
                              </p>
                            )}
                            {item.recipientEmail && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <Mail className="w-4 h-4 inline mr-1" />
                                {item.recipientEmail}
                              </p>
                            )}
                            {item.message && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                "{item.message}"
                              </p>
                            )}
                            <button
                              onClick={() => handleEditRecipient(item)}
                              className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                            >
                              {t("buttons.edit")}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditRecipient(item)}
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                          >
                            + {t("cart.addRecipient")}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"
            >
              <X className="w-5 h-5 inline mr-2" />
              {t("cart.clearCart")}
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t("cart.orderSummary")}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t("cart.subtotal")}</span>
                  <span className="font-semibold">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t("cart.items")}</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100">
                    <span>{t("cart.total")}</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 shadow-lg hover:shadow-xl transition-all"
              >
                {t("cart.proceedToCheckout")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                {t("cart.secureCheckout")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
