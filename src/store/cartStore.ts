import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Cart, UpdateRecipientData } from "@/types";

interface CartState extends Cart {
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateRecipient: (itemId: string, recipientData: UpdateRecipientData) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,

      addItem: (newItem) =>
        set((state) => {
          // Check if same product with same amount already exists
          const existingItemIndex = state.items.findIndex(
            (item) =>
              // item.product.id === newItem.product.id &&
              // item.amount === newItem.amount,
              item.product.id === newItem.product.id &&
              item.variantId === newItem.variantId,
          );

          let updatedItems: CartItem[];

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            updatedItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item,
            );
          } else {
            // Add new item with unique ID
            // const id = `${newItem.product.id}-${newItem.amount}-${Date.now()}`;
            const id = `${newItem.product.id}-${newItem.variantId}-${Date.now()}`;
            const item: CartItem = { ...newItem, id };
            updatedItems = [...state.items, item];
          }

          const totalItems = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          const totalAmount = updatedItems.reduce(
            (sum, item) => sum + item.amount * item.quantity,
            0,
          );

          return {
            items: updatedItems,
            totalItems,
            totalAmount,
          };
        }),

      removeItem: (itemId) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== itemId);
          const totalItems = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          const totalAmount = updatedItems.reduce(
            (sum, item) => sum + item.amount * item.quantity,
            0,
          );

          return {
            items: updatedItems,
            totalItems,
            totalAmount,
          };
        }),

      updateQuantity: (itemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return get().removeItem(itemId) as any;
          }

          const updatedItems = state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item,
          );

          const totalItems = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          const totalAmount = updatedItems.reduce(
            (sum, item) => sum + item.amount * item.quantity,
            0,
          );

          return {
            items: updatedItems,
            totalItems,
            totalAmount,
          };
        }),

      updateRecipient: (itemId, recipientData) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, ...recipientData } : item,
          ),
        })),

      clearCart: () =>
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
        }),

      getCartTotal: () => {
        const { items } = get();
        return items.reduce(
          (sum, item) => sum + item.amount * item.quantity,
          0,
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
