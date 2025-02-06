import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Route, RouterProvider, createRoutesFromElements, createBrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import PrivateRoute from "./components/PrivateRoute";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/User/Profile.jsx";



import AdminRoutes from "./pages/Admin/AdminRoutes";
import UserList from "./pages/Admin/UserList.jsx";
import CategoryList from "./pages/Admin/CategoryList";
import ProductList from "./pages/Admin/ProductList.jsx";
import AllProducts from "./pages/Admin/AllProducts.jsx";
import ProductUpdate from "./pages/Admin/ProductUpdate.jsx"
import Home from "./pages/Home.jsx"
import Favorites from "./pages/Products/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import Cart from ".././src/pages/Cart.jsx"
import Shop from "./pages/Shop.jsx";
import Shipping from "./pages/Orders/Shipping.jsx"
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import Order from "./pages/Orders/Order.jsx";
import OrderList from "./pages/Admin/OrderList.jsx";
import UserOrder from "./pages/User/UserOrder.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/user-orders" element={<UserOrder />} />
      <Route path="/category" element={<AllProducts />} />





      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />

      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoutes />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="orderlist" element={<OrderList />} />
      </Route>
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* Only wrap in PayPalScriptProvider when needed */}
    {window.location.pathname.includes('/order/') ? (
      <PayPalScriptProvider
        options={{
          "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
          currency: "USD"
        }}
      >
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    ) : (
      <RouterProvider router={router} />
    )}
  </Provider>
);
