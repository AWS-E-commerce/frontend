// src/components/features/admin/AddStockModal.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { useAddStock } from "@/queries/useAdmin";

interface AddStockModalProps {
  onClose: () => void;
}

interface StockFormData {
  variantId: number;
  expirationDate: string;
  activationDate: string;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({ onClose }) => {
  const [activationCodes, setActivationCodes] = useState<string[]>([""]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StockFormData>();

  const addStockMutation = useAddStock();

  const addCodeField = () => {
    setActivationCodes([...activationCodes, ""]);
  };

  const removeCodeField = (index: number) => {
    setActivationCodes(activationCodes.filter((_, i) => i !== index));
  };

  const updateCode = (index: number, value: string) => {
    const newCodes = [...activationCodes];
    newCodes[index] = value;
    setActivationCodes(newCodes);
  };

  const onSubmit = async (data: StockFormData) => {
    const filteredCodes = activationCodes.filter((code) => code.trim() !== "");

    if (filteredCodes.length === 0) {
      return;
    }

    try {
      await addStockMutation.mutateAsync({
        variantId: data.variantId,
        activationCodes: filteredCodes,
        expirationDate: data.expirationDate,
        activationDate: data.activationDate,
      });
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Add Stock to Variant
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input
            label="Variant ID"
            type="number"
            {...register("variantId", {
              required: "Variant ID is required",
              min: { value: 1, message: "Variant ID must be positive" },
            })}
            error={errors.variantId?.message}
            placeholder="Enter variant ID"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Activation Date"
              type="date"
              {...register("activationDate", {
                required: "Activation date is required",
              })}
              error={errors.activationDate?.message}
            />

            <Input
              label="Expiration Date"
              type="date"
              {...register("expirationDate", {
                required: "Expiration date is required",
              })}
              error={errors.expirationDate?.message}
            />
          </div>

          {/* Activation Codes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Activation Codes
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={addCodeField}
                className="flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Code
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activationCodes.map((code, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => updateCode(index, e.target.value)}
                    placeholder={`Activation code ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {activationCodes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCodeField(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {activationCodes.filter((c) => c.trim() !== "").length === 0 && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                At least one activation code is required
              </p>
            )}
          </div>

          {/* Bulk Input Option */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
              <strong>Tip:</strong> You can paste multiple codes at once
            </p>
            <textarea
              placeholder="Paste codes here (one per line)"
              rows={4}
              onChange={(e) => {
                const codes = e.target.value
                  .split("\n")
                  .map((c) => c.trim())
                  .filter((c) => c !== "");
                if (codes.length > 0) {
                  setActivationCodes(codes);
                }
              }}
              className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total codes: {activationCodes.filter((c) => c.trim() !== "").length}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={addStockMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={
                addStockMutation.isPending ||
                activationCodes.filter((c) => c.trim() !== "").length === 0
              }
            >
              {addStockMutation.isPending ? "Adding..." : "Add Stock"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
