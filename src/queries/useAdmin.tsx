// src/queries/useAdmin.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/api/services/admin.service";
import { useUIStore } from "@/store/uiStore";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  AddVariantRequest,
  UpdateVariantRequest,
  AddStockRequest,
} from "@/types";

// Products
export const useAdminProducts = (params?: any) => {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: () => adminService.getProducts(),
  });
};

export const useAdminProduct = (id: number) => {
  return useQuery({
    queryKey: ["admin", "product", id],
    queryFn: () => adminService.getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data: CreateProductRequest) =>
      adminService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      addToast({
        type: "success",
        message: "Product created successfully",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to create product",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      adminService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product"] });
      addToast({
        type: "success",
        message: "Product updated successfully",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to update product",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (id: number) => adminService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      addToast({
        type: "success",
        message: "Product deleted successfully",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to delete product",
      });
    },
  });
};

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ productId, file }: { productId: number; file: File }) =>
      adminService.uploadProductImage(productId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product"] });
      addToast({
        type: "success",
        message: "Image uploaded successfully",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to upload image",
      });
    },
  });
};

// Variants
export const useAddVariants = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({
      productId,
      variants,
    }: {
      productId: number;
      variants: AddVariantRequest[];
    }) => adminService.addVariants(productId, variants),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product"] });
      addToast({
        type: "success",
        message: "Variant added successfully",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to add variant",
      });
    },
  });
};

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({
      variantId,
      data,
    }: {
      variantId: number;
      data: UpdateVariantRequest;
    }) => adminService.updateVariant(variantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product"] });
      addToast({
        type: "success",
        message: "Variant updated successfully",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to update variant",
      });
    },
  });
};

// Orders
export const useAdminOrders = (params?: any) => {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: () => adminService.getOrders(params),
  });
};

export const useAdminOrder = (id: number) => {
  return useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => adminService.getOrderById(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      adminService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "order"] });
      addToast({
        type: "success",
        message: "Order status updated successfully",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        message:
          error.response?.data?.message || "Failed to update order status",
      });
    },
  });
};

export const useRefundOrder = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (orderId: number) => adminService.refundOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "order"] });
      addToast({
        type: "success",
        message: "Order refunded successfully",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to refund order",
      });
    },
  });
};

// Stock Management
export const useAddStock = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data: AddStockRequest) => adminService.addStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-cards"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-status"] });
      addToast({
        type: "success",
        message: "Stock added successfully",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to add stock",
      });
    },
  });
};
