import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/api/services/admin.service";
import type { RevenueQueryParams } from "@/types";

export const useRevenue = (params?: RevenueQueryParams) => {
  return useQuery({
    queryKey: ["admin", "revenue", params],
    queryFn: () => adminService.getRevenue(params),
  });
};
