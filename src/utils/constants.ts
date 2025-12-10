import { OrderStatus, Role } from "@/types/common.types";

export const ORDER_STATUS_LABELS: Record<
  OrderStatus,
  { vi: string; en: string }
> = {
  [OrderStatus.PENDING]: { vi: "Chờ xử lý", en: "Pending" },
  [OrderStatus.REFUNDED]: { vi: "Đã hoàn lại", en: "Refunding" },
  [OrderStatus.COMPLETED]: { vi: "Hoàn thành", en: "Completed" },
  [OrderStatus.CANCELLED]: { vi: "Đã hủy", en: "Cancelled" },
  [OrderStatus.FAILED]: { vi: "Thất bại", en: "Failed" },
};

export const ROLE_LABELS: Record<Role, { vi: string; en: string }> = {
  [Role.MEMBER]: { vi: "Người dùng", en: "User" },
  [Role.ADMIN]: { vi: "Quản trị viên", en: "Admin" },
};

export const PRESET_AMOUNTS = [50000, 100000, 200000, 500000, 1000000];

export const PAYMENT_METHODS = {
  MOMO: "MOMO",
} as const;

export const QUERY_KEYS = {
  PRODUCTS: "products",
  PRODUCT: "product",
  ORDERS: "orders",
  ORDER: "order",
  USER_PROFILE: "userProfile",
} as const;
