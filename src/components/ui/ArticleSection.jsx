import ArticleCard from "./ArticleCard";
import serum from "../../assets/image 18.png";

const articles = [
  {
    id: 1,
    date: "Oct 10.2026",
    title: "The Biggest Beauty Product Trend of 2019 Is Almost Good Enough to Eat",
    image: serum,
    imageAlt: "Beet Vitamin A serum shot",
    href: "/articles/1",
  },
  {
    id: 2,
    date: "Oct 10.2026",
    title: "The Biggest Beauty Product Trend of 2019 Is Almost Good Enough to Eat",
    image: serum,
    imageAlt: "Beet Vitamin A serum shot",
    href: "/articles/2",
  },
  {
    id: 3,
    date: "Oct 10.2026",
    title: "The Biggest Beauty Product Trend of 2019 Is Almost Good Enough to Eat",
    image: serum,
    imageAlt: "Beet Vitamin A serum shot",
    href: "/articles/3",
  },
];

export default function ArticleSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid grid-articles">
          {articles.map(({ id, ...article }) => (
            <ArticleCard key={id} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}