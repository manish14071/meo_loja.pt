import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import ProductCard from "../components/Products/ProductCard";

const Home = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error?.data?.message || "An error occurred"}</div>;
  }

  return (
    <>
      {/* Hero Section */}
      <div className="bg-[#1F2937] text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Welcome to Meo-Loja
            </h1>
            <p className="text-lg mb-6">
              Discover our amazing collection of products
            </p>
            <Link
              to="/shop"
              className="bg-pink-600 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;