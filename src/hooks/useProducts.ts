// src/queries/useProducts.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/api/services/product.service";
import type {
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";
import { useUIStore } from "@/store/uiStore";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: ProductFilters) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

/**
 * Fetch paginated products with filters
 */
export const useProducts = (filters?: ProductFilters) => {
  console.log("useProducts called in useProducts with:", filters);
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetch a single product by ID
 */
export const useProduct = (id: number) => {
  console.log("useProduct called in useProduct with:", id);
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id && id > 0,
  });
};

/**
 * Create a new product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  console.log(
    "useCreateProduct called in useCreateProduct with: ",
    queryClient,
    addToast,
  );

  return useMutation({
    mutationFn: (data: CreateProductRequest) =>
      productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      addToast({ message: "Product created successfully", type: "success" });
    },
    onError: (error: any) => {
      addToast({
        message: error.response?.data?.message || "Failed to create product",
        type: "error",
      });
    },
  });
};

/**
 * Update an existing product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  console.log(
    "useUpdateProduct called in useUpdateProduct with: ",
    queryClient,
    addToast,
  );

  return useMutation<{ productId: number }, any, UpdateProductRequest>({
    mutationFn: (data: UpdateProductRequest) =>
      productService.updateProduct(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(data.productId),
      });
      addToast({ message: "Product updated successfully", type: "success" });
    },
    onError: (error: any) => {
      addToast({
        message: error.response?.data?.message || "Failed to update product",
        type: "error",
      });
    },
  });
};

/**
 * Delete a product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  console.log(
    "useDeleteProduct called in useDeleteProduct with: ",
    queryClient,
    addToast,
  );

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      addToast({ message: "Product deleted successfully", type: "success" });
    },
    onError: (error: any) => {
      addToast({
        message: error.response?.data?.message || "Failed to delete product",
        type: "error",
      });
    },
  });
};
