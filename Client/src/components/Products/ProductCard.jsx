import { Link } from "react-router-dom"
import { AiOutlineShoppingCart, AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { addToCart } from "../../redux/features/cart/cartSlice"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { useState } from "react"

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const [isLiked, setIsLiked] = useState(false)

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    })
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
      whileHover={{ y: -5 }}
    >
      <Link to={`/product/${product.id}`} className="block relative">
        <img className="w-full h-48 object-cover" src={product.image || "/placeholder.svg"} alt={product.name} />
        <span className="absolute top-2 left-2 bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {product?.brand}
        </span>
        <button
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-pink-100 transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault()
            setIsLiked(!isLiked)
          }}
        >
          {isLiked ? (
            <AiFillHeart className="text-pink-500" size={20} />
          ) : (
            <AiOutlineHeart className="text-gray-600" size={20} />
          )}
        </button>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-xl font-semibold text-gray-900 truncate">{product?.name}</h5>
          <p className="font-semibold text-pink-500">
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <p className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">{product?.description?.substring(0, 60)}...</p>

        <div className="flex justify-between items-center">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition duration-300"
          >
            View Details
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 text-blue-600 rounded-full hover:bg-blue-100 transition duration-300"
            onClick={() => addToCartHandler(product, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard

