import React from "react";
import { useAppContext } from "../../Context/AppContext";
import { toast } from "react-hot-toast";
import {
  FiEdit,
  FiTrash2,
  FiPackage,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";

const ProductList = () => {
  const { products, axios, currency, fetchProducts, isSeller, deleteProduct } =
    useAppContext();

  const toggleStock = async (Id, inStock) => {
    const loadingToast = toast.loading("Updating stock status...");

    try {
      const { data } = await axios.post(
        "/api/product/stock",
        { Id, inStock },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
          },
        }
      );

      if (data.success) {
        await fetchProducts(); // Auto-refresh after successful update
        toast.success(`Stock status updated!`, { id: loadingToast });
      }
    } catch (error) {
      console.error("Stock update error:", error);
      toast.dismiss(loadingToast); // Silently dismiss without error message
    }
  };

  const handleDelete = async (id) => {
 
    try {
      await deleteProduct(id);
      await fetchProducts(); // Auto-refresh after successful deletion
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleUpdate = (id) => {
    console.log("Update product with id:", id);
    // Navigation to update page would go here
  };

  if (!isSeller) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Seller Access Required
          </h3>
          <p className="text-gray-600">
            Please log in as a seller to manage products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Product Inventory
          </h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-4">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden border border-gray-200">
                            <img
                              className="h-full w-full object-cover"
                              src={
                                product.image?.[0] || "/placeholder-product.png"
                              }
                              alt={product.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-product.png";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 md:hidden">
                              {product.category}
                            </div>
                            <div className="text-sm text-gray-500 md:hidden">
                              {currency}
                              {product.offerPrice || product.price}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {product.category}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {currency}
                          {product.offerPrice || product.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              toggleStock(product._id, !product.inStock)
                            }
                            className="flex items-center focus:outline-none"
                          >
                            {product.inStock ? (
                              <FiToggleRight className="h-6 w-6 text-green-500" />
                            ) : (
                              <FiToggleLeft className="h-6 w-6 text-gray-400" />
                            )}
                          </button>
                          <span
                            className={`ml-2 text-sm font-medium ${
                              product.inStock
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleUpdate(product._id)}
                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
                            title="Edit"
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium">
                          No products found
                        </h3>
                        <p className="mt-1 text-sm">
                          Add your first product to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;