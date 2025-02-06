import { Link } from "react-router-dom"
import { FaArrowRight, FaTruck, FaShieldAlt, FaCreditCard, FaHeadset } from "react-icons/fa"
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice"
import ProductCard from "../../components/Products/ProductCard"
import Loader from "../../components/Loader"
import { motion } from "framer-motion"
import BentoGrid from "../../components/BentoGrid/BentoGrid"

const LandingPage = () => {
  const { data: products, isLoading } = useGetTopProductsQuery()

  const features = [
    {
      icon: <FaTruck className="w-6 h-6" />,
      title: "Free Shipping",
      description: "Free shipping on orders over $100",
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Secure Payment",
      description: "100% secure payment",
    },
    {
      icon: <FaCreditCard className="w-6 h-6" />,
      title: "Easy Returns",
      description: "30 days return policy",
    },
    {
      icon: <FaHeadset className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Dedicated support team",
    },
  ]

  const categories = [
    {
      name: "Electronics",
      image: "/images/categories/electronics.jpg",
      count: "1.2k+ Products",
    },
    {
      name: "Fashion",
      image: "/images/categories/fashion.jpg",
      count: "2k+ Products",
    },
    {
      name: "Home & Living",
      image: "/images/categories/home.jpg",
      count: "1k+ Products",
    },
    {
      name: "Sports",
      image: "/images/categories/sports.jpg",
      count: "500+ Products",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center">
        <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl text-white">
            <h1 className="text-6xl font-bold mb-6">
              Discover Amazing Products for
              <span className="text-blue-400 block mt-2">Your Lifestyle</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Shop the latest trends with our curated collection of premium products.
            </p>
            <div className="flex gap-4">
              <Link
                to="/shop"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
              >
                Shop Now
              </Link>
              <Link
                to="/categories"
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Browse Categories
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <BentoGrid />

      {/* Features Section with 3D Cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience shopping like never before with our premium features and services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  z: 50,
                }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300"
              >
                <div className="text-blue-600 mb-4 text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-1">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/shop" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products?.slice(0, 8).map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section with Gradient */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-8">Subscribe to our newsletter for exclusive deals and updates</p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

