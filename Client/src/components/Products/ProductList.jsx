import { useGetProductsQuery } from '../../redux/api/productApiSlice';
import ProductCard from './ProductCard';
import Loader from '../Loader';
import { motion } from 'framer-motion';

const ProductList = () => {
  const { data: products, isLoading, error } = useGetProductsQuery({});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error: {error?.data?.message || error.error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 