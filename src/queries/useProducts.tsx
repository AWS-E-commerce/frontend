import { useQuery } from "@tanstack/react-query";
import { productService } from "@/api/services/product.service";
import type { PageRequest } from "@/types";

export const useProducts = (params?: PageRequest) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id && id > 0,
  });
};
