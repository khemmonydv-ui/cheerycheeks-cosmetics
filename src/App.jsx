import { Routes, Route } from "react-router-dom";
import Footer from "./components/common/Footer";
import Button from "./components/UI/Button";

function Page({ title }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>{title}</h1>
    </div>
  );
}

function Home() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <Button>Shop Now</Button>
    </div>
  );
}

const pages = [
  { path: "/products", title: "All Products" },
  { path: "/faq", title: "FAQs" },
  { path: "/shipping", title: "Shipping & Delivery" },
  { path: "/returns", title: "Returns & Refunds" },
  { path: "/track-order", title: "Track Your Order" },
  { path: "/about", title: "About Us" },
  { path: "/story", title: "Our Story" },
  { path: "/blog", title: "Blog" },
  { path: "/careers", title: "Careers" },
];

function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {pages.map((p) => (
            <Route key={p.path} path={p.path} element={<Page title={p.title} />} />
          ))}
          <Route path="*" element={<Page title="404 - Page not found" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;