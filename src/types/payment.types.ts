import type { User, OrderDetail, TransactionStatus } from "@/types";

export interface Transaction {
  transactionId: number;
  user: User;
  orders: OrderDetail[];
  activation_date: string; // date-time
  total_price: number;
  transactionStatus: TransactionStatus;
  paidAt: string; // date-time
  createAts: string; // date-time
  paymentCode: number;
}

export interface WebhookRequest {
  data: Record<string, any>;
  signature: string;
}
