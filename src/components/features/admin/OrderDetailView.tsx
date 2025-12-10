import React from "react";
import type { OrderDetail } from "@/types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  Package,
  User,
  Mail,
  Calendar,
  DollarSign,
  CreditCard,
  Hash,
  Phone,
  MapPin,
} from "lucide-react";

interface OrderDetailViewProps {
  order: OrderDetail;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order }) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELED: "bg-gray-100 text-gray-800",
      FAILED: "bg-red-100 text-red-800",
      REFUNDED: "bg-blue-100 text-blue-800",
      IN_PROCESS: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Customer Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Name:</span>
              <span className="font-medium text-gray-900">
                {order.user.memberProfile.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Username:</span>
              <span className="font-medium text-gray-900">
                {order.user.username}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">
                {order.user.email}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">
                {order.user.memberProfile.phone || "N/A"}
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <span className="text-gray-600">Address:</span>
              <span className="font-medium text-gray-900">
                {order.user.memberProfile.address || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* OrderDetail & Transaction Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OrderDetail Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            OrderDetail Status
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-lg ${getStatusColor(
                  order.status,
                )}`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Created:</span>
              <span className="font-medium text-gray-900">
                {formatDate(order.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Payment:</span>
              <span className="font-medium text-gray-900">{order.payment}</span>
            </div>
          </div>
        </div>

        {/* Transaction Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Transaction Info</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-lg ${getStatusColor(
                  order.transaction.transactionStatus,
                )}`}
              >
                {order.transaction.transactionStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium text-gray-900">
                {order.transaction.transactionId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Payment Code:</span>
              <span className="font-medium text-gray-900">
                {order.transaction.paymentCode}
              </span>
            </div>
            {order.transaction.paidAt && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Paid At:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(order.transaction.paidAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OrderDetail Items */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">OrderDetail Items</h3>
        <div className="space-y-3">
          {order.orderItems.map((item) => (
            <div
              key={item.itemId}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <img
                src={item.product.pictureURL}
                alt={item.product.productName}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.product.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.product.branch.name}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: {formatCurrency(item.price)}</span>
                </div>

                {/* Show activation codes if available */}
                {item.product.productVariantResponses &&
                  item.product.productVariantResponses.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Activation Codes:
                      </p>
                      <div className="space-y-1">
                        {item.product.productVariantResponses.flatMap(
                          (variant) =>
                            variant.storageList
                              .slice(0, item.quantity)
                              .map((storage) => (
                                <div
                                  key={storage.storageId}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <code className="px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs">
                                    {storage.activateCode}
                                  </code>
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded-full ${
                                      storage.status === "USED"
                                        ? "bg-gray-100 text-gray-600"
                                        : "bg-green-100 text-green-600"
                                    }`}
                                  >
                                    {storage.status}
                                  </span>
                                </div>
                              )),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <span className="text-lg font-semibold text-gray-900">
              Total Amount
            </span>
          </div>
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};
