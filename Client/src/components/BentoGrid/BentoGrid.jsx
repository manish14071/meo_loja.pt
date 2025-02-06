import { motion } from "framer-motion";
import { FaShoppingBag, FaRegCreditCard, FaTruck, FaHeadset, FaGift, FaPercent } from "react-icons/fa";
import { cn } from "../../utils";

const BentoGrid = () => {
  return (
    <section className="py-24 bg-gray-50 relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {/* Main Feature Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
              "row-span-2 rounded-3xl overflow-hidden relative group bg-white p-8 border border-gray-200",
              "hover:border-blue-500 transition-all duration-300"
            )}
          >
            <div className="relative z-10">
              <div className="mb-4">
                <FaShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Premium Shopping Experience</h3>
              <p className="text-gray-600">
                Enjoy a curated selection of high-quality products with our premium shopping experience.
                Get access to exclusive deals and personalized recommendations.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Feature Cards */}
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-white p-6 border border-gray-200 hover:border-blue-500 transition-all duration-300"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}

          {/* Stats Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 rounded-3xl bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white"
          >
            <h3 className="text-xl font-semibold mb-4">Our Success in Numbers</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    title: "Secure Payments",
    description: "Multiple secure payment options for safe transactions",
    icon: <FaRegCreditCard className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Fast Delivery",
    description: "Quick and reliable shipping to your doorstep",
    icon: <FaTruck className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer service assistance",
    icon: <FaHeadset className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Reward Points",
    description: "Earn points with every purchase and get rewards",
    icon: <FaGift className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Special Offers",
    description: "Regular discounts and promotional offers",
    icon: <FaPercent className="w-6 h-6 text-blue-600" />,
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products Available" },
  { value: "24/7", label: "Customer Support" },
  { value: "99%", label: "Satisfaction Rate" },
];

export default BentoGrid; 