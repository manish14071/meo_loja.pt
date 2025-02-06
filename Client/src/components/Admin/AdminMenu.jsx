import { Link } from 'react-router-dom';
import {
  FaUser,
  FaClipboardList,
  FaShoppingCart,
  FaListAlt,
  FaTachometerAlt,
} from 'react-icons/fa';

const AdminMenu = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Admin Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link
            to="/admin/dashboard"
            className="flex items-center text-gray-700 hover:text-blue-500"
          >
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/productlist"
            className="flex items-center text-gray-700 hover:text-blue-500"
          >
            <FaClipboardList className="mr-2" />
            Products
          </Link>
        </li>
        <li>
          <Link
            to="/admin/categorylist"
            className="flex items-center text-gray-700 hover:text-blue-500"
          >
            <FaListAlt className="mr-2" />
            Categories
          </Link>
        </li>
        <li>
          <Link
            to="/admin/orderlist"
            className="flex items-center text-gray-700 hover:text-blue-500"
          >
            <FaShoppingCart className="mr-2" />
            Orders
          </Link>
        </li>
        <li>
          <Link
            to="/admin/userlist"
            className="flex items-center text-gray-700 hover:text-blue-500"
          >
            <FaUser className="mr-2" />
            Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminMenu; 