import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navigation/Navbar';
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <main className="py-3">
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default App;
