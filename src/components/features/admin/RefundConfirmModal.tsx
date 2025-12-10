// src/components/features/admin/RefundConfirmModal.tsx
import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/common/Button/Button";
import { useRefundOrder } from "@/queries/useAdmin";

interface RefundConfirmModalProps {
  orderId: number;
  onClose: () => void;
}

export const RefundConfirmModal: React.FC<RefundConfirmModalProps> = ({
  orderId,
  onClose,
}) => {
  const refundMutation = useRefundOrder();

  const handleRefund = async () => {
    try {
      await refundMutation.mutateAsync(orderId);
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Refund Order
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={refundMutation.isPending}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to refund order{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              #{orderId}
            </span>
            ?
          </p>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-purple-900 dark:text-purple-100">
              <strong>Important:</strong> This action will:
            </p>
            <ul className="list-disc list-inside text-sm text-purple-800 dark:text-purple-200 mt-2 space-y-1">
              <li>Process a full refund to the customer</li>
              <li>Mark the order as REFUNDED</li>
              <li>Deactivate any gift card codes</li>
              <li>This action cannot be undone</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={refundMutation.isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleRefund}
            disabled={refundMutation.isPending}
            className="flex-1"
          >
            {refundMutation.isPending ? "Processing..." : "Confirm Refund"}
          </Button>
        </div>
      </div>
    </div>
  );
};
