import { useEffect, useState } from "react";
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
  Play,
  X,
} from "lucide-react";


import ProductCard from "../components/product/ProductCard";
import skincare from "../assets/images/skincare.png";
import aboutPhoto from "../assets/images/about.png";
// profile
import MonyPhoto from "../assets/profiles/mony.jpg";
import NitaPhoto from "../assets/profiles/nita.jpg";
import KakadaPhoto from "../assets/profiles/kakada.jpg";
import PanhaPhoto from "../assets/profiles/panha.jpg";
// img hight light
import routinePhoto from "../assets/images/routine.jpg";
import guidPhoto from "../assets/images/guid.jpg"
import skincarePhoto from "../assets/images/skincare.jpg"
import HeroShowcase from "../components/home/Heroshowcase";
import "./Home.css";

/* ======================================================
   HOME PAGE: everything lives in this one file.
   It only needs:  lucide-react, react-router-dom,
   src/assets/skincare.png  and  ./Home.css
====================================================== */import Hero from "../components/home/Heroshowcase";

/* ---------- Photos ----------
   To add more photos: put them in src/assets/, import them
   like skincare above, then use them here instead of null. */
const IMAGES = {
  hero: skincare,
  product: skincare,
  category: null,
  about: aboutPhoto,
  testimonial: null,
  journal: null,
};
/* ---------- Content: change the text here ---------- */

const FEATURES = [
  { icon: Leaf, title: "Natural ingredients", text: "Gentle, plant-based formulas" },
  { icon: Truck, title: "Fast delivery", text: "Quick and safe shipping" },
  { icon: ShieldCheck, title: "Safe & tested", text: "Dermatologically tested" },
  { icon: RotateCcw, title: "Easy returns", text: "7-day return policy" },
];

const CATEGORIES = [

  { icon: Droplets, title: "Skincare", text: "Strength & shine", to: "/products?category=skincare" },
  { icon: Palette, title: "Makeup", text: "Color & confidence", to: "/products?category=makeup" },
  { icon: Sparkles, title: "Haircare", text: "Soft, healthy hair", to: "/products?category=haircare" },
  { icon: Flower2, title: "Bodycare", text: "Smooth, nourished skin", to: "/products?category=bodycare" },
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
  { id: 1, name: "Foam Cleanser", category: "Skincare", price: 18, rating: 5, tag: "Best" },
  { id: 2, name: "Glow Boost Serum", category: "Skincare", price: 32, oldPrice: 40, rating: 4, tag: "-20%" },
  { id: 3, name: "Soft Moisturizer", category: "Skincare", price: 26, rating: 4 },
  { id: 4, name: "Gentle Toner", category: "Skincare", price: 20, rating: 4, tag: "New" },
  { id: 5, name: "Daily Sunscreen", category: "Skincare", price: 24, rating: 5 },
];

const BEST_SELLERS = BEST_SELLERS_DATA.map((p) => ({
  ...p,
  image: p.image ?? IMAGES.product,
}));

const TESTIMONIALS = [

  {
    quote: "My skin feels soft and bright. The serum is now part of my every day routine.",
    name: "Mony K.",
    photo: MonyPhoto,
  },

  {

    quote: "Luxurious Swiss skincare designed to nourish, protect, and enhance your natural cheek color.",
    name: "kakada Y.",
    photo: KakadaPhoto,
  },
  {
    quote: "Fast delivery and beautiful packaging. The moisturizer is light and smells lovely.",
    name: "Nita C.",
    photo: NitaPhoto,
  },
  {
    quote: "Gentle on my sensitive skin. I have already ordered again for my sister.",
    name: "Panha H.",
    photo: PanhaPhoto,
  },
];

/* ----------------------------------------------------
   JOURNAL
   Every article can have:
     image   : a picture (import it like the other photos)
     tag     : small label, e.g. "Routine", "Video"
     video   : a video file in  public/videos/  e.g. "/videos/routine.mp4"
     youtube : a YouTube video id, e.g. "dQw4w9WgXcQ"
   If it has a video or youtube, a play button appears on the
   picture and the video opens in a pop-up. No video = plain card.
---------------------------------------------------- */
const JOURNAL = [
{
  date: "Oct 10, 2026",
  title: "5 simple steps to a glowing morning routine",
  tag: "Routine",
  image:routinePhoto,
  video: "/video/routine.mp4",   // your file name
  youtube: null,
},
  {
    date: "Oct 05, 2026",
    title: "How to choose the right serum for your skin type",
    tag: "Guide",
    image: guidPhoto,
    video: "/video/guid.mp4",
    youtube: null,
  },
  {
    date: "Sep 28, 2026",
    title: "Why natural ingredients matter for sensitive skin",
    tag: "Skin care",
    image: skincarePhoto,
    video: "/video/skincare.mp4",
    youtube: null,
  },
];

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

        <p className="product-card__rating" aria-label={`Rated ${rating} out of 5`}>
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

          <button type="button" className="product-card__add" aria-label={`Add ${name} to cart`}>
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
  // each review can have its own photo; if not, use the default one
  const photo = current.photo ?? IMAGES.testimonial;

  return (
    <div className="home-quote">
      <div className="home-quote__media">
        {photo ? (
          <img key={index} src={photo} alt="" loading="lazy" />
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
              {current.photo ? <img src={current.photo} alt="" /> : current.name[0]}
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

/* Pop-up video player: closes with the X, a click outside, or Esc */
function VideoModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    const previous = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="video-modal" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <div className="video-modal__box" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="video-modal__close" aria-label="Close video" onClick={onClose}>
          <X size={22} strokeWidth={2} aria-hidden="true" />
        </button>

        {item.youtube ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.youtube}?autoplay=1&rel=0`}
            title={item.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={item.video} poster={item.image ?? undefined} controls autoPlay playsInline />
        )}
      </div>
    </div>
  );
}

/* Journal section: cards, with an optional video on each one */
function Journal() {
  const [playing, setPlaying] = useState(null);

  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="From the journal"
          title="Tips, trends & insight"
        />

        <div className="home-posts">
          {JOURNAL.map((item) => {
            const { date, title, to, tag, image } = item;
            const hasVideo = Boolean(item.video || item.youtube);
            const picture = image ?? IMAGES.journal;

            return (
              <article key={title} className="home-post">
                <div className="home-post__media">
                  {picture ? (
                    <img src={picture} alt="" loading="lazy" />
                  ) : (
                    <Sparkles size={40} strokeWidth={1.25} aria-hidden="true" />
                  )}

                  {hasVideo && (
                    <button
                      type="button"
                      className="home-post__play"
                      aria-label={`Play video: ${title}`}
                      onClick={() => setPlaying(item)}
                    >
                      <span>
                        <Play size={22} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                      </span>
                    </button>
                  )}
                </div>

                <div className="home-post__body">
                  <p className="home-post__meta">
                    {tag && <span className="home-post__tag">{hasVideo ? `${tag} · Video` : tag}</span>}
                    <time>{date}</time>
                  </p>
                  <h3>{title}</h3>

                </div>
              </article>
            );
          })}
        </div>
      </div>

      {playing && <VideoModal item={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}

/* ======================================================
   PAGE
====================================================== */

function Home() {
  return (
    <>
      <HeroShowcase image={IMAGES.hero} />

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
        <div className="container home-about__layout">
          <div className="home-about__inner">
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
      <Journal />
    </>
  );
}

export default Home;