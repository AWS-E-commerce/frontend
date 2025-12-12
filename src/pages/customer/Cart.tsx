import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Tag,
  Sparkles,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.2 },
    },
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-slate-200 dark:border-slate-700/50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <ShoppingBag className="w-16 h-16 text-slate-400 dark:text-slate-500" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3"
              >
                {t("cart.empty")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 dark:text-slate-400 mb-8 text-lg"
              >
                {t("cart.emptyDescription")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={() => navigate("/products")}
                  className="px-8 py-3 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {t("cart.startShopping")}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-indigo-200 dark:to-slate-100 bg-clip-text text-transparent mb-2">
            {t("cart.title")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t("cart.itemCount", { count: totalItems })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  exit="exit"
                  className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700/50 hover:shadow-2xl transition-shadow"
                >
                  <div className="flex gap-6">
                    <motion.div
                      className="w-32 h-32 flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 ring-2 ring-slate-200 dark:ring-slate-600 hover:ring-indigo-400 dark:hover:ring-indigo-500 transition-all shadow-lg">
                        <img
                          src={item.product.pictureUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {item.product.branch.name}
                          </p>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-semibold shadow-sm"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            {formatCurrency(item.amount)}
                          </motion.div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={t("buttons.remove")}
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-xl transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <motion.div
                            key={item.quantity}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="w-12 h-10 flex items-center justify-center"
                          >
                            <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                              {item.quantity}
                            </span>
                          </motion.div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-r-xl transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t("cart.subtotal")}
                          </p>
                          <motion.p
                            key={item.amount * item.quantity}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                          >
                            {formatCurrency(item.amount * item.quantity)}
                          </motion.p>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {editingRecipient === item.id ? (
                          <motion.div
                            key="editing"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3 border border-slate-200 dark:border-slate-600"
                          >
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="recipient@example.com"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder={t("cart.recipientNamePlaceholder")}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                                rows={2}
                                placeholder={t("cart.messagePlaceholder")}
                              />
                            </div>
                            <div className="flex gap-2">
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1"
                              >
                                <Button
                                  onClick={() => handleSaveRecipient(item.id)}
                                  className="w-full"
                                  size="sm"
                                >
                                  {t("buttons.save")}
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1"
                              >
                                <Button
                                  onClick={handleCancelEdit}
                                  variant="outline"
                                  className="w-full"
                                  size="sm"
                                >
                                  {t("buttons.cancel")}
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="display"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                          >
                            {item.recipientEmail || item.recipientName ? (
                              <div className="space-y-2">
                                {item.recipientName && (
                                  <p className="text-sm text-slate-900 dark:text-slate-100">
                                    <User className="w-4 h-4 inline mr-1" />
                                    <span className="font-medium">
                                      {item.recipientName}
                                    </span>
                                  </p>
                                )}
                                {item.recipientEmail && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    {item.recipientEmail}
                                  </p>
                                )}
                                {item.message && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                    "{item.message}"
                                  </p>
                                )}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  onClick={() => handleEditRecipient(item)}
                                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                >
                                  {t("buttons.edit")}
                                </motion.button>
                              </div>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.02, x: 5 }}
                                onClick={() => handleEditRecipient(item)}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
                              >
                                <Sparkles className="w-4 h-4" />+{" "}
                                {t("cart.addRecipient")}
                              </motion.button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(239, 68, 68, 0.05)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={clearCart}
              className="w-full py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium border border-transparent hover:border-red-200 dark:hover:border-red-800"
            >
              <X className="w-5 h-5 inline mr-2" />
              {t("cart.clearCart")}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <motion.div
              className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700/50 sticky top-8"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                {t("cart.orderSummary")}
              </h2>

              <div className="space-y-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-between text-slate-600 dark:text-slate-400"
                >
                  <span>{t("cart.subtotal")}</span>
                  <span className="font-semibold">
                    {formatCurrency(totalAmount)}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex justify-between text-slate-600 dark:text-slate-400"
                >
                  <span>{t("cart.items")}</span>
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="font-semibold"
                  >
                    {totalItems}
                  </motion.span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="border-t border-slate-200 dark:border-slate-700 pt-4"
                >
                  <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-slate-100">
                    <span>{t("cart.total")}</span>
                    <motion.span
                      key={totalAmount}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      {formatCurrency(totalAmount)}
                    </motion.span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Button
                  onClick={handleCheckout}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 dark:from-indigo-500 dark:via-purple-500 dark:to-indigo-500 dark:hover:from-indigo-600 dark:hover:via-purple-600 dark:hover:to-indigo-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all text-white"
                >
                  {t("cart.proceedToCheckout")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4"
              >
                {t("cart.secureCheckout")}
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
