// src/pages/admin/Dashboard.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";
import {
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Search,
  Loader2,
  AlertCircle,
  BarChart3,
} from "lucide-react";

interface RevenueData {
  fromDate: string;
  toDate: string;
  revenue: number;
  orders: number;
}

export default function Dashboard() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["revenue", fromDate, toDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      const response = await axiosInstance.get(
        `/admin/dashboard/revenue?${params}`,
      );
      return response.data as RevenueData;
    },
    enabled: false,
  });

  const handleSearch = () => {
    refetch();
  };

  const setDatePreset = (preset: string) => {
    const today = new Date();
    const to = today.toISOString().split("T")[0];
    let from = "";

    switch (preset) {
      case "today":
        from = to;
        break;
      case "7days":
        from = new Date(today.setDate(today.getDate() - 7))
          .toISOString()
          .split("T")[0];
        break;
      case "30days":
        from = new Date(today.setDate(today.getDate() - 30))
          .toISOString()
          .split("T")[0];
        break;
      case "90days":
        from = new Date(today.setDate(today.getDate() - 90))
          .toISOString()
          .split("T")[0];
        break;
    }

    setFromDate(from);
    setToDate(to);
  };

  const averageOrderValue = data?.orders ? data.revenue / data.orders : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Revenue Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Monitor your business performance
            </p>
          </div>
        </div>

        {/* Date Filter Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Calendar className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Date Range Filter</h2>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Today", value: "today" },
                { label: "Last 7 Days", value: "7days" },
                { label: "Last 30 Days", value: "30days" },
                { label: "Last 90 Days", value: "90days" },
              ].map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setDatePreset(preset.value)}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-200 hover:scale-105"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Date Inputs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Fetching revenue data...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-6 rounded-xl shadow-md animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                  Error Loading Data
                </h3>
                <p className="text-red-700 dark:text-red-300">
                  {error instanceof Error
                    ? error.message
                    : "Failed to load revenue data. Please try again."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Data */}
        {data && (
          <div className="space-y-6 animate-fade-in">
            {/* Date Range Display */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">
                  Report Period
                </span>
              </div>
              <div className="text-2xl font-bold">
                {data.fromDate} → {data.toDate}
              </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Revenue Card */}
              <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
                    Revenue
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Total Revenue
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {data.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    VND
                  </div>
                </div>
              </div>

              {/* Total Orders Card */}
              <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
                    Orders
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Total Orders
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {data.orders.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Completed
                  </div>
                </div>
              </div>

              {/* Average Order Value Card */}
              <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-purple-600 dark:text-purple-400 text-sm font-medium bg-purple-50 dark:bg-purple-950/30 px-3 py-1 rounded-full">
                    Average
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Average Order Value
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {averageOrderValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    VND per order
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!data && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
              <BarChart3 className="w-12 h-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No Data Available
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
              Select a date range and click Search to view your revenue
              analytics
            </p>
          </div>
        )}
      </div>

      {/* Add custom animations in your global CSS or Tailwind config */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
