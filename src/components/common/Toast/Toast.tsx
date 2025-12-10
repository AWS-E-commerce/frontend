import React, { useEffect } from "react";
import { X, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export const Toast = () => {
  const { toasts, removeToast } = useUIStore();

  useEffect(() => {
    console.log("useEffect called in Toast: ", toasts);
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration || 3000);

      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  const styles = {
    success: "bg-success-50 text-success-600 border-success-200",
    error: "bg-error-50 text-error-600 border-error-200",
    info: "bg-blue-50 text-blue-600 border-blue-200",
    warning: "bg-warning-50 text-warning-600 border-warning-200",
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] animate-slideIn ${
            styles[toast.type]
          }`}
        >
          {icons[toast.type]}
          <p className="flex-1 font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
