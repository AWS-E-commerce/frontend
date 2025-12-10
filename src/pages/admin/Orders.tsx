// src/pages/admin/Orders.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";

interface Order {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  totalAmount: number;
}

interface OrderDetail {
  orderId: number;
  payment: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  user: any;
  orderItems: any[];
  transaction: any;
}

interface PageResponse {
  content: Order[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export default function Orders() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    username: "",
    status: "",
  });
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Fetch orders list
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-orders", page, size, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      if (filters.username) params.append("username", filters.username);
      if (filters.status) params.append("status", filters.status);

      const response = await axiosInstance.get(`/admin/orders?${params}`);
      return response.data as PageResponse;
    },
  });

  // Fetch order detail
  const { data: orderDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["admin-order-detail", selectedOrderId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/orders/${selectedOrderId}`,
      );
      return response.data as OrderDetail;
    },
    enabled: !!selectedOrderId,
  });

  // Update order status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: number;
      status: string;
    }) => {
      await axiosInstance.put(
        `/admin/orders/${orderId}/status?status=${status}`,
        {},
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-detail"] });
      alert("Order status updated successfully!");
    },
    onError: (error: any) => {
      alert("Error: " + (error.response?.data?.message || error.message));
    },
  });

  // Refund order
  const refundMutation = useMutation({
    mutationFn: async (orderId: number) => {
      await axiosInstance.post(`/admin/orders/${orderId}/refund`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-detail"] });
      alert("Order refunded successfully!");
    },
    onError: (error: any) => {
      alert("Error: " + (error.response?.data?.message || error.message));
    },
  });

  const handleStatusChange = (orderId: number, status: string) => {
    if (confirm(`Change order status to ${status}?`)) {
      updateStatusMutation.mutate({ orderId, status });
    }
  };

  const handleRefund = (orderId: number) => {
    if (confirm("Are you sure you want to refund this order?")) {
      refundMutation.mutate(orderId);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={filters.username}
              onChange={(e) =>
                setFilters({ ...filters, username: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              placeholder="Search username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="FAILED">FAILED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => refetch()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && <div className="text-center py-8">Loading orders...</div>}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load orders"}
        </div>
      )}

      {/* Orders Table */}
      {data && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.content.map((order) => (
                  <tr key={order.orderId}>
                    <td className="px-6 py-4 text-sm font-medium">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.totalAmount.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.orderStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.orderStatus === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : order.orderStatus === "REFUNDED"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => setSelectedOrderId(order.orderId)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRefund(order.orderId)}
                        className="text-orange-600 hover:text-orange-800"
                        disabled={refundMutation.isPending}
                      >
                        Refund
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {data.content.length} of {data.totalElements} orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page + 1} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages - 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order #{selectedOrderId}</h2>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {detailLoading && (
                <div className="text-center py-8">Loading details...</div>
              )}

              {orderDetail && (
                <div className="space-y-4">
                  {/* Customer Info */}
                  {orderDetail.user && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-bold mb-2">Customer Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Username:</span>{" "}
                          {orderDetail.user.username}
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>{" "}
                          {orderDetail.user.email}
                        </div>
                        {orderDetail.user.memberProfile && (
                          <>
                            <div>
                              <span className="text-gray-500">Name:</span>{" "}
                              {orderDetail.user.memberProfile.name}
                            </div>
                            <div>
                              <span className="text-gray-500">Phone:</span>{" "}
                              {orderDetail.user.memberProfile.phone}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="font-medium">{orderDetail.status}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Payment Method
                      </div>
                      <div className="font-medium">{orderDetail.payment}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Total Amount</div>
                      <div className="font-medium">
                        {orderDetail.totalAmount.toLocaleString()} VND
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Created At</div>
                      <div className="font-medium">
                        {new Date(orderDetail.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {orderDetail.orderItems &&
                    orderDetail.orderItems.length > 0 && (
                      <div>
                        <h3 className="font-bold mb-2">Order Items</h3>
                        <div className="border rounded">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs">
                                  Product
                                </th>
                                <th className="px-4 py-2 text-left text-xs">
                                  Quantity
                                </th>
                                <th className="px-4 py-2 text-left text-xs">
                                  Price
                                </th>
                                <th className="px-4 py-2 text-left text-xs">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetail.orderItems.map(
                                (item: any, idx: number) => (
                                  <tr key={idx} className="border-t">
                                    <td className="px-4 py-2">
                                      {item.product?.name || "N/A"}
                                    </td>
                                    <td className="px-4 py-2">
                                      {item.quantity}
                                    </td>
                                    <td className="px-4 py-2">
                                      {item.price.toLocaleString()} VND
                                    </td>
                                    <td className="px-4 py-2">
                                      {(
                                        item.price * item.quantity
                                      ).toLocaleString()}{" "}
                                      VND
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  {/* Transaction Info */}
                  {orderDetail.transaction && (
                    <div className="bg-blue-50 p-4 rounded">
                      <h3 className="font-bold mb-2">
                        Transaction Information
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Transaction ID:</span>{" "}
                          {orderDetail.transaction.transactionId}
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>{" "}
                          {orderDetail.transaction.transactionStatus}
                        </div>
                        <div>
                          <span className="text-gray-500">Payment Code:</span>{" "}
                          {orderDetail.transaction.paymentCode}
                        </div>
                        {orderDetail.transaction.paidAt && (
                          <div>
                            <span className="text-gray-500">Paid At:</span>{" "}
                            {new Date(
                              orderDetail.transaction.paidAt,
                            ).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status Update */}
                  <div>
                    <h3 className="font-bold mb-2">Update Status</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(selectedOrderId, "PENDING")
                        }
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        disabled={updateStatusMutation.isPending}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(selectedOrderId, "COMPLETED")
                        }
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        disabled={updateStatusMutation.isPending}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(selectedOrderId, "CANCELLED")
                        }
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        disabled={updateStatusMutation.isPending}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(selectedOrderId, "FAILED")
                        }
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        disabled={updateStatusMutation.isPending}
                      >
                        Failed
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
