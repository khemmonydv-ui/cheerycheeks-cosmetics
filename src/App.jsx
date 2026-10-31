import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Cart from "./pages/cart/Cart";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import Messages from "./pages/admin/Messages.jsx";
import "./App.css";
import { Timer } from "lucide-react";

// Scroll back to the top whenever the page changes
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // wait one moment so the page has finished drawing
      const timer = setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}



// Shop pages: header + footer around the page
function PublicLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

// NOTE: <BrowserRouter> lives in main.jsx, so it must NOT be added here.
function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <ScrollToTop />

          <Routes>
            {/* ---------- Login and sign up (no header, no footer) ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ---------- Shop (has header and footer) ---------- */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/account" element={<Account />} />
              {/* Header and footer link to /product, so send it to /products */}
              <Route path="/product" element={<Navigate to="/products" replace />} />
            </Route>

            {/* ---------- Admin (no shop header or footer) ---------- */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />

            {/* Everything under /admin needs login, and shares the sidebar layout */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="products" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="massage" element={<Messages />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;