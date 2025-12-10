import { axiosInstance } from "../axios.config";
import { ENDPOINTS } from "../endpoints";
import type {
  ProductPageResponse,
  ProductDetailResponse,
  PageRequest,
} from "@/types";

export const productService = {
  // Get products with pagination
  getProducts: async (params?: PageRequest): Promise<ProductPageResponse> => {
    const response = await axiosInstance.get<ProductPageResponse>(
      ENDPOINTS.PRODUCTS.LIST,
      { params },
    );
    return response.data;
  },

  // Get single product detail
  getProductById: async (id: number): Promise<ProductDetailResponse> => {
    const response = await axiosInstance.get<ProductDetailResponse>(
      ENDPOINTS.PRODUCTS.DETAIL(id),
    );
    return response.data;
  },
};
