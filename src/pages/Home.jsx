import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Star,
  Quote,
  Leaf,
  Truck,
  ShieldCheck,
  RotateCcw,
  Droplets,
  Palette,
  Sparkles,
  Flower2,
} from "lucide-react";
import Hero from "../components/home/Hero";
import ProductCard from "../components/product/ProductCard";
import "./Home.css";
import heroProduct from "../assets/skincare.png"

/* ======================================================
   PHOTOS
   1. Put your photos in  src/assets/home/
   2. Uncomment the import lines (use your real file names)
   3. Put each one into IMAGES below
   Until then, every section shows a clean placeholder.
====================================================== */

// import hero from "../assets/home/hero.jpg";
// import category from "../assets/home/category.png";
// import about from "../assets/home/about.png";
// import product from "../assets/home/product.png";
// import testimonial from "../assets/home/testimonial.jpg";
// import journal from "../assets/home/journal.jpg";

const IMAGES = {
  hero: heroProduct,
  category: null,
  about: null,
  product: null,
  testimonial: null,
  journal: null,
};

/* ======================================================
   CONTENT: change the text here
====================================================== */

const FEATURES = [
  { icon: Leaf, title: "Natural ingredients", text: "Gentle, plant-based formulas" },
  { icon: Truck, title: "Fast delivery", text: "Quick and safe shipping" },
  { icon: ShieldCheck, title: "Safe & tested", text: "Dermatologically tested" },
  { icon: RotateCcw, title: "Easy returns", text: "7-day return policy" },
];

const CATEGORIES = [
  { icon: Droplets, title: "Skincare", text: "Strength & shine", to: "/products?category=skincare" },
  { icon: Palette, title: "Lips", text: "Color & confidence", to: "/products?category=makeup" },
  { icon: Sparkles, title: "Face", text: "Soft, healthy hair", to: "/products?category=haircare" },
  { icon: Flower2, title: "Eyes", text: "Smooth, nourished skin", to: "/products?category=bodycare" },
];

const ABOUT_STATS = [
  { value: "98%", label: "Customer satisfaction" },
  { value: "50+", label: "Skincare products" },
  { value: "10k+", label: "Happy customers" },
  { value: "100%", label: "Cruelty free" },
];

const BEST_SELLERS = [
  { id: 1, name: "Glow Boost Serum", category: "Skincare", price: 32, rating: 4, image: IMAGES.product },
  { id: 2, name: "Glow Boost Serum", category: "Skincare", price: 32, rating: 4, image: IMAGES.product },
  { id: 3, name: "Glow Boost Serum", category: "Skincare", price: 32, rating: 4, image: IMAGES.product },
  { id: 4, name: "Glow Boost Serum", category: "Skincare", price: 32, rating: 4, image: IMAGES.product },
  { id: 5, name: "Glow Boost Serum", category: "Skincare", price: 32, rating: 4, image: IMAGES.product },
];

const TESTIMONIALS = [
  {
    quote: "Luxurious Swiss skincare designed to nourish, protect, and enhance your natural cheek color.",
    name: "Sarah J.",
  },
  {
    quote: "My skin feels soft and bright. The serum is now part of my every day routine.",
    name: "Dara K.",
  },
  {
    quote: "Fast delivery and beautiful packaging. The moisturizer is light and smells lovely.",
    name: "Lina P.",
  },
  {
    quote: "Gentle on my sensitive skin. I have already ordered again for my sister.",
    name: "Maly S.",
  },
];

const JOURNAL = [
  { date: "Oct 10, 2026", title: "5 simple steps to a glowing morning routine", to: "/blog" },
  { date: "Oct 05, 2026", title: "How to choose the right serum for your skin type", to: "/blog" },
  { date: "Sep 28, 2026", title: "Why natural ingredients matter for sensitive skin", to: "/blog" },
];

/* ======================================================
   SMALL COMPONENTS
====================================================== */

/* Title row: label + title on the left, "View all" link on the right */
function SectionHead({ eyebrow, title, to, linkLabel }) {
  return (
    <div className="home-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="home-head__link">
          {linkLabel}
          <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/* Customer quote with dots to switch between reviews */
function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const current = TESTIMONIALS[index];

  return (
    <div className="home-quote">
      <div className="home-quote__media">
        {IMAGES.testimonial ? (
          <img src={IMAGES.testimonial} alt="" loading="lazy" />
        ) : (
          <Leaf size={96} strokeWidth={1} aria-hidden="true" />
        )}
      </div>

      <div className="home-quote__panel">
        <Quote size={36} strokeWidth={1.5} aria-hidden="true" />

        <blockquote key={index} className="home-quote__text">
          {current.quote}
        </blockquote>

        <div className="home-quote__footer">
          <p className="home-quote__author">
            <span className="home-quote__avatar" aria-hidden="true">
              {current.name[0]}
            </span>
            {current.name}
          </p>

          <div className="home-quote__dots">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                aria-label={`Show review ${i + 1}`}
                aria-current={i === index}
                className={i === index ? "is-active" : ""}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   PAGE
====================================================== */

function Home() {
  return (
    <>
      <Hero image={IMAGES.hero} />

      {/* Benefits: floating card that overlaps the hero */}
      <section className="home-features-wrap">
        <div className="container">
          <ul className="home-features">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="home-feature">
                <span className="home-feature__icon">
                  <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Best categories"
            title="Curated for your beauty"
            to="/products"
            linkLabel="View all categories"
          />

          <div className="home-cats">
            {CATEGORIES.map(({ icon: Icon, title, text, to }) => (
              <Link key={title} to={to} className="home-cat">
                <div className="home-cat__text">
                  <span className="home-cat__icon">
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="home-cat__arrow">
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                </div>

                <div className="home-cat__media">
                  {IMAGES.category ? (
                    <img src={IMAGES.category} alt="" loading="lazy" />
                  ) : (
                    <Icon size={72} strokeWidth={1} aria-hidden="true" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About band */}
      <section className="home-about">
        <div className="container home-about__inner">
          <p className="home-about__eyebrow">About Cherry Cheeks</p>
          <h2 className="home-about__title">
            Beauty that&apos;s clean.
            <br />
            Confidence that&apos;s real.
          </h2>
          <p className="home-about__text">
            Skincare made with gentle, natural ingredients, simple routines and
            honest advice, so you can feel good in your own skin every day.
          </p>

          <ul className="home-about__stats">
            {ABOUT_STATS.map(({ value, label }) => (
              <li key={label}>
                <Star size={22} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="home-about__media" aria-hidden="true">
          {IMAGES.about && <img src={IMAGES.about} alt="" loading="lazy" />}
        </div>
      </section>

      {/* Best sellers */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Our bestsellers"
            title="Curated for your beauty"
            to="/products"
            linkLabel="View all products"
          />

          <div className="home-bestsellers">
            {BEST_SELLERS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="home-quote-section">
        <div className="container">
          <TestimonialSlider />
        </div>
      </section>

      {/* Journal */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="From the journal"
            title="Tips, trends & insight"
            to="/blog"
            linkLabel="View all articles"
          />

          <div className="home-posts">
            {JOURNAL.map(({ date, title, to }) => (
              <article key={title} className="home-post">
                <div className="home-post__media">
                  {IMAGES.journal ? (
                    <img src={IMAGES.journal} alt="" loading="lazy" />
                  ) : (
                    <Sparkles size={40} strokeWidth={1.25} aria-hidden="true" />
                  )}
                </div>
                <div className="home-post__body">
                  <time>{date}</time>
                  <h3>{title}</h3>
                  <Link to={to} className="home-post__more">
                    Read more
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;