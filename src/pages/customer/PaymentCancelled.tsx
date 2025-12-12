import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";
import { XCircle, ArrowRight, Sparkles } from "lucide-react";
import { useEffect } from "react";

export default function PaymentCancelled() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-96 h-96 bg-red-400/20 dark:bg-red-400/10 rounded-full blur-3xl -top-48 -right-48"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute w-96 h-96 bg-orange-400/20 dark:bg-orange-400/10 rounded-full blur-3xl -bottom-48 -left-48"
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Cancelled Header */}
        <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-orange-600 dark:from-red-600 dark:via-red-700 dark:to-slate-900 px-8 py-12 text-center overflow-hidden">
          {/* Cancelled Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="relative inline-block mb-6"
          >
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-20 h-20 text-white" strokeWidth={2.5} />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute inset-0 border-4 border-white/30 rounded-full"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3"
          >
            Payment Cancelled
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white/90"
          >
            Your order was not completed
          </motion.p>
        </div>

        {/* Cancelled Content */}
        <div className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 mb-8"
          >
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 rounded-2xl p-6 border-2 border-red-100 dark:border-red-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    What Happened?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your payment was cancelled and no charges were made. You can
                    review your previous orders or try making a new purchase
                    anytime.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl p-6 border-2 border-amber-100 dark:border-amber-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Need Help?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    If you experienced any issues during checkout or have
                    questions about your order, please don't hesitate to contact
                    our support team.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/orders")}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <span>View My Orders</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
