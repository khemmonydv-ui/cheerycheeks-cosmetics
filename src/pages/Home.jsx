import { useEffect, useRef, useState } from "react";
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
  ShoppingBag,
} from "lucide-react";
import skincare from "../assets/skincare.png";
import "./Home.css";

/* ======================================================
   HOME PAGE: everything lives in this one file.
   It only needs:  lucide-react, react-router-dom,
   src/assets/skincare.png  and  ./Home.css
====================================================== */

/* ---------- Photos ----------
   To add more photos: put them in src/assets/, import them
   like skincare above, then use them here instead of null. */
const IMAGES = {
  hero: skincare,
  product: skincare,
  category: null,
  about: null,
  testimonial: null,
  journal: null,
};

/* ---------- Content: change the text here ---------- */

const FEATURES = [
  {
    icon: Leaf,
    title: "Natural ingredients",
    text: "Gentle, plant-based formulas",
  },
  { icon: Truck, title: "Fast delivery", text: "Quick and safe shipping" },
  {
    icon: ShieldCheck,
    title: "Safe & tested",
    text: "Dermatologically tested",
  },
  { icon: RotateCcw, title: "Easy returns", text: "7-day return policy" },
];

const CATEGORIES = [
  {
    icon: Droplets,
    title: "Skincare",
    text: "Strength & shine",
    to: "/products?category=skincare",
  },
  {
    icon: Palette,
    title: "Makeup",
    text: "Color & confidence",
    to: "/products?category=makeup",
  },
  {
    icon: Sparkles,
    title: "Haircare",
    text: "Soft, healthy hair",
    to: "/products?category=haircare",
  },
  {
    icon: Flower2,
    title: "Bodycare",
    text: "Smooth, nourished skin",
    to: "/products?category=bodycare",
  },
];

const ABOUT_STATS = [
  { value: "98%", label: "Customer satisfaction" },
  { value: "50+", label: "Skincare products" },
  { value: "10k+", label: "Happy customers" },
  { value: "100%", label: "Cruelty free" },
];

/* ----------------------------------------------------
   BEST SELLERS (static for now)
   Same shape as a JSON product, so later you only replace
   this array with your JSON data. Nothing else changes:

     import products from "../data/products.json";
     const BEST_SELLERS = products.filter((p) => p.bestSeller).slice(0, 5);

   Each product can have its own "image". If it has none,
   the default product photo is used.
---------------------------------------------------- */
const BEST_SELLERS_DATA = [
  {
    id: 1,
    name: "Foam Cleanser",
    category: "Skincare",
    price: 18,
    rating: 5,
    tag: "Best",
  },
  {
    id: 2,
    name: "Glow Boost Serum",
    category: "Skincare",
    price: 32,
    oldPrice: 40,
    rating: 4,
    tag: "-20%",
  },
  {
    id: 3,
    name: "Soft Moisturizer",
    category: "Skincare",
    price: 26,
    rating: 4,
  },
  {
    id: 4,
    name: "Gentle Toner",
    category: "Skincare",
    price: 20,
    rating: 4,
    tag: "New",
  },
  {
    id: 5,
    name: "Daily Sunscreen",
    category: "Skincare",
    price: 24,
    rating: 5,
  },
];

const BEST_SELLERS = BEST_SELLERS_DATA.map((p) => ({
  ...p,
  image: p.image ?? IMAGES.product,
}));

const TESTIMONIALS = [
  {
    quote:
      "Luxurious Swiss skincare designed to nourish, protect, and enhance your natural cheek color.",
    name: "Sarah J.",
  },
  {
    quote:
      "My skin feels soft and bright. The serum is now part of my every day routine.",
    name: "Dara K.",
  },
  {
    quote:
      "Fast delivery and beautiful packaging. The moisturizer is light and smells lovely.",
    name: "Lina P.",
  },
  {
    quote:
      "Gentle on my sensitive skin. I have already ordered again for my sister.",
    name: "Maly S.",
  },
];

const JOURNAL = [
  {
    date: "Oct 10, 2026",
    title: "5 simple steps to a glowing morning routine",
    to: "/blog",
  },
  {
    date: "Oct 05, 2026",
    title: "How to choose the right serum for your skin type",
    to: "/blog",
  },
  {
    date: "Sep 28, 2026",
    title: "Why natural ingredients matter for sensitive skin",
    to: "/blog",
  },
];

// Little foam bubbles that rise behind the hero product
const BUBBLES = [
  { left: "6%", size: 14, duration: 9, delay: 0 },
  { left: "18%", size: 22, duration: 12, delay: 2 },
  { left: "30%", size: 10, duration: 8, delay: 4 },
  { left: "44%", size: 18, duration: 11, delay: 1 },
  { left: "58%", size: 12, duration: 9, delay: 5 },
  { left: "70%", size: 24, duration: 13, delay: 3 },
  { left: "82%", size: 14, duration: 10, delay: 6 },
  { left: "92%", size: 18, duration: 12, delay: 2.5 },
];

/* ======================================================
   HERO
   Text slides in, the product moves a little with the mouse.
   Everything calms down for people who chose "reduce motion".
====================================================== */

function Hero({ image }) {
  const sectionRef = useRef(null);

  // Mouse parallax: writes --mx and --my (-0.5 to 0.5) on the section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || touch) return undefined;

    let frame = 0;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="showcase" ref={sectionRef}>
      <div className="showcase__blob showcase__blob--1" aria-hidden="true" />
      <div className="showcase__blob showcase__blob--2" aria-hidden="true" />

      <div className="container showcase__inner">
        {/* Text */}
        <div className="showcase__content">
          <p
            className="showcase__pill showcase__reveal"
            style={{ "--d": "0s" }}
          >
            <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
            Natural skincare for everyone
          </p>

          <h1 className="showcase__title">
            <span className="showcase__line">
              <span style={{ "--d": "0.12s" }}>Glow Naturally &amp;</span>
            </span>
            <span className="showcase__line showcase__line--accent">
              <span style={{ "--d": "0.26s" }}>Shine Confidently</span>
            </span>
          </h1>

          <p
            className="showcase__text showcase__reveal"
            style={{ "--d": "0.42s" }}
          >
            Gentle, clean beauty and skincare made for your everyday glow.
            Discover products your skin will love.
          </p>

          <div
            className="showcase__actions showcase__reveal"
            style={{ "--d": "0.54s" }}
          >
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now
              <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link
              to="/products?category=skincare"
              className="btn btn-outline btn-lg"
            >
              Explore Skincare
            </Link>
          </div>

          <div
            className="showcase__proof showcase__reveal"
            style={{ "--d": "0.66s" }}
          >
            <span className="showcase__stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            <p>
              <strong>4.9 / 5</strong> from 10,000+ happy customers
            </p>
          </div>
        </div>

        {/* Visual */}
        <div className="showcase__visual">
          <div
            className="showcase__layer showcase__layer--word"
            aria-hidden="true"
          >
            <span className="showcase__word">GLOW</span>
          </div>

          <div className="showcase__bubbles" aria-hidden="true">
            {BUBBLES.map((b, i) => (
              <span
                key={i}
                className="showcase__bubble"
                style={{
                  left: b.left,
                  width: b.size,
                  height: b.size,
                  animationDuration: `${b.duration}s`,
                  animationDelay: `${b.delay}s`,
                }}
              />
            ))}
          </div>

          <div className="showcase__layer showcase__layer--product">
            {image ? (
              <img
                src={image}
                alt="Cherry Cheeks skincare product"
                className="showcase__product"
              />
            ) : (
              <Sparkles size={96} strokeWidth={1} aria-hidden="true" />
            )}
          </div>

          <div
            className="showcase__layer showcase__layer--chip-top"
            aria-hidden="true"
          >
            <div className="showcase__chip">
              <span className="showcase__chip-icon">
                <Leaf size={18} strokeWidth={1.75} />
              </span>
              <div>
                <strong>100% natural</strong>
                <span>Gentle ingredients</span>
              </div>
            </div>
          </div>

          <div
            className="showcase__layer showcase__layer--chip-bottom"
            aria-hidden="true"
          >
            <div className="showcase__chip showcase__chip--late">
              <span className="showcase__chip-icon">
                <Star size={18} strokeWidth={1.75} fill="currentColor" />
              </span>
              <div>
                <strong>4.9 rating</strong>
                <span>Loved by customers</span>
              </div>
            </div>
          </div>

          <div
            className="showcase__layer showcase__layer--badge"
            aria-hidden="true"
          >
            <div className="showcase__badge">
              <svg viewBox="0 0 100 100">
                <defs>
                  <path
                    id="showcase-circle"
                    d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                  />
                </defs>
                <text>
                  <textPath
                    href="#showcase-circle"
                    textLength="232"
                    lengthAdjust="spacing"
                  >
                    NATURAL • GENTLE • CLEAN •
                  </textPath>
                </text>
              </svg>
              <Leaf size={22} strokeWidth={1.75} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   SMALL COMPONENTS
====================================================== */

/* One product in the best sellers grid */
function ProductCard({ product }) {
  const { name, category, price, oldPrice, rating, tag, image } = product;

  return (
    <article className="card product-card">
      <div className="product-card__media">
        {tag && <span className="product-card__tag">{tag}</span>}
        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <Sparkles size={48} strokeWidth={1.25} aria-hidden="true" />
        )}
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{category}</p>
        <h3 className="product-card__name">{name}</h3>

        <p
          className="product-card__rating"
          aria-label={`Rated ${rating} out of 5`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={15}
              strokeWidth={1.5}
              fill={i < Math.round(rating) ? "currentColor" : "none"}
              aria-hidden="true"
            />
          ))}
        </p>

        <div className="product-card__footer">
          <p className="product-card__price">
            <strong>${price.toFixed(2)}</strong>
            {oldPrice && <s>${oldPrice.toFixed(2)}</s>}
          </p>

          <button
            type="button"
            className="product-card__add"
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingBag size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

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
