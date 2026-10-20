import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProductsProvider } from './context/ProductsContext';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import Product from './pages/Products';
import AdminLogin from './pages/admin/AdminLogin';
import ComingSoon from './pages/admin/ComingSoon';
import AdminProducts from './pages/admin/AdminProducts';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<Product />} />
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
        </BrowserRouter>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;