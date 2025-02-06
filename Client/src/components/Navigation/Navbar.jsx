import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { FaShoppingCart, FaUser, FaSearch, FaHeart, FaBars } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { useLogoutMutation } from "../../redux/api/usersApiSlice"
import { logout } from "../../redux/features/auth/authSlice"
import Logo from "../Logo"


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { userInfo } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate("/login")
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`)
    }
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
          <Logo/>
          
            <span className={`text-2xl font-bold ${isScrolled ? "text-gray-800" : "text-white"}`}>Meo Loja</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" isScrolled={isScrolled}>
              Home
            </NavLink>
            <NavLink to="/shop" isScrolled={isScrolled}>
              Shop
            </NavLink>
            <NavLink to="/category" isScrolled={isScrolled}>
              Categories
            </NavLink>
            <NavLink to="/deals" isScrolled={isScrolled}>
              Deals
            </NavLink>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            <Link to="/wishlist" className="relative">
              <FaHeart className={`w-6 h-6 ${isScrolled ? "text-gray-600" : "text-white"}`} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            <Link to="/cart" className="relative">
              <FaShoppingCart className={`w-6 h-6 ${isScrolled ? "text-gray-600" : "text-white"}`} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-1">
                <FaUser className={`w-6 h-6 ${isScrolled ? "text-gray-600" : "text-white"}`} />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                  >
                    {userInfo ? (
                      <>
                        <DropdownLink to="/profile">Profile</DropdownLink>
                        {userInfo.isadmin && <DropdownLink to="/admin/dashboard">Dashboard</DropdownLink>}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <DropdownLink to="/login">Login</DropdownLink>
                        <DropdownLink to="/register">Register</DropdownLink>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <FaBars className={`w-6 h-6 ${isScrolled ? "text-gray-600" : "text-white"}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white shadow-lg rounded-b-lg overflow-hidden"
            >
              <div className="py-2">
                <NavLink to="/" isScrolled={true}>
                  Home
                </NavLink>
                <NavLink to="/shop" isScrolled={true}>
                  Shop
                </NavLink>
                <NavLink to="/categories" isScrolled={true}>
                  Categories
                </NavLink>
                <NavLink to="/deals" isScrolled={true}>
                  Deals
                </NavLink>
              </div>
              <form onSubmit={handleSearch} className="px-4 py-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

// Helper Components
const NavLink = ({ to, children, isScrolled }) => (
  <Link
    to={to}
    className={`block md:inline-block px-4 py-2 text-sm font-medium hover:text-blue-500 transition-colors ${
      isScrolled ? "text-gray-800" : "text-white"
    }`}
  >
    {children}
  </Link>
)

const DropdownLink = ({ to, children }) => (
  <Link to={to} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
    {children}
  </Link>
)

export default Navbar

