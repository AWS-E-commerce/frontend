import React, { useState } from "react";
import { Trash2, Plus, Minus, Edit2, Check, X } from "lucide-react";
import type { CartItem as CartItemType } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { useCart } from "@/hooks/useCart";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    updateRecipient,
  } = useCart();
  const [isEditingRecipient, setIsEditingRecipient] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(
    item.recipientEmail || "",
  );
  const [recipientName, setRecipientName] = useState(item.recipientName || "");
  const [message, setMessage] = useState(item.message || "");

  const handleSaveRecipient = () => {
    updateRecipient(item.id, {
      recipientEmail,
      recipientName,
      message,
    });
    setIsEditingRecipient(false);
  };

  const handleCancelEdit = () => {
    setRecipientEmail(item.recipientEmail || "");
    setRecipientName(item.recipientName || "");
    setMessage(item.message || "");
    setIsEditingRecipient(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
        />

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Amount:{" "}
                <span className="font-semibold">
                  {formatCurrency(item.amount)}
                </span>
              </p>
            </div>

            {/* Price */}
            <div className="text-right ml-4">
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(item.amount * item.quantity)}
              </p>
              <p className="text-sm text-gray-500">
                {formatCurrency(item.amount)} × {item.quantity}
              </p>
            </div>
          </div>

          {/* Recipient Info */}
          {!isEditingRecipient ? (
            <div className="mb-3">
              {item.recipientEmail ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">To:</span>{" "}
                    {item.recipientName || "Not specified"} (
                    {item.recipientEmail})
                  </p>
                  {item.message && (
                    <p>
                      <span className="font-medium">Message:</span>{" "}
                      {item.message}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No recipient information
                </p>
              )}
            </div>
          ) : (
            <div className="mb-3 space-y-2">
              <input
                type="text"
                placeholder="Recipient name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="email"
                placeholder="Recipient email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                placeholder="Message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Decrease quantity"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-gray-900 font-semibold w-8 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => increaseQuantity(item.id)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Increase quantity"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Edit/Delete Actions */}
            <div className="flex items-center gap-2">
              {!isEditingRecipient ? (
                <>
                  <button
                    onClick={() => setIsEditingRecipient(true)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Recipient</span>
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveRecipient}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
