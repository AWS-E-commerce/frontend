import type { ProductDetail } from "@/types";

export interface CartItem {
  id: string; // generated client-side
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
  };
  amount: number; // selected variant value
  variantId: number; // ADD THIS - needed for order creation
  quantity: number;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface UpdateRecipientData {
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
}
