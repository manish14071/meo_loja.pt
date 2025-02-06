import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-[#1F2937] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Welcome to Meo-Loja
            </h1>
            <p className="text-lg mb-6">
              Discover our amazing collection of products at great prices.
            </p>
            <Link
              to="/shop"
              className="bg-pink-600 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
          <div className="lg:w-1/2">
            <img
              src="/images/hero-image.jpg" // Make sure to add your hero image
              alt="Hero"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 