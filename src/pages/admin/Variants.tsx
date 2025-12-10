// src/pages/admin/Variants.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";
import { formatDateToDDMMYYYY } from "@/utils/formatters";

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

export default function Variants() {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [showAddStock, setShowAddStock] = useState(false);
  const [showEditVariant, setShowEditVariant] = useState(false);

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

  // Add variant to product
  const addVariantMutation = useMutation({
    mutationFn: async (data: any) => {
      await axiosInstance.post(
        `/admin/products/${selectedProduct}/variants`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-variants"] });
      setShowAddVariant(false);
      resetVariantForm();
      alert("Variant added successfully!");
    },
    onError: (error: any) => {
      alert("Error: " + error);
    },
  });

  // Update variant
  const updateVariantMutation = useMutation({
    mutationFn: async (data: any) => {
      await axiosInstance.put(
        `/admin/products/variants/${selectedVariant}`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-variants"] });
      setShowEditVariant(false);
      setSelectedVariant(null);
      resetVariantForm();
      alert("Variant updated successfully!");
    },
    onError: (error: any) => {
      alert("Error: " + error);
    },
  });

  // Add stock to variant
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
      setShowAddStock(false);
      setSelectedVariant(null);
      resetStockForm();
      alert("Stock added successfully!");
    },
    onError: (error: any) => {
      alert("Error: " + error);
    },
  });

  const resetVariantForm = () => {
    setVariantForm({ price: "", currency: "VND", value: "" });
  };

  const resetStockForm = () => {
    setStockForm({
      activationCodes: "",
      expirationDate: "",
      activationDate: "",
    });
  };

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault();
    addVariantMutation.mutate({
      price: Number(variantForm.price),
      currency: variantForm.currency,
      value: Number(variantForm.value),
    });
  };

  const handleUpdateVariant = (e: React.FormEvent) => {
    e.preventDefault();
    updateVariantMutation.mutate({
      price: Number(variantForm.price),
      currency: variantForm.currency,
      value: Number(variantForm.value),
    });
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const codes = stockForm.activationCodes.split("\n").filter((c) => c.trim());
    addStockMutation.mutate({
      variantId: selectedVariant!,
      data: {
        activationCodes: codes,
        expirationDate: formatDateToDDMMYYYY(stockForm.expirationDate),
        activationDate: formatDateToDDMMYYYY(stockForm.activationDate),
      },
    });
  };

  const handleEditVariant = (variant: Variant) => {
    setSelectedVariant(variant.id);
    setVariantForm({
      price: variant.price.toString(),
      currency: variant.currency,
      value: variant.value.toString(),
    });
    setShowEditVariant(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Variants Management</h1>

      {/* Product Selector */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium mb-2">Select Product</label>
        <select
          value={selectedProduct || ""}
          onChange={(e) => setSelectedProduct(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Select a product --</option>
          {products?.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName} (ID: {product.productId})
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <>
          {/* Add Variant Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowAddVariant(!showAddVariant)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showAddVariant ? "Cancel" : "+ Add Variant"}
            </button>
          </div>

          {/* Add Variant Form */}
          {showAddVariant && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">Add Variant</h2>
              <form onSubmit={handleAddVariant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    value={variantForm.value}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, value: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    value={variantForm.price}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, price: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Currency *
                  </label>
                  <input
                    type="text"
                    value={variantForm.currency}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        currency: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={addVariantMutation.isPending}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {addVariantMutation.isPending ? "Adding..." : "Add Variant"}
                </button>
              </form>
            </div>
          )}

          {/* Edit Variant Form */}
          {showEditVariant && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">Edit Variant</h2>
              <form onSubmit={handleUpdateVariant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    value={variantForm.value}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, value: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    value={variantForm.price}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, price: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Currency *
                  </label>
                  <input
                    type="text"
                    value={variantForm.currency}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        currency: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updateVariantMutation.isPending}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {updateVariantMutation.isPending
                      ? "Updating..."
                      : "Update Variant"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditVariant(false);
                      setSelectedVariant(null);
                      resetVariantForm();
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Stock Form */}
          {showAddStock && selectedVariant && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">
                Add Stock to Variant #{selectedVariant}
              </h2>
              <form onSubmit={handleAddStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Activation Codes * (one per line)
                  </label>
                  <textarea
                    value={stockForm.activationCodes}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        activationCodes: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2 font-mono"
                    rows={6}
                    placeholder="CODE1&#10;CODE2&#10;CODE3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expiration Date *
                  </label>
                  <input
                    type="date"
                    value={stockForm.expirationDate}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        expirationDate: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Activation Date *
                  </label>
                  <input
                    type="date"
                    value={stockForm.activationDate}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        activationDate: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={addStockMutation.isPending}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {addStockMutation.isPending
                      ? "Adding Stock..."
                      : "Add Stock"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddStock(false);
                      setSelectedVariant(null);
                      resetStockForm();
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-8">Loading variants...</div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
              Error:{" "}
              {error instanceof Error
                ? error.message
                : "Failed to load variants"}
            </div>
          )}

          {/* Variants Table */}
          {variants && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Variant ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {variants.map((variant) => (
                    <tr key={variant.id}>
                      <td className="px-6 py-4 text-sm">{variant.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {variant.value}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {variant.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">{variant.currency}</td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleEditVariant(variant)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVariant(variant.id);
                            setShowAddStock(true);
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          Add Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
