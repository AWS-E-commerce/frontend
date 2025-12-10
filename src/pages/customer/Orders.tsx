// src/pages/customer/Orders.tsx
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
  orderItems: Array<{
    itemId: number;
    quantity: number;
    price: number;
    product: {
      name: string;
      description: string;
    };
  }>;
  transaction: {
    transactionId: number;
    transactionStatus: string;
    paymentCode: number;
    paidAt: string;
  };
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
  const [size] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Fetch orders history
  const { data, isLoading, error } = useQuery({
    queryKey: ["order-history", page, size],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/order/history?page=${page}&size=${size}`,
      );
      return response.data as PageResponse;
    },
  });

  // Fetch order detail
  const { data: orderDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["order-detail", selectedOrderId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/order/${selectedOrderId}`);
      return response.data as OrderDetail;
    },
    enabled: !!selectedOrderId,
  });

  // Cancel order mutation
  const cancelMutation = useMutation({
    mutationFn: async (orderId: number) => {
      await axiosInstance.post(`/order/${orderId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-history"] });
      queryClient.invalidateQueries({ queryKey: ["order-detail"] });
      alert("Order cancelled successfully!");
    },
    onError: (error: any) => {
      alert("Error: " + (error.response?.data?.message || error.message));
    },
  });

  const handleCancelOrder = (orderId: number) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelMutation.mutate(orderId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* Loading */}
      {isLoading && <div className="text-center py-12">Loading orders...</div>}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load orders"}
        </div>
      )}

      {/* Orders List */}
      {data && (
        <>
          {data.content.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-24 h-24 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                No orders yet
              </h2>
              <p className="text-gray-500 mb-6">
                Start shopping to see your orders here
              </p>
            </div>
          ) : (
            /* Orders Cards */
            <div className="space-y-4">
              {data.content.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm text-gray-500">
                        Order #{order.orderId}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(order.orderDate).toLocaleString()}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
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
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Total Amount</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {order.totalAmount.toLocaleString()} VND
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrderId(order.orderId)}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                      >
                        View Details
                      </button>
                      {order.orderStatus === "PENDING" && (
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          disabled={cancelMutation.isPending}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page + 1} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages - 1}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Order #{selectedOrderId}</h2>
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
                <div className="space-y-6">
                  {/* Order Status */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-bold text-lg">
                          {orderDetail.status}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Payment Method
                        </div>
                        <div className="font-medium">{orderDetail.payment}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Order Date</div>
                        <div className="font-medium">
                          {new Date(orderDetail.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Total Amount
                        </div>
                        <div className="font-bold text-blue-600">
                          {orderDetail.totalAmount.toLocaleString()} VND
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-bold mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {orderDetail.orderItems.map((item) => (
                        <div key={item.itemId} className="border rounded p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium">
                                {item.product.name}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {item.product.description}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-bold text-blue-600">
                                {item.price.toLocaleString()} VND
                              </div>
                              <div className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t text-right">
                            <span className="text-sm text-gray-500">
                              Subtotal:{" "}
                            </span>
                            <span className="font-bold">
                              {(item.price * item.quantity).toLocaleString()}{" "}
                              VND
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transaction Info */}
                  {orderDetail.transaction && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-bold mb-3">
                        Transaction Information
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">
                            Transaction ID:{" "}
                          </span>
                          <span className="font-medium">
                            {orderDetail.transaction.transactionId}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status: </span>
                          <span className="font-medium">
                            {orderDetail.transaction.transactionStatus}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Payment Code: </span>
                          <span className="font-medium">
                            {orderDetail.transaction.paymentCode}
                          </span>
                        </div>
                        {orderDetail.transaction.paidAt && (
                          <div>
                            <span className="text-gray-600">Paid At: </span>
                            <span className="font-medium">
                              {new Date(
                                orderDetail.transaction.paidAt,
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {orderDetail.status === "PENDING" && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCancelOrder(selectedOrderId)}
                        disabled={cancelMutation.isPending}
                        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {cancelMutation.isPending
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
