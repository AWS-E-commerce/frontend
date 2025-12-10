// src/pages/admin/Dashboard.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Date Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <div className="text-center py-8">Loading...</div>}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load data"}
        </div>
      )}

      {/* Revenue Data */}
      {data && (
        <div className="space-y-4">
          {/* Date Range Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">
              Report Period
            </div>
            <div className="text-lg font-bold mt-1">
              {data.fromDate} - {data.toDate}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm">Total Revenue</div>
              <div className="text-3xl font-bold mt-2 text-green-600">
                {data.revenue.toLocaleString()} VND
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm">Total Orders</div>
              <div className="text-3xl font-bold mt-2 text-blue-600">
                {data.orders}
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm">Average Order Value</div>
            <div className="text-2xl font-bold mt-2">
              {data.orders > 0
                ? (data.revenue / data.orders).toLocaleString()
                : 0}{" "}
              VND
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!data && !isLoading && !error && (
        <div className="text-center py-8 text-gray-500">
          Select date range and click Search to view revenue data
        </div>
      )}
    </div>
  );
}
