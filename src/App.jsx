import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Product from "./pages/Products.jsx";
import About from "./pages/About.jsx";
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </MainLayout>
  );
}

// NOTE: <BrowserRouter> lives in main.jsx, so it must NOT be added here.
function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <Routes>
            {/* ---------- Shop (has header and footer) ---------- */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              {/* Header and footer link to /product, so send it to /products */}
              <Route path="/product" element={<Navigate to="/products" replace />} />
            </Route>

            {/* ---------- Admin (no shop header or footer) ---------- */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Everything under /admin needs login, and shares the sidebar layout */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="massage" element={<ComingSoon title="Massage" />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;