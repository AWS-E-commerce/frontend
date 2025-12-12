// src/queries/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrderHistory,
  createOrder,
  getOrderById,
  cancelOrder,
  getOrderStats,
} from "@/api/services/order.service";
import type {
  CreateOrderRequest,
  PageRequest,
  OrderDetail,
  CreateOrderResponse,
} from "@/types";
import { useAuthStore } from "@/store/authStore";

export const ORDER_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_KEYS.all, "list"] as const,
  list: (params?: PageRequest) => [...ORDER_KEYS.lists(), params] as const,
  details: () => [...ORDER_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ORDER_KEYS.details(), id] as const,
  stats: () => [...ORDER_KEYS.all, "stats"] as const,
};

/**
 * Hook to fetch order history with pagination
 */
export const useOrderHistory = (params?: PageRequest) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ORDER_KEYS.list(params),
    queryFn: () => getOrderHistory(params),
    enabled: isAuthenticated,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
};

/**
 * Hook to fetch a single order by ID
 */
export const useOrder = (orderId: number, enabled: boolean = true) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ORDER_KEYS.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: isAuthenticated && orderId > 0 && enabled,
    staleTime: 60000, // 1 minute
    retry: 1,
  });
};

/**
 * Hook to get order statistics
 */
export const useOrderStats = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ORDER_KEYS.stats(),
    queryFn: getOrderStats,
    enabled: isAuthenticated,
    staleTime: 300000, // 5 minutes
    retry: 1,
  });
};

/**
 * Hook to create a new order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateOrderResponse, Error, CreateOrderRequest>({
    mutationFn: (orderData: CreateOrderRequest) => createOrder(orderData),
    onSuccess: (data) => {
      // Invalidate order lists to refetch
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.stats() });

      // Only set query data if we have full order details
      // The create response only has orderId and paymentUrl
      // We'll fetch full details later when viewing the order
    },
    onError: (error: any) => {
      console.error("Order creation failed:", error);
    },
    retry: false,
  });
};

/**
 * Hook to cancel an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      // Invalidate the specific order and list
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.stats() });
    },
    onError: (error: any) => {
      console.error("Order cancellation failed:", error);
    },
  });
};
