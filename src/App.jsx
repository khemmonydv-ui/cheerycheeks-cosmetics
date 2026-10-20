import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Product from './pages/Products';
import "./App.css";

// Products Route

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;