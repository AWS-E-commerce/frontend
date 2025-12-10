// src/pages/admin/Products.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";

interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  pictureURL: string;
  branch: {
    id: number;
    name: string;
  };
  productVariantResponses: any[];
}

interface PageResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Products() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pictureUrl: "",
    branchName: "",
    discountCode: "",
  });

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-products", page, size],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/products?page=${page}&size=${size}`,
      );
      return response.data as PageResponse;
    },
  });

  // Create product
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post(`/admin/products`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowForm(false);
      resetForm();
      alert("Product created successfully!");
    },
    onError: (error: any) => {
      alert("Error: " + (error.response?.data?.message || error.message));
    },
  });

  // Update product
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await axiosInstance.put(`/admin/products/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      alert("Product updated successfully!");
    },
    onError: (error: any) => {
      alert("Error: " + (error.response?.data?.message || error.message));
    },
  });

  // Delete product
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      alert("Product deleted successfully!");
    },
    onError: (error: any) => {
      alert("Error: " + (error.response?.data?.message || error.message));
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pictureUrl: "",
      branchName: "",
      discountCode: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.productId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.productName,
      description: product.productDescription,
      pictureUrl: product.pictureURL,
      branchName: product.branch.name,
      discountCode: "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? "Edit Product" : "Create Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Picture URL *
              </label>
              <input
                type="text"
                value={formData.pictureUrl}
                onChange={(e) =>
                  setFormData({ ...formData, pictureUrl: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={(e) =>
                  setFormData({ ...formData, branchName: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Code
              </label>
              <input
                type="text"
                value={formData.discountCode}
                onChange={(e) =>
                  setFormData({ ...formData, discountCode: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : "Save"}
            </button>
          </form>
        </div>
      )}

      {/* Loading */}
      {isLoading && <div className="text-center py-8">Loading products...</div>}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load products"}
        </div>
      )}

      {/* Products Table */}
      {data && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Variants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.content.map((product) => (
                  <tr key={product.productId}>
                    <td className="px-6 py-4 text-sm">{product.productId}</td>
                    <td className="px-6 py-4">
                      <img
                        src={product.pictureURL}
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {product.productName}
                    </td>
                    <td className="px-6 py-4 text-sm">{product.branch.name}</td>
                    <td className="px-6 py-4 text-sm">
                      {product.productDescription.substring(0, 50)}...
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {product.productVariantResponses.length} variants
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.productId)}
                        className="text-red-600 hover:text-red-800"
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {data.content.length} of {data.totalElements} products
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page + 1} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages - 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
