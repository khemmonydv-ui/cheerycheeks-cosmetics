import { Routes, Route } from "react-router-dom";
import ProductGrid from "./components/ui/ProductGrid";

export default function App() {
  return (
    <Routes>
      <Route path="/products" element={<ProductGrid />} />
    </Routes>
  );
}