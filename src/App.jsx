import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Contact from "./pages/Contact.jsx";
import { ProductsProvider } from "./context/ProductsContext";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import ComingSoon from "./pages/admin/ComingSoon";
import AdminProducts from "./pages/admin/AdminProducts";
import "./App.css";

// Scroll back to the top whenever the page changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Shop pages: header + page + footer.
// <Outlet /> is where the matching child route is shown.
function PublicLayout() {
  return (
    <MainLayout>
      <ScrollToTop />
      <Outlet />
    </MainLayout>
  );
}

// NOTE: <BrowserRouter> lives in main.jsx, so it must NOT be added here.
function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <Routes>
          {/* ---------- Shop (has header and footer) ---------- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            {/* Header and footer link to /product, so send it to /products */}
            <Route path="/product" element={<Navigate to="/products" replace />} />
          </Route>

          {/* ---------- Admin (no shop header or footer) ---------- */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Everything under /admin needs login, and shares the sidebar layout */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="products" replace />} />
              <Route path="dashboard" element={<ComingSoon title="Dashboard" />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="massage" element={<ComingSoon title="Massage" />} />
            </Route>
          </Route>
        </Routes>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;