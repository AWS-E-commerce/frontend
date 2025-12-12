import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  ChevronDown,
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Box,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useLogout } from "@/queries/useAuth";
import { Button } from "@/components/common/Button/Button";
import { LanguageThemeSwitcher } from "./LanguageThemeSwitch";
import { useTranslation } from "react-i18next";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import type { Transition } from "framer-motion";

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("header");
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const { totalItems } = useCartStore();
  const { mutate: logout } = useLogout();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const handleLogout = () => {
    logout();
  };

  // Header shrink on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target as Node)
      ) {
        setAdminMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const adminMenuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: Box,
    },
    {
      path: "/admin/variants",
      label: "Variants",
      icon: Layers,
    },
    {
      path: "/admin/inventory",
      label: "Inventory",
      icon: Package,
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
    },
  ];

  const navLinks = [
    { to: "/", label: t("home") },
    { to: "/products", label: t("products") },
    ...(isAuthenticated ? [{ to: "/orders", label: t("orders") }] : []),
  ];

  const cartItemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 500, damping: 25 },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.2 as const },
    },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50"
            : "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
        }`}
      >
        <div className="container mx-auto px-4">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-14" : "h-16"
            }`}
          >
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group z-50"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Package
                  className={`transition-all duration-300 ${scrolled ? "w-6 h-6" : "w-8 h-8"}`}
                />
              </motion.div>
              <span
                className={`bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent transition-all duration-300 ${scrolled ? "text-xl" : "text-2xl"}`}
              >
                GiftCards
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors group"
                >
                  {link.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </Link>
              ))}

              {/* Admin Dropdown */}
              {isAuthenticated && isAdmin() && (
                <div className="relative" ref={adminMenuRef}>
                  <motion.button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Admin
                    <motion.div
                      animate={{ rotate: adminMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {adminMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-52 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 overflow-hidden"
                      >
                        {adminMenuItems.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <motion.div
                              key={item.path}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: index * 0.05,
                                duration: 0.2,
                              }}
                            >
                              <Link
                                to={item.path}
                                onClick={() => setAdminMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-all group"
                              >
                                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>{item.label}</span>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Language & Theme Switcher */}
              <div className="hidden md:block">
                <LanguageThemeSwitcher />
              </div>

              {/* Cart */}
              <motion.button
                onClick={() => navigate("/cart")}
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      variants={cartItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute -top-1 -right-1 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Desktop User Menu */}
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center gap-2">
                  <motion.button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User className="w-5 h-5" />
                    <span className="max-w-[120px] truncate">
                      {user?.username}
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/auth/login")}
                  >
                    {t("login")}
                  </Button>
                  <Button size="sm" onClick={() => navigate("/auth/register")}>
                    {t("register")}
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors z-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Mobile Menu Header */}
                <div className="pt-10 pb-4 border-b border-gray-200 dark:border-gray-800">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user?.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {user?.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => {
                          navigate("/auth/login");
                          setMobileMenuOpen(false);
                        }}
                      >
                        {t("login")}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          navigate("/auth/register");
                          setMobileMenuOpen(false);
                        }}
                      >
                        {t("register")}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors font-medium"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Admin Section */}
                {isAuthenticated && isAdmin() && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="px-4 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                      Admin
                    </p>
                    <nav className="space-y-1">
                      {adminMenuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: (navLinks.length + index) * 0.1,
                            }}
                          >
                            <Link
                              to={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                            >
                              <Icon className="w-5 h-5" />
                              <span>{item.label}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </nav>
                  </div>
                )}

                {/* Settings */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="px-4 py-3">
                    <LanguageThemeSwitcher />
                  </div>
                </div>

                {/* Logout */}
                {isAuthenticated && (
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under fixed header */}
      <div className={scrolled ? "h-14" : "h-16"} />
    </>
  );
};
