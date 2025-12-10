import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBrandClick = (brandId: string) => {
    navigate(`/products?brand=${brandId}`);
  };

  const handleAmountClick = (brand: string, amount: number) => {
    navigate(`/products?brand=${brand}&amount=${amount}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b dark:from-gray-900 dark:to-gray-800 from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div
            className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 animate-bounce">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Instant Delivery • 24/7 Support
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Gaming Gift Cards
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Delivered Instantly
              </span>
            </h1>

            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Buy gift cards from top gaming platforms. Steam, PlayStation,
              Xbox, and more. Digital delivery in seconds.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search for gift cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl transition-all"
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate("/products")}
                className="group px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Browse All Cards
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/products?popular=true")}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Popular Picks
              </button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#F9FAFB"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="container mx-auto px-4 py-16">
        <div
          className={`transform transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Brands
              </h2>
              <p className="text-gray-600">
                Choose from the most popular gaming platforms
              </p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
            >
              View All
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredBrands.map((brand, index) => (
              <div
                key={brand.id}
                onClick={() => handleBrandClick(brand.id)}
                className={`group relative cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div
                  className={`relative bg-gradient-to-br ${brand.color} rounded-2xl p-6 aspect-square flex flex-col items-center justify-center text-white shadow-lg group-hover:shadow-2xl transition-all`}
                >
                  {brand.popular && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Popular
                    </div>
                  )}
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {brand.logo}
                  </div>
                  <h3 className="font-bold text-center text-sm">
                    {brand.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Buy Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div
            className={`transform transition-all duration-1000 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-4">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">Quick Buy</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Choose Your Amount
              </h2>
              <p className="text-gray-600">
                Select a brand and amount to get started instantly
              </p>
            </div>

            {/* Brand Selector */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {featuredBrands.slice(0, 4).map((brand) => (
                <button
                  key={brand.id}
                  onClick={() =>
                    setSelectedBrand(
                      selectedBrand === brand.id ? null : brand.id,
                    )
                  }
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedBrand === brand.id
                      ? "bg-primary-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300 hover:shadow-md"
                  }`}
                >
                  <span className="mr-2">{brand.logo}</span>
                  {brand.name}
                </button>
              ))}
            </div>

            {/* Amount Grid */}
            {selectedBrand && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto animate-fadeIn">
                {amounts.map((amount, index) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountClick(selectedBrand, amount)}
                    className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ShoppingCart className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        ${amount}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        USD
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!selectedBrand && (
              <div className="text-center py-12 text-gray-400">
                <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a brand above to see available amounts</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div
          className={`grid md:grid-cols-3 gap-8 transform transition-all duration-1000 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Instant Delivery
            </h3>
            <p className="text-gray-600">
              Receive your gift card code immediately after purchase. No
              waiting, no delays.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-200">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              24/7 Support
            </h3>
            <p className="text-gray-600">
              Our customer support team is always ready to help you with any
              questions.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-200">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Best Prices
            </h3>
            <p className="text-gray-600">
              Get the best value for your money with competitive prices on all
              cards.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 py-16">
        <div
          className={`bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-12 text-center text-white shadow-2xl transform transition-all duration-1000 delay-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Gift className="w-16 h-16 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of gamers who trust us for their gift card needs.
            Fast, secure, and reliable.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="group px-10 py-5 bg-white text-primary-700 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            Shop Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
