import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";
import { formatDateToDDMMYYYY } from "@/utils/formatters";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  Edit3,
  Package,
  X,
  Search,
  Grid3x3,
  List,
  DollarSign,
  Layers,
  TrendingUp,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface Product {
  productId: number;
  productName: string;
}

interface Variant {
  id: number;
  value: number;
  price: number;
  currency: string;
}

interface AddStockForm {
  activationCodes: string;
  expirationDate: string;
  activationDate: string;
}

// Memoized Modal Component
const Modal = React.memo(function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-xl",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="absolute inset-0 backdrop-blur-sm bg-slate-900/60 dark:bg-black/70"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            className={twMerge(
              "relative z-10 w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl p-6 outline-none",
              width,
            )}
            role="document"
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              {title && (
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="ml-auto rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Memoized Floating Label Input
const FloatingLabel = React.memo(function FloatingLabel({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  as = "input",
  rows = 4,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
}) {
  const hasValue = value !== "" && value !== undefined && value !== null;
  const baseInputClass =
    "peer w-full rounded-xl border px-4 pt-6 pb-2 bg-transparent transition-all placeholder-transparent focus:outline-none focus:ring-0";
  const inputClasses = twMerge(
    baseInputClass,
    "border-slate-200 dark:border-slate-700",
    "focus:border-purple-400 dark:focus:border-purple-500",
    "focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)]",
  );

  return (
    <div className="relative w-full">
      {as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={rows}
          className={twMerge(inputClasses, "resize-none font-mono text-sm")}
          placeholder={placeholder ?? label}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder ?? label}
          required={required}
        />
      )}
      <label
        htmlFor={id}
        className={clsx(
          "absolute left-4 text-sm pointer-events-none transition-all",
          "peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600 dark:peer-focus:text-purple-400",
          hasValue
            ? "top-2 text-xs text-slate-600 dark:text-slate-400"
            : "top-4 text-slate-500 dark:text-slate-400",
        )}
      >
        {label}
      </label>
    </div>
  );
});

export default function Variants() {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [showAddStock, setShowAddStock] = useState(false);
  const [showEditVariant, setShowEditVariant] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");

  const [variantForm, setVariantForm] = useState({
    price: "",
    currency: "VND",
    value: "",
  });

  const [stockForm, setStockForm] = useState<AddStockForm>({
    activationCodes: "",
    expirationDate: "",
    activationDate: "",
  });

  // Memoized callbacks for closing modals
  const handleCloseAddVariant = useCallback(() => {
    setShowAddVariant(false);
    setVariantForm({ price: "", currency: "VND", value: "" });
  }, []);

  const handleCloseEditVariant = useCallback(() => {
    setShowEditVariant(false);
    setSelectedVariant(null);
    setVariantForm({ price: "", currency: "VND", value: "" });
  }, []);

  const handleCloseAddStock = useCallback(() => {
    setShowAddStock(false);
    setSelectedVariant(null);
    setStockForm({
      activationCodes: "",
      expirationDate: "",
      activationDate: "",
    });
  }, []);

  // Optimized form change handlers using useCallback
  const handleVariantValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setVariantForm((prev) => ({ ...prev, value: e.target.value }));
    },
    [],
  );

  const handleVariantPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setVariantForm((prev) => ({ ...prev, price: e.target.value }));
    },
    [],
  );

  const handleVariantCurrencyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setVariantForm((prev) => ({ ...prev, currency: e.target.value }));
    },
    [],
  );

  const handleStockCodesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setStockForm((prev) => ({ ...prev, activationCodes: e.target.value }));
    },
    [],
  );

  const handleStockExpirationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setStockForm((prev) => ({ ...prev, expirationDate: e.target.value }));
    },
    [],
  );

  const handleStockActivationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setStockForm((prev) => ({ ...prev, activationDate: e.target.value }));
    },
    [],
  );

  // Debounced search query handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  // Fetch all products
  const { data: products } = useQuery({
    queryKey: ["admin-products-all"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/products?page=0&size=100`,
      );
      return response.data.content as Product[];
    },
  });

  // Fetch variants for selected product
  const {
    data: variants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-variants", selectedProduct],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/products/${selectedProduct}/variants`,
      );
      return response.data as Variant[];
    },
    enabled: !!selectedProduct,
  });

  // Add variant mutation
  const addVariantMutation = useMutation({
    mutationFn: async (data: any) => {
      await axiosInstance.post(
        `/admin/products/${selectedProduct}/variants`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-variants"] });
      handleCloseAddVariant();
      toast.success("Variant added successfully!");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? error?.message ?? String(error);
      toast.error("Error: " + message);
    },
  });

  // Update variant mutation
  const updateVariantMutation = useMutation({
    mutationFn: async (data: any) => {
      await axiosInstance.put(
        `/admin/products/variants/${selectedVariant}`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-variants"] });
      handleCloseEditVariant();
      toast.success("Variant updated successfully!");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? error?.message ?? String(error);
      toast.error("Error: " + message);
    },
  });

  // Add stock mutation
  const addStockMutation = useMutation({
    mutationFn: async ({
      variantId,
      data,
    }: {
      variantId: number;
      data: any;
    }) => {
      await axiosInstance.post(
        `/admin/products/variants/${variantId}/stock`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-variants"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-status"] });
      handleCloseAddStock();
      toast.success("Stock added successfully!");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? error?.message ?? String(error);
      toast.error("Error: " + message);
    },
  });

  // Memoized filtered variants
  const filteredVariants = useMemo(() => {
    if (!variants) return [];
    if (!searchQuery.trim()) return variants;
    const query = searchQuery.toLowerCase();
    return variants.filter(
      (v) =>
        v.value.toString().includes(query) ||
        v.price.toString().includes(query) ||
        v.currency.toLowerCase().includes(query) ||
        v.id.toString().includes(query),
    );
  }, [variants, searchQuery]);

  // Memoized stats
  const stats = useMemo(() => {
    if (!variants?.length) return { total: 0, totalValue: 0, avgPrice: 0 };
    return {
      total: variants.length,
      totalValue: variants.reduce((sum, v) => sum + v.value, 0),
      avgPrice: variants.reduce((sum, v) => sum + v.price, 0) / variants.length,
    };
  }, [variants]);

  // Form submission handlers
  const handleAddVariant = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addVariantMutation.mutate({
        price: Number(variantForm.price),
        currency: variantForm.currency,
        value: Number(variantForm.value),
      });
    },
    [addVariantMutation, variantForm],
  );

  const handleUpdateVariant = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateVariantMutation.mutate({
        price: Number(variantForm.price),
        currency: variantForm.currency,
        value: Number(variantForm.value),
      });
    },
    [updateVariantMutation, variantForm],
  );

  const handleAddStock = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const codes = stockForm.activationCodes
        .split("\n")
        .filter((c) => c.trim());
      addStockMutation.mutate({
        variantId: selectedVariant!,
        data: {
          activationCodes: codes,
          expirationDate: formatDateToDDMMYYYY(stockForm.expirationDate),
          activationDate: formatDateToDDMMYYYY(stockForm.activationDate),
        },
      });
    },
    [addStockMutation, selectedVariant, stockForm],
  );

  const handleEditVariant = useCallback((variant: Variant) => {
    setSelectedVariant(variant.id);
    setVariantForm({
      price: variant.price.toString(),
      currency: variant.currency,
      value: variant.value.toString(),
    });
    setShowEditVariant(true);
  }, []);

  const handleOpenAddStock = useCallback((variantId: number) => {
    setSelectedVariant(variantId);
    setShowAddStock(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Variants Management
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage gift card variants (e.g. $5, $10, $15) and their stock.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Product Selector */}
              <div className="relative">
                <select
                  value={selectedProduct || ""}
                  onChange={(e) => setSelectedProduct(Number(e.target.value))}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
                >
                  <option value="">Select a product</option>
                  {products?.map((product) => (
                    <option key={product.productId} value={product.productId}>
                      {product.productName}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {/* Add Variant Button */}
              <motion.button
                whileHover={{ scale: selectedProduct ? 1.02 : 1 }}
                whileTap={{ scale: selectedProduct ? 0.98 : 1 }}
                onClick={() => setShowAddVariant(true)}
                disabled={!selectedProduct}
                className={clsx(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-all",
                  !selectedProduct
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/30",
                )}
                title="Add Variant"
              >
                <Plus className="h-4 w-4" />
                Add Variant
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          {selectedProduct && variants && variants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Total Variants
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Total Value
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      ${stats.totalValue}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Avg Price
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.avgPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Modals */}
        <Modal
          open={showAddVariant}
          onClose={handleCloseAddVariant}
          title="Add Variant"
          width="max-w-md"
        >
          <form onSubmit={handleAddVariant} className="space-y-4">
            <FloatingLabel
              id="modal-variant-value"
              label="Value *"
              type="number"
              value={variantForm.value}
              onChange={handleVariantValueChange}
              required
            />
            <FloatingLabel
              id="modal-variant-price"
              label="Price *"
              type="number"
              value={variantForm.price}
              onChange={handleVariantPriceChange}
              required
            />
            <FloatingLabel
              id="modal-variant-currency"
              label="Currency *"
              type="text"
              value={variantForm.currency}
              onChange={handleVariantCurrencyChange}
              required
            />
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleCloseAddVariant}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addVariantMutation.isPending}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 transition-all"
              >
                {addVariantMutation.isPending ? "Adding..." : "Add Variant"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          open={showEditVariant}
          onClose={handleCloseEditVariant}
          title="Edit Variant"
          width="max-w-md"
        >
          <form onSubmit={handleUpdateVariant} className="space-y-4">
            <FloatingLabel
              id="modal-edit-value"
              label="Value *"
              type="number"
              value={variantForm.value}
              onChange={handleVariantValueChange}
              required
            />
            <FloatingLabel
              id="modal-edit-price"
              label="Price *"
              type="number"
              value={variantForm.price}
              onChange={handleVariantPriceChange}
              required
            />
            <FloatingLabel
              id="modal-edit-currency"
              label="Currency *"
              type="text"
              value={variantForm.currency}
              onChange={handleVariantCurrencyChange}
              required
            />
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleCloseEditVariant}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateVariantMutation.isPending}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 transition-all"
              >
                {updateVariantMutation.isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          open={showAddStock}
          onClose={handleCloseAddStock}
          title={
            selectedVariant
              ? `Add Stock to Variant #${selectedVariant}`
              : "Add Stock"
          }
          width="max-w-xl"
        >
          {selectedVariant && (
            <form onSubmit={handleAddStock} className="space-y-4">
              <FloatingLabel
                id="modal-stock-codes"
                label="Activation Codes * (one per line)"
                as="textarea"
                value={stockForm.activationCodes}
                onChange={handleStockCodesChange}
                rows={6}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabel
                  id="modal-stock-exp"
                  label="Expiration Date *"
                  type="date"
                  value={stockForm.expirationDate}
                  onChange={handleStockExpirationChange}
                  required
                />
                <FloatingLabel
                  id="modal-stock-activation"
                  label="Activation Date *"
                  type="date"
                  value={stockForm.activationDate}
                  onChange={handleStockActivationChange}
                  required
                />
              </div>
              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleCloseAddStock}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addStockMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 transition-all"
                >
                  {addStockMutation.isPending ? "Adding..." : "Add Stock"}
                </button>
              </div>
            </form>
          )}
        </Modal>

        {/* Main Content */}
        {selectedProduct ? (
          <>
            {/* Search and View Toggle */}
            {variants && variants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search variants..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
                  />
                </div>
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <button
                    onClick={() => setViewMode("table")}
                    className={clsx(
                      "p-2 rounded-lg transition-all",
                      viewMode === "table"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
                    )}
                    title="Table view"
                  >
                    <List className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={clsx(
                      "p-2 rounded-lg transition-all",
                      viewMode === "grid"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
                    )}
                    title="Grid view"
                  >
                    <Grid3x3 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-5 py-4 rounded-xl"
              >
                Error:{" "}
                {error instanceof Error
                  ? error.message
                  : "Failed to load variants"}
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && !error && variants && variants.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No variants yet
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Get started by adding your first variant to this product.
                </p>
                <button
                  onClick={() => setShowAddVariant(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Add First Variant
                </button>
              </motion.div>
            )}

            {/* Table View */}
            {!isLoading &&
              !error &&
              variants &&
              variants.length > 0 &&
              viewMode === "table" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Value
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Currency
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        <AnimatePresence mode="popLayout">
                          {filteredVariants.map((variant, index) => (
                            <motion.tr
                              key={variant.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                            >
                              <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                                #{variant.id}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                                  ${variant.value}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                                {variant.price.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium">
                                  {variant.currency}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEditVariant(variant)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                    aria-label={`Edit variant ${variant.id}`}
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                    <span className="text-xs font-medium">
                                      Edit
                                    </span>
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      setSelectedVariant(variant.id);
                                      setShowAddStock(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                  >
                                    <Package className="h-3.5 w-3.5" />
                                    <span className="text-xs font-medium">
                                      Stock
                                    </span>
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

            {/* Grid View */}
            {!isLoading &&
              !error &&
              variants &&
              variants.length > 0 &&
              viewMode === "grid" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredVariants.map((variant, index) => (
                      <motion.div
                        key={variant.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-5 shadow-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Variant #{variant.id}
                              </p>
                              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                ${variant.value}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Price
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {variant.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Currency
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium">
                              {variant.currency}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditVariant(variant)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Edit</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedVariant(variant.id);
                              setShowAddStock(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                          >
                            <Package className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Stock</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

            {/* No Search Results */}
            {!isLoading &&
              !error &&
              variants &&
              variants.length > 0 &&
              filteredVariants.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center"
                >
                  <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No results found
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Try adjusting your search query
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Clear search
                  </button>
                </motion.div>
              )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
              <Layers className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Select a product
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Choose a product from the dropdown above to view and manage its
              variants.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
