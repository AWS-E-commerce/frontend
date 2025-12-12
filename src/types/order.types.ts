import type {
  OrderStatus,
  Page,
  ProductDetail,
  Transaction,
  User,
} from "@/types";

export interface CreateOrderRequest {
  orderItemRequests: ItemRequest[];
  paymentMethod: string;
}

export interface ItemRequest {
  variantId: number;
  quantity: number;
}

export interface OrderDetail {
  orderId: number;
  payment: string;
  status: OrderStatus;
  createdAt: string; // date-time
  transaction: Transaction;
  totalAmount: number;
  orderItems: Item[];
  user: User;
}

export interface Item {
  itemId: number;
  quantity: number;
  price: number;
  order: OrderDetail;
  product: ProductDetail;
}

export interface AdminOrderListResponse {
  content: OrderDetail[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface AdminOrderFilters {
  from?: string;
  to?: string;
  username?: string;
  status?: OrderStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export interface OrderStatusUpdateRequest {
  orderId: number;
  status: OrderStatus;
}

export interface RefundRequest {
  orderId: number;
}

export interface CreateOrderResponse {
  orderId: number;
  paymentUrl: string;
}

export interface OrderPageResponse extends Page<OrderDetail> {}
