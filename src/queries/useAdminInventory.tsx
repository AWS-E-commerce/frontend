// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   adminService
// } from "@/api/services/admin.service";
// import type { InventoryFilters } from "@/types/product.types";
// import { useUIStore } from "@/store/uiStore";

// export const useInventoryStatus = () => {
//   return useQuery({
//     queryKey: ["inventory-status"],
//     queryFn: adminService.getInventoryStatus,
//   });
// };

// export const useInventoryCards = (filters: InventoryFilters = {}) => {
//   return useQuery({
//     queryKey: ["inventory-cards", filters],
//     queryFn: () => getInventoryCards(filters),
//   });
// };

// export const useDeleteCard = () => {
//   const queryClient = useQueryClient();
//   const addToast = useUIStore((state) => state.addToast);

//   return useMutation({
//     mutationFn: (storageId: number) => deleteInventoryCard(storageId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["inventory-cards"] });
//       queryClient.invalidateQueries({ queryKey: ["inventory-status"] });
//       addToast({
//         type: "success",
//         message: "Card deleted successfully",
//       });
//     },
//     onError: (error: any) => {
//       addToast({
//         type: "error",
//         message: error.response?.data?.message || "Failed to delete card",
//       });
//     },
//   });
// };
