import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/common/Input/Input';
import { Button } from '@/components/common/Button/Button';
import { useUpdateProduct } from '@/queries/useAdmin';
import type { Product, UpdateProductRequest } from '@/types';

interface ProductEditFormProps {
  product: Product;
  onSuccess: () => void;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
  product,
  onSuccess,
}) => {
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateProductRequest>({
    defaultValues: {
      productName: product.productName,
      productDescription: product.productDescription,
      pictureURL: product.pictureURL,
      branchId: product.branch.id,
      variants: product.productVariantResponses.map((v) => ({
        value: v.value,
        price: v.price,
        currency: v.currency,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const onSubmit = (data: UpdateProductRequest) => {
    updateProduct(
      { id: product.productId, data },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Product Name"
        placeholder="Enter product name"
        register={register('productName', {
          required: 'Product name is required',
        })}
        error={errors.productName}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('productDescription', {
            required: 'Description is required',
          })}
          rows={4}
          placeholder="Enter product description"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.productDescription ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.productDescription && (
          <p className="mt-1 text-sm text-red-500">
            {errors.productDescription.message}
          </p>
        )}
      </div>

      <Input
        label="Image URL"
        placeholder="https://example.com/image.jpg"
        register={register('pictureURL', {
          required: 'Image URL is required',
        })}
        error={errors.pictureURL}
        required
      />

      {/* Variants */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Variants <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start">
              <input
                type="number"
                {...register(`variants.${index}.value` as const, {
                  required: 'Value is required',
                  min: { value: 1, message: 'Minimum 1' },
                })}
                placeholder="Value (e.g., 5)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                {...register(`variants.${index}.price` as const, {
                  required: 'Price is required',
                  min: { value: 1, message: 'Minimum 1' },
                })}
                placeholder="Price"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                {...register(`variants.${index}.currency` as const, {
                  required: 'Currency is required',
                })}
                placeholder="USD"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                disabled={fields.length === 1}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => append({ value: 0, price: 0, currency: 'USD' })}
          className="mt-2"
        >
          Add Variant
        </Button>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="submit" isLoading={isPending}>
          Update Product
        </Button>
      </div>
    </form>
  );
};