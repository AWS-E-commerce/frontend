// src/api/services/order.service.ts
import { axiosInstance } from "../axios.config";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderDetail,
  OrderPageResponse,
  PageRequest,
} from "@/types";

/**
 * Get user's order history with pagination
 */
export const getOrderHistory = async (
  params?: PageRequest,
): Promise<OrderPageResponse> => {
  const { data } = await axiosInstance.get<OrderPageResponse>(
    "/order/history",
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        sort: params?.sort ?? ["createdAt,desc"],
      },
    },
  );
  return data;
};

/**
 * Create a new order
 */
export const createOrder = async (
  orderData: CreateOrderRequest,
): Promise<CreateOrderResponse> => {
  const { data } = await axiosInstance.post<CreateOrderResponse>(
    "/order/create",
    orderData,
  );
  return data;
};

/**
 * Get order details by ID
 */
export const getOrderById = async (orderId: number): Promise<OrderDetail> => {
  const { data } = await axiosInstance.get<OrderDetail>(`/order/${orderId}`);
  return data;
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId: number): Promise<void> => {
  await axiosInstance.post(`/order/${orderId}/cancel`);
};

/**
 * Helper: Get order statistics from history
 */
export const getOrderStats = async () => {
  const history = await getOrderHistory({ page: 0, size: 1000 });

  const totalOrders = history.totalElements;
  const totalSpent = history.content.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );
  const pendingOrders = history.content.filter(
    (o) => o.status === "PENDING",
  ).length;
  const completedOrders = history.content.filter(
    (o) => o.status === "COMPLETED",
  ).length;
  const cancelledOrders = history.content.filter(
    (o) => o.status === "CANCELLED",
  ).length;

  return {
    totalOrders,
    totalSpent,
    pendingOrders,
    completedOrders,
    cancelledOrders,
  };
};
