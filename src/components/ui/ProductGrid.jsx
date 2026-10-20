  import ProductCard from "./ProductCard";
  import tube from "../../assets/img-items.png";

  const products = [
    { title: "Skincare", description: "Strength & shine", href: "/collections/skincare" },
    { title: "Lips", description: "Soft & smooth", href: "/collections/lips" },
    { title: "Glow", description: "Radiant finish", href: "/collections/glow" },
    { title: "Hydration", description: "Deep moisture", href: "/collections/hydration" },
  ];

  export default function ProductGrid() {
    return (
      <section className="section">
        <div className="container">
          <div className="grid grid-products">
            {products.map((p) => (
              <ProductCard
                key={p.title}
                title={p.title}
                description={p.description}
                image={tube}
                imageAlt={`${p.title} product`}
                href={p.href}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }