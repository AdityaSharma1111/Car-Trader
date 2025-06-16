import { Outlet } from "react-router-dom";
import Navbar from "./components/Layout/Navbar"
import Footer from "./components/Layout/Footer";
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
        <main>
          <Outlet />
        </main>
      <Footer />
    </>
  );
};

export default App;
