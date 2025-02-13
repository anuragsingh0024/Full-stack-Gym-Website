import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productData, setProductData] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    image: null,
    url: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmiting, setIsSubminting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products from backend API

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/all-products", {
        withCredentials: true,
      }); // Replace with your backend API URL
      setProducts(response.data.allProducts);
      setIsLoading(false);
    } catch (error) {
      //.error("Error fetching products:", error);
      setIsLoading(false);
    }
  };

  // Open modal for Add/Edit Product
  const openModal = (
    product = { _id: null, name: "", price: "", description: "", image: null }
  ) => {
    setProductData(product);
    setPreviewImage(product.image ? product.image : null);
    setModalOpen(true);
  };

  // Handle file upload preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProductData({ ...productData, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  // Save product (Add or Update)
  const handleSave = async () => {
    if (
      productData.name === "" ||
      productData.price === "" ||
      productData.description === "" ||
      productData.image === null ||
      productData.url === null
    ) {
      toast.error("All fields are required");
      toast.dismiss(loadingToast);
      setIsSubminting(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    formData.append("url", productData.url);
    if (productData.image instanceof File) {
      formData.append("image", productData.image);
    }

    try {
      setIsSubminting(true);
      if (productData._id) {
        let loadingToast = toast.loading("Updating...");
        const response = await axiosInstance.put(
          `/admin/edit-product/${productData._id}`,
          formData
        );
        setIsSubminting(false);
        if (response.data.success) {
          toast.dismiss(loadingToast);
          toast.success(response.data.message);
          setIsSubminting(false);
        } else {
          toast.dismiss(loadingToast);
          toast.error(response.data.message);
          setIsSubminting(false);
        }
      } else {
        var loadingToast = toast.loading("Adding...");
        const response = await axiosInstance.post(
          "/admin/add-product",
          formData
        );
        setIsSubminting(false);
        //.log(response);
        if (response.data.success) {
          toast.dismiss(loadingToast);
          toast.success(response.data.message);
          setIsSubminting(false);
        } else {
          toast.dismiss(loadingToast);
          toast.error(response.data.message);
          setIsSubminting(false);
        }
      }
      fetchProducts();
      setModalOpen(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.response?.data?.message || "Something went wrong");
      //.error("Error saving product:", error);
      setIsSubminting(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      var toastLoading2 = toast.loading("Deleting...");
      await axiosInstance.delete(`/admin/delete-product/${id}`, {
        withCredentials: true,
      });
      toast.dismiss(toastLoading2);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      //.error("Error deleting product:", error);
      toast.dismiss(toastLoading2);
    }
  };
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-pe-greys-900 text-white">
      <div className="max-w-5xl mx-auto bg-pe-greys-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-caribbeangreen-400 mb-4">
          Manage Products
        </h2>

        {/* Add Product Button */}
        <button
          className="bg-caribbeangreen-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-caribbeangreen-600"
          onClick={() => openModal()}
        >
          Add Product
        </button>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-pure-greys-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-pure-greys-600 text-white">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-pure-greys-600">
                  <td className="p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">₹{product.price}</td>
                  <td className="p-3">{product.description}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                      onClick={() => openModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-brown-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Product */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-pure-greys-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {productData.id ? "Edit Product" : "Add Product"}
            </h2>

            {/* Image Preview */}
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            {/* Product Name */}
            <input
              required
              type="text"
              className="w-full p-2 mb-3 rounded bg-pure-greys-700 text-white"
              placeholder="Product Name"
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
            />

            {/* Product Price */}
            <input
              required
              type="number"
              className="w-full p-2 mb-3 rounded bg-pure-greys-700 text-white"
              placeholder="Price (₹)"
              value={productData.price}
              onChange={(e) =>
                setProductData({ ...productData, price: e.target.value })
              }
            />

            {/* Product Description */}
            <textarea
              required
              className="w-full p-2 mb-3 rounded bg-pure-greys-700 text-white"
              placeholder="Product Description"
              value={productData.description}
              onChange={(e) =>
                setProductData({ ...productData, description: e.target.value })
              }
            />
            <input
              required
              className="w-full p-2 mb-3 rounded bg-pure-greys-700 text-white"
              placeholder="Product Url"
              value={productData.url}
              onChange={(e) =>
                setProductData({ ...productData, url: e.target.value })
              }
            />

            {/* File Upload */}
            <input
              required
              type="file"
              className="w-full p-2 mb-3 bg-pure-greys-700 text-white"
              onChange={handleFileChange}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="bg-pure-greys-500 px-4 py-2 rounded-lg"
                onClick={() => {
                  setModalOpen(false);
                  toast.dismiss(loadingToast);
                }}
              >
                Cancel
              </button>
              <button
                disabled={isSubmiting}
                className="bg-caribbeangreen-500 px-4 py-2 rounded-lg hover:bg-caribbeangreen-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;
