// src/components/features/admin/ProductFormModal.tsx

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/common/Modal/Modal";
import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { useCreateProduct, useUpdateProduct } from "@/queries/";
import type { ProductDetail, ProductFormData } from "@/types/product.types";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  product?: ProductDetail;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  product,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      pictureUrl: "",
      branchName: "",
      discountCode: "",
    },
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  useEffect(() => {
    if (product && mode === "edit") {
      reset({
        name: product.name,
        description: product.description,
        pictureUrl: product.pictureUrl,
        branchName: product.branch.name,
        discountCode: "",
      });
    } else {
      reset({
        name: "",
        description: "",
        pictureUrl: "",
        branchName: "",
        discountCode: "",
      });
    }
  }, [product, mode, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
      } else if (product) {
        await updateMutation.mutateAsync({
          productId: product.productId,
          data,
        });
      }
      onClose();
      reset();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "create" ? "Create ProductDetail" : "Edit ProductDetail"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* ProductDetail Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ProductDetail Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("name", {
              required: "ProductDetail name is required",
            })}
            placeholder="e.g., Steam Gift Card"
            // error={errors.name?.message}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows={4}
            placeholder="Enter product description..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Picture URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Picture URL <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("pictureUrl", { required: "Picture URL is required" })}
            placeholder="https://example.com/image.jpg"
            // error={errors.pictureUrl?.message}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            You can upload an image later using the image upload button
          </p>
        </div>

        {/* Branch Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brand/Branch Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("branchName", {
              required: "Brand name is required",
            })}
            placeholder="e.g., Steam, PlayStation, Xbox"
            // error={errors.branchName?.message}
          />
        </div>

        {/* Discount Code (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discount Code (Optional)
          </label>
          <Input
            {...register("discountCode")}
            placeholder="Enter discount code if applicable"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
                ? "Create ProductDetail"
                : "Update ProductDetail"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
