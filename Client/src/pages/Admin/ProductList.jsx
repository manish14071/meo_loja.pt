import { useState } from "react"
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "../../redux/api/productApiSlice"
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice"
import { toast } from "react-toastify"
import Loader from "../../components/Loader"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import Modal from "../../components/ui/Modal"
import ProductCard from "../Products/ProductCard"
import ImageUpload from "../../components/Products/ImageUpload"


const ProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock_count: "",
    image: "",
    brand:"",
  })

  const { data, isLoading, error, refetch } = useGetProductsQuery({})
  const { data: categories } = useGetCategoriesQuery()
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const [uploadProductImage] = useUploadProductImageMutation()

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['name', 'price', 'category_id'];
    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', productData.name.trim());
      formData.append('description', productData.description.trim());
      formData.append('price', Number(productData.price));
      formData.append('category_id', Number(productData.category_id));
      formData.append('stock_count', Number(productData.stock_count) || 0);
      formData.append('image', productData.image); // This should be a file object
      formData.append('brand', productData.brand.trim());

      if (isEditMode) {
        await updateProduct({
          productId: selectedProduct.id,
          data: formData,
        }).unwrap();
        toast.success("Product updated successfully");
      } else {
        const result = await createProduct(formData).unwrap();
        console.log('Created product:', result); // Check if the image URL is included in the response
        toast.success("Product created successfully");
      }
      
      setIsModalOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Product save error:', error);
      toast.error(error?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      category_id: product.category_id,
      stock_count: product.countInStock,
      image: product.image,
      brand:product.brand,
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap()
        toast.success("Product deleted")
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  const resetForm = () => {
    setProductData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      stock_count: "",
      image: "",
      brand:"",
    })
    setIsEditMode(false)
    setSelectedProduct(null)
  }

  const handleCreate = () => {
    setIsEditMode(false)
    setIsModalOpen(true)
    resetForm()
  }
  const handleImageUpload = (imageUrl) => {
    setProductData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };
  if (isLoading) return <Loader />
  if (error) return <div className="text-center text-red-600">Error: {error?.data?.message || error.error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Products</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <FaPlus className="mr-2" /> Create Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
          >
            <ProductCard product={product} />
            <div className="p-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="text-blue-500 hover:text-blue-700 transition duration-300"
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-500 hover:text-red-700 transition duration-300"
              >
                <FaTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          resetForm()
        }}
        title={isEditMode ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">

        <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={productData.description}
              onChange={(e) =>
                setProductData({ ...productData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={productData.price}
                onChange={(e) =>
                  setProductData({ ...productData, price: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min={0}
                step={0.01}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                value={productData.stock_count}
                onChange={(e) =>
                  setProductData({ ...productData, stock_count: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black-700">
              Category
            </label>
            <select
              value={productData.category_id}
              onChange={(e) =>
                setProductData({ ...productData, category_id: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <input
              type="text"
              value={productData.brand}
              onChange={(e) =>
                setProductData({ ...productData, brand: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <ImageUpload onImageUpload={handleImageUpload} currentImage={productData.image} />
          


        <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                resetForm()
              }}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              {isEditMode ? "Update" : "Create"}
            </button>
          </div>


        </form>
</Modal>
</div>
      )
}

export default ProductList