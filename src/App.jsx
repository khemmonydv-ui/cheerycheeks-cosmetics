import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Product from "./pages/Products.jsx";
import About from "./pages/About.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";

import Signup from "./pages/Signup.jsx";
import "./App.css";

// Pages that should show without the header and footer
const NO_LAYOUT_PATHS = ["/login", "/signup"];

// Scroll back to the top whenever the page changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { pathname } = useLocation();
  const hideLayout = NO_LAYOUT_PATHS.includes(pathname);

  // Login and sign up: no header, no footer
  if (hideLayout) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </>
    );
  }

  // All other pages: with header and footer
  return (
    <MainLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </MainLayout>
  );
}

export default App;