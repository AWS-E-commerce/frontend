import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Lock, User, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { useLogin } from "@/queries/useAuth";
import type { LoginRequest } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const floatingShapeVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          variants={floatingShapeVariants}
          animate="animate"
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-primary-600/30 dark:from-primary-500/20 dark:to-primary-700/20 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingShapeVariants}
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-blue-400/20 to-purple-500/20 dark:from-blue-600/10 dark:to-purple-700/10 rounded-full blur-3xl"
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-400/40 dark:bg-primary-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Card with Glassmorphism */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-500/30"
            >
              <LogIn className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.username
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20"
                  }`}
                  disabled={isPending}
                />
              </div>
              <AnimatePresence mode="wait">
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.username.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 3,
                      message: "Password must be at least 3 characters",
                    },
                  })}
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20"
                  }`}
                  disabled={isPending}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isPending}
                >
                  <AnimatePresence mode="wait">
                    {showPassword ? (
                      <motion.div
                        key="eye-off"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <EyeOff className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="eye"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              <AnimatePresence mode="wait">
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remember & Forgot Password */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 dark:text-primary-500 rounded focus:ring-2 focus:ring-primary-500/20 border-gray-300 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                  disabled={isPending}
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: isPending ? 1 : 1.02 }}
                whileTap={{ scale: isPending ? 1 : 0.98 }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-medium">
                Or continue with
              </span>
            </div>
          </motion.div>

          {/* Register Link */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6"
        >
          By signing in, you agree to our{" "}
          <Link
            to="/terms"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Privacy Policy
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
