import { Routes, Route } from "react-router-dom";
import ProductGrid from "./components/ui/ProductGrid";
import ArticleSection from "./components/ui/ArticleSection";

export default function App() {
  return (
    <Routes>
      <Route path="/products" element={<ProductGrid />} />
      <Route path="/articles" element={<ArticleSection />} />
    </Routes>
  );
}