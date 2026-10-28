import { useEffect, useState } from "react";
import CategoryCard from "../components/product/CategoryCard";

function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/product-data/categories.json")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div>
      {categories.map((item) => (
        <CategoryCard
          key={item.id}
          name={item.name}
          description={item.description}
        />
      ))}
    </div>
  );
}

export default Home;