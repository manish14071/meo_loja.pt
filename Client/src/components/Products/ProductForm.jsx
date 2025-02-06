import { useState } from 'react';
import { useCreateProductMutation, useUpdateProductMutation } from '../../redux/api/productApiSlice';
import { toast } from 'react-toastify';
import CategorySelect from '../Categories/CategorySelect';
import ImageUpload from './ImageUpload';

const ProductForm = ({ product, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    description: product?.description || '',
    image: product?.image || '',
    brand: product?.brand || '',
    category_id: product?.category_id || '',
    count_in_stock: product?.count_in_stock || '',
  });

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error('Please upload a product image');
      return;
    }


    const requiredFields = ['name', 'price', 'category_id', 'brand', 'count_in_stock', 'description'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        count_in_stock: Number(formData.count_in_stock),
        category_id: Number(formData.category_id)
      };

      if (product) {
        await updateProduct({
          productId: product.id,
          data: productData,
        }).unwrap();
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData).unwrap();
        toast.success('Product created successfully');
      }
      onSuccess?.();
    } catch (err) {
      console.error('Product submission error:', err);
      toast.error(err?.data?.message || 'Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };


  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Product Image</label>
        <ImageUpload 
          onImageUpload={handleImageUpload}
          currentImage={formData.image}
        />
        {formData.image && (
          <div className="mt-2">
            <img 
              src={formData.image} 
              alt="Product preview" 
              className="h-32 w-32 object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <CategorySelect
          value={formData.category_id}
          onChange={(e) => handleChange({ target: { name: 'category_id', value: e.target.value } })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          name="count_in_stock"
          value={formData.count_in_stock}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {product ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductForm; 