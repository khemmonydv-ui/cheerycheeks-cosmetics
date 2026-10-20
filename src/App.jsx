
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Product from './pages/Products';
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import "./App.css";

// Products Route

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<Product />} />
      </Routes>
    </BrowserRouter>



// Scroll back to the top whenever the page changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <MainLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />

      </Routes>
    </MainLayout>
  );
}

export default App;