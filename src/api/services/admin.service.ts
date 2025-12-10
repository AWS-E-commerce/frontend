import { axiosInstance } from "../axios.config";
import { ENDPOINTS } from "../endpoints";
import type {
  ProductDetail,
  UpdateProductRequest,
  OrderDetail,
  OrderPageResponse,
  RevenueData,
  RevenueQueryParams,
  InventoryStatusResponse,
  CardDetailResponse,
  CardQueryParams,
} from "@/types";

export const adminService = {
  // Products
  getProducts: async (): Promise<ProductDetail[]> => {
    const response = await axiosInstance.get<ProductDetail[]>(
      ENDPOINTS.ADMIN.PRODUCTS.LIST,
    );
    return response.data;
  },

  getProductById: async (id: number): Promise<ProductDetail> => {
    const response = await axiosInstance.get<ProductDetail>(
      ENDPOINTS.ADMIN.PRODUCTS.DETAIL(id),
    );
    return response.data;
  },

  updateProduct: async (
    id: number,
    data: UpdateProductRequest,
  ): Promise<ProductDetail> => {
    const response = await axiosInstance.put<ProductDetail>(
      ENDPOINTS.ADMIN.PRODUCTS.UPDATE(id),
      data,
    );
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.ADMIN.PRODUCTS.DELETE(id));
  },

  // Orders
  getOrders: async (params?: any): Promise<OrderPageResponse> => {
    const response = await axiosInstance.get<OrderPageResponse>(
      ENDPOINTS.ADMIN.ORDERS.LIST,
      { params },
    );
    return response.data;
  },

  getOrderById: async (id: number): Promise<OrderDetail> => {
    const response = await axiosInstance.get<OrderDetail>(
      ENDPOINTS.ADMIN.ORDERS.DETAIL(id),
    );
    return response.data;
  },

  // Dashboard
  getRevenue: async (params?: RevenueQueryParams): Promise<RevenueData> => {
    const response = await axiosInstance.get<RevenueData>(
      ENDPOINTS.ADMIN.DASHBOARD.REVENUE,
      { params },
    );
    return response.data;
  },

  // Inventory
  getInventoryStatus: async (): Promise<InventoryStatusResponse[]> => {
    const response = await axiosInstance.get<InventoryStatusResponse[]>(
      ENDPOINTS.ADMIN.INVENTORY.STATUS,
    );
    return response.data;
  },

  getCards: async (params?: CardQueryParams): Promise<CardDetailResponse> => {
    const response = await axiosInstance.get<CardDetailResponse>(
      ENDPOINTS.ADMIN.INVENTORY.CARDS,
      { params },
    );
    return response.data;
  },

  deleteCard: async (id: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.ADMIN.INVENTORY.DELETE_CARD(id));
  },
};
