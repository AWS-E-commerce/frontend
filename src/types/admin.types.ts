import type { StorageStatus, Page, PageRequest } from "@/types";

// Dashboard
export interface RevenueData {
  [date: string]: number;
}

export interface RevenueQueryParams {
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
}

export interface CardQueryParams extends PageRequest {
  variantId?: number;
  status?: StorageStatus;
  codeKeyword?: string;
}
