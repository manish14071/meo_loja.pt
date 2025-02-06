import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/api/usersApiSlice';
import { logout } from '../redux/features/auth/authSlice';
import { FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import SearchBox from './SearchBox';
import { toast } from 'react-toastify';

const Navigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { favorites } = useSelector((state) => state.favorites);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <nav className="bg-[#1F2937] text-white py-4 fixed w-full z-50 top-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Meo-Loja
          </Link>

          {/* Search Box */}
          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <SearchBox />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/shop" className="hover:text-pink-500">
              Shop
            </Link>
            
            <Link to="/cart" className="hover:text-pink-500 relative">
              <FaShoppingCart className="text-2xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <Link to="/favorite" className="hover:text-pink-500 relative">
              <FaHeart className="text-2xl" />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {favorites.length}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-1 hover:text-pink-500"
                >
                  <FaUser className="text-xl" />
                  <span>{userInfo.username}</span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    {userInfo.isadmin && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/user-orders"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-pink-600 px-4 py-2 rounded-full hover:bg-pink-700"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-16 6h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden mt-4">
            <SearchBox />
            <div className="flex flex-col space-y-4 mt-4">
              <Link to="/shop" className="hover:text-pink-500">
                Shop
              </Link>
              <Link to="/cart" className="hover:text-pink-500">
                Cart ({cartItems.length})
              </Link>
              <Link to="/favorite" className="hover:text-pink-500">
                Favorites ({favorites.length})
              </Link>
              {userInfo ? (
                <>
                  <Link to="/profile" className="hover:text-pink-500">
                    Profile
                  </Link>
                  {userInfo.isadmin && (
                    <Link to="/admin/dashboard" className="hover:text-pink-500">
                      Dashboard
                    </Link>
                  )}
                  <Link to="/user-orders" className="hover:text-pink-500">
                    Orders
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="text-left hover:text-pink-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-pink-600 px-4 py-2 rounded-full hover:bg-pink-700 inline-block"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 