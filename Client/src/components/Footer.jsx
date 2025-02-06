import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-10 w-full">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 text-center sm:text-left">
        <motion.div whileHover={{ scale: 1.05 }}>
          <h2 className="text-xl font-bold">ShopEasy</h2>
          <p className="text-gray-400 mt-2">Your go-to online store for everything!</p>
        </motion.div>

        <motion.ul whileHover={{ scale: 1.05 }}>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <li className="mt-2 hover:text-blue-400 cursor-pointer">Home</li>
          <li className="mt-2 hover:text-blue-400 cursor-pointer">Shop</li>
          <li className="mt-2 hover:text-blue-400 cursor-pointer">About</li>
          <li className="mt-2 hover:text-blue-400 cursor-pointer">Contact</li>
        </motion.ul>

        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center sm:items-end">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex justify-center sm:justify-end gap-4 mt-2">
            <FaFacebook className="cursor-pointer hover:text-blue-500" size={24} />
            <FaTwitter className="cursor-pointer hover:text-blue-400" size={24} />
            <FaInstagram className="cursor-pointer hover:text-pink-500" size={24} />
            <FaYoutube className="cursor-pointer hover:text-red-500" size={24} />
          </div>
        </motion.div>
      </div>
      <p className="text-center text-gray-500 text-sm mt-6">&copy; 2025 ShopEasy. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
