import { Link } from "react-router-dom";
import { FaUsers, FaClipboardList, FaBoxOpen, FaTachometerAlt, FaListAlt } from "react-icons/fa";

const AdminSidebar = () => {
  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      path: "/admin/userlist",
      name: "Users",
      icon: <FaUsers />,
    },
    {
      path: "/admin/categorylist",
      name: "Categories",
      icon: <FaListAlt />,
    },
    {
      path: "/admin/productlist",
      name: "Products",
      icon: <FaBoxOpen />,
    },
    {
      path: "/admin/orderlist",
      name: "Orders",
      icon: <FaClipboardList />,
    },
  ];

  return (
    <div className="fixed left-0 h-full w-64 bg-gray-800 text-white p-4">
      <div className="text-2xl font-bold mb-8 text-center">Admin Panel</div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar; 