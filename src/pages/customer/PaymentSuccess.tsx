import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Package,
  Receipt,
  Sparkles,
} from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-96 h-96 bg-emerald-400/20 dark:bg-emerald-400/10 rounded-full blur-3xl -top-48 -right-48"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute w-96 h-96 bg-green-400/20 dark:bg-green-400/10 rounded-full blur-3xl -bottom-48 -left-48"
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Success Header */}
        <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 dark:from-emerald-600 dark:via-green-600 dark:to-slate-900 px-8 py-12 text-center overflow-hidden">
          {/* Confetti Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute inset-0"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, opacity: 0, rotate: 0 }}
                animate={{
                  y: [0, 500],
                  opacity: [1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: [
                    "#FFD700",
                    "#FFA500",
                    "#FF69B4",
                    "#00CED1",
                    "#9370DB",
                  ][i % 5],
                }}
              />
            ))}
          </motion.div>

          {/* Success Icon */}
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
              <CheckCircle className="w-20 h-20 text-white" strokeWidth={2.5} />
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
            Payment Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white/90"
          >
            Your order has been confirmed
          </motion.p>
        </div>

        {/* Success Content */}
        <div className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 mb-8"
          >
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 rounded-2xl p-6 border-2 border-emerald-100 dark:border-emerald-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    What's Next?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your payment has been processed successfully. You can now
                    view your order details and access your purchased items in
                    the orders page.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white dark:bg-slate-700/50 rounded-xl p-4 border-2 border-gray-100 dark:border-slate-600 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Status
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      Confirmed
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white dark:bg-slate-700/50 rounded-xl p-4 border-2 border-gray-100 dark:border-slate-600 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Items
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      Ready to View
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/orders")}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <span>View My Orders</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
