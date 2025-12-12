import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import type { ProductDetail } from "@/types";

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
    product: ProductDetail,
    variantId: number,
    quantity: number = 1,
  ) => {
    // Find the selected variant to get amount/value
    const selectedVariant = product.variant.find(
      (v) => v.variantId === variantId,
    );

    if (!selectedVariant) {
      addToast({
        message: "Invalid variant selected",
        type: "error",
      });
      return;
    }

    addItem({
      product: {
        productId: product.productId,
        name: product.name,
        description: product.description,
        pictureUrl: product.pictureUrl,
        branch: product.branch,
        discount: product.discount,
        variant: product.variant,
      },
      amount: selectedVariant.price,
      variantId: selectedVariant.variantId,
      quantity,
    });

    addToast({
      message: `${product.name} (${selectedVariant.value} ${selectedVariant.currency}) added to cart!`,
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
