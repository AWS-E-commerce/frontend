import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

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

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

export default function Products() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    branchName: "",
    discountCode: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Theme detection
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  // Toast notification system
  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

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
      const response = await axiosInstance.post("/admin/products", data);
      return response.data;
    },
    onSuccess: async (data) => {
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("file", imageFile);
          await axiosInstance.post(
            `/admin/products/${data.productId}/image`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );
        } catch (error) {
          console.error("Image upload error:", error);
          showToast("Product created but image upload failed", "error");
          queryClient.invalidateQueries({ queryKey: ["admin-products"] });
          closeModal();
          return;
        }
      }
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      closeModal();
      showToast("Product created successfully!", "success");
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || error.message, "error");
    },
  });

  // Update product
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await axiosInstance.put(`/admin/products/${id}`, data);
      return response.data;
    },
    onSuccess: async (_, variables) => {
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("file", imageFile);
          await axiosInstance.post(
            `/admin/products/${variables.id}/image`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );
        } catch (error) {
          console.error("Image upload error:", error);
          showToast("Product updated but image upload failed", "error");
          queryClient.invalidateQueries({ queryKey: ["admin-products"] });
          closeModal();
          return;
        }
      }
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      closeModal();
      showToast("Product updated successfully!", "success");
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || error.message, "error");
    },
  });

  // Delete product
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowDeleteModal(false);
      setDeleteProductId(null);
      showToast("Product deleted successfully!", "success");
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || error.message, "error");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      branchName: "",
      discountCode: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      description: formData.description,
      pictureUrl: "",
      branchName: formData.branchName,
      discountCode: formData.discountCode,
    };
    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.productId,
        data: productData,
      });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.productName,
      description: product.productDescription,
      branchName: product.branch.name,
      discountCode: "",
    });
    setImagePreview(product.pictureURL);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteProductId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteProductId) {
      deleteMutation.mutate(deleteProductId);
    }
  };

  // Filter products based on search
  const filteredProducts =
    data?.content.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.branch.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 animate-[slideDown_0.5s_ease-out]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Products Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your product catalog
              </p>
            </div>
            <button
              onClick={() => {
                setShowModal(true);
                setEditingProduct(null);
                resetForm();
              }}
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add Product
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name, description, or branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg mb-6 flex items-center gap-3 animate-[slideDown_0.3s_ease-out]">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>
              Error:{" "}
              {error instanceof Error
                ? error.message
                : "Failed to load products"}
            </span>
          </div>
        )}

        {/* Products Table */}
        {data && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Variants
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProducts.map((product, index) => (
                      <tr
                        key={product.productId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 animate-[slideUp_0.3s_ease-out]"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                          #{product.productId}
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group">
                            <img
                              src={product.pictureURL}
                              alt={product.productName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {product.productName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {product.branch.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                          <div
                            className="truncate"
                            title={product.productDescription}
                          >
                            {product.productDescription.substring(0, 50)}...
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            {product.productVariantResponses.length} variants
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="group p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(product.productId)
                              }
                              className="group p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                              disabled={deleteMutation.isPending}
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {searchQuery
                      ? "No products found matching your search"
                      : "No products yet"}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredProducts.length} of {data.totalElements}{" "}
                  products
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:scale-105 disabled:hover:scale-100"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Page {page + 1} of {data.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= data.totalPages - 1}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:scale-105 disabled:hover:scale-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-[scaleIn_0.3s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
            >
              <div className="space-y-5">
                {/* Name */}
                <div className="animate-[slideRight_0.3s_ease-out]">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                    required
                    placeholder="Enter product name"
                  />
                </div>

                {/* Description */}
                <div className="animate-[slideRight_0.3s_ease-out] delay-75">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200 resize-none"
                    rows={4}
                    required
                    placeholder="Enter product description"
                  />
                </div>

                {/* Image Upload */}
                <div className="animate-[slideRight_0.3s_ease-out] delay-150">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Product Image
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 group animate-[scaleIn_0.3s_ease-out]">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Branch Name */}
                <div className="animate-[slideRight_0.3s_ease-out] delay-200">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) =>
                      setFormData({ ...formData, branchName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                    required
                    placeholder="Enter branch name"
                  />
                </div>

                {/* Discount Code */}
                <div className="animate-[slideRight_0.3s_ease-out] delay-300">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Discount Code
                  </label>
                  <input
                    type="text"
                    value={formData.discountCode}
                    onChange={(e) =>
                      setFormData({ ...formData, discountCode: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                    placeholder="Enter discount code (optional)"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium hover:scale-105 disabled:hover:scale-100"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {editingProduct ? "Update Product" : "Create Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[scaleIn_0.3s_ease-out]">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Delete Product
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium hover:scale-105 disabled:hover:scale-100"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm animate-[slideLeft_0.3s_ease-out] ${
              toast.type === "success"
                ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <span
              className={`text-sm font-medium ${
                toast.type === "success"
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {toast.message}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
