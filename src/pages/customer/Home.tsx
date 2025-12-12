import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  ShoppingCart,
  Gift,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Shield,
  ChevronRight,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// Mock data - replace with actual API data
const featuredBrands = [
  {
    id: "1",
    name: "Steam",
    logo: "🎮",
    color: "from-blue-600 to-blue-800",
    popular: true,
  },
  {
    id: "2",
    name: "PlayStation",
    logo: "🎯",
    color: "from-indigo-600 to-blue-600",
    popular: true,
  },
  {
    id: "3",
    name: "Xbox",
    logo: "🎮",
    color: "from-green-600 to-emerald-600",
    popular: false,
  },
  {
    id: "4",
    name: "Nintendo",
    logo: "🎮",
    color: "from-red-600 to-pink-600",
    popular: true,
  },
  {
    id: "5",
    name: "Epic Games",
    logo: "⚡",
    color: "from-gray-700 to-gray-900",
    popular: false,
  },
  {
    id: "6",
    name: "Battle.net",
    logo: "⚔️",
    color: "from-blue-700 to-cyan-600",
    popular: false,
  },
];

const amounts = [5, 10, 15, 20, 25, 50, 100, 200];

const Home = () => {
  const { t } = useTranslation(["home"]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const { scrollY } = useScroll();

  // Parallax effect for hero section
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleBrandClick = (brandId: string) => {
    navigate(`/products?brand=${brandId}`);
  };

  const handleAmountClick = (brand: string, amount: number) => {
    navigate(`/products?brand=${brand}&amount=${amount}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-primary-800 dark:via-slate-900 dark:to-gray-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
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
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative container mx-auto px-4 py-20 lg:py-32"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-medium text-white">
                {t("banner")}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight"
            >
              {t("title")}
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
                {t("moto")}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            >
              {t("description")}
            </motion.p>

            {/* Search Bar */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors z-10" />
                <input
                  type="text"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl transition-all border-2 border-transparent focus:border-white/50"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold shadow-lg transition-all"
                >
                  Search
                </motion.button>
              </div>
            </motion.form>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center"
            >
              <motion.button
                onClick={() => navigate("/products")}
                className="group px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold shadow-2xl hover:shadow-white/20 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("browse")}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              fill="currentColor"
              className="text-gray-50 dark:text-gray-900"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 lg:py-24 bg-gradient-to-b from-transparent to-gray-100/50 dark:to-gray-800/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Zap,
              title: t("promise.instant"),
              description: t("promise.instantDesc"),
              gradient: "from-blue-500 to-blue-600",
            },
            {
              icon: Clock,
              title: t("promise.support"),
              description: t("promise.supportDesc"),
              gradient: "from-green-500 to-emerald-600",
            },
            {
              icon: Shield,
              title: t("promise.secure"),
              description: t("promise.secureDesc"),
              gradient: "from-purple-500 to-pink-600",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800"
              >
                <motion.div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-700 dark:via-slate-800 dark:to-gray-900 rounded-3xl p-12 lg:p-16 text-center text-white shadow-2xl overflow-hidden"
        >
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -50, 0],
                y: [0, -30, 0],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>

          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="relative z-10"
          >
            <Gift className="w-16 h-16 mx-auto mb-6" />
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl lg:text-5xl font-bold mb-4"
          >
            {t("start")}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            {t("startDesc")}
          </motion.p>
          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/products")}
            className="group px-10 py-5 bg-white text-primary-700 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all inline-flex items-center gap-3"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("shop")}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
