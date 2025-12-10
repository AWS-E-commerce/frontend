import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

interface SimpleProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
}

export const useCart = () => {
  const {
    items,
    totalItems,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    updateRecipient,
    clearCart,
  } = useCartStore();

  const addToast = useUIStore((state) => state.addToast);

  const addToCart = (
    product: SimpleProduct,
    amount: number,
    quantity: number = 1,
  ) => {
    addItem({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        presetAmounts: [amount],
        allowCustomAmount: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      amount,
      quantity,
    });

    addToast({
      message: `${product.name} added to cart!`,
      type: "success",
    });
  };

  const removeFromCart = (itemId: string) => {
    removeItem(itemId);
    addToast({
      message: "Item removed from cart",
      type: "info",
    });
  };

  const increaseQuantity = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  const decreaseQuantity = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      if (item.quantity === 1) {
        removeFromCart(itemId);
      } else {
        updateQuantity(itemId, item.quantity - 1);
      }
    }
  };

  return {
    items,
    totalItems,
    totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    updateRecipient,
    clearCart,
  };
};
