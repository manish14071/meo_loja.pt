import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import { useState, useEffect } from "react";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import Button from "./ui/Button";

const Header = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (products) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [products]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl text-red-600">Failed to load products</h2>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero Content */}
          <div className="space-y-8">
            <h1 className="text-6xl font-bold text-gray-900 leading-tight">
              Discover Our
              <span className="text-blue-600 block mt-2">Featured Products</span>
            </h1>
            
            <p className="text-gray-600 text-xl leading-relaxed">
              Explore our curated collection of premium products with 
              <span className="text-blue-600 font-semibold"> exclusive deals</span> 
              and special discounts.
            </p>

            <div className="flex gap-4">
              <Button size="lg">
                Shop Now <FaArrowRight className="ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                View Categories
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { label: 'Products', value: '1000+' },
                { label: 'Customers', value: '50k+' },
                { label: 'Reviews', value: '4.9★' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Product Display */}
          <div className="relative">
            <div className="lg:block hidden">
              <div className="grid grid-cols-2 gap-6">
                {products?.slice(0, 4).map((product) => (
                  <div 
                    key={product._id}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
                  >
                    <SmallProduct product={product} />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden block">
              <ProductCarousel />
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', icon: '🔌' },
              { name: 'Fashion', icon: '👕' },
              { name: 'Home & Living', icon: '🏠' },
              { name: 'Sports', icon: '⚽' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-300 text-center group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;