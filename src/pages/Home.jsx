import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import skincare from "../assets/images/skincare.png";
import aboutPhoto from "../assets/images/about.png";
import MonyPhoto from "../assets/profiles/mony.jpg";
import SongPhoto from "../assets/profiles/song.jpeg";
import NitaPhoto from "../assets/profiles/nita.jpg";
import KakadaPhoto from "../assets/profiles/kakada.jpg";
import PanhaPhoto from "../assets/profiles/panha.jpg";
import routinePhoto from "../assets/images/routine.jpg";
import guidPhoto from "../assets/images/guid.jpg";
import skincarePhoto from "../assets/images/skincare.jpg";
import HeroShowcase from "../components/home/Heroshowcase";
import LoginPrompt from "../components/common/LoginPrompt";
import { useCart } from "../context/CartContext";
import { getCurrentUser } from "../utils/session";
import "./Home.css";


/* ======================================================
   HOME PAGE: everything lives in this one file.
   It only needs:  lucide-react, react-router-dom,
   the image imports above and ./Home.css
====================================================== */

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
  { icon: Droplets, title: "Skincare", text: "Healthy, glowing skin", to: "/products?category=skincare" },
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

const TESTIMONIALS = [

    {
    quote: "Luxurious Swiss skincare designed to nourish, protect, and enhance your natural cheek color.",
    name: "Song",
    photo: SongPhoto,
  },

  {
    quote: "Luxurious Swiss skincare designed to nourish, protect, and enhance your natural cheek color.",
    name: "Mony",
    photo: MonyPhoto,
  },
  {
    quote: "My skin feels soft and bright. The serum is now part of my every day routine.",
    name: "Nita",
    photo: NitaPhoto,
  },
  {
    quote: "Fast delivery and beautiful packaging. The moisturizer is light and smells lovely.",
    name: "Kakada",
    photo: KakadaPhoto,
  },
  {
    quote: "Gentle on my sensitive skin. I have already ordered again for my sister.",
    name: "Panha",
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
function ProductCard({ product, onAddToCart }) {
  const { name, category, price, oldPrice, rating, tag, image } = product;
  const currentPrice = Number(price) || 0;
  const previousPrice = Number(oldPrice) || 0;
  const productRating = Number(rating) || 0;

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
              fill={i < Math.round(productRating) ? "currentColor" : "none"}
              aria-hidden="true"
            />
          ))}
        </p>

        <div className="product-card__footer">
          <p className="product-card__price">
            <strong>${currentPrice.toFixed(2)}</strong>
            {previousPrice > 0 && <s>${previousPrice.toFixed(2)}</s>}
          </p>

          <button
            type="button"
            className="product-card__add"
            aria-label={`Add ${name} to cart`}
            onClick={() => onAddToCart(product)}
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [promptFor, setPromptFor] = useState("");
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef(null);

  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Same login requirement as the Products page.
  const handleAddToCart = (product) => {
    if (!getCurrentUser()) {
      setPromptFor(product.name);
      return;
    }

    // CartContext also checks login and available stock.
    if (!addToCart(product)) {
      setNotice("Sorry, this product is currently unavailable.");
    } else {
      setNotice(`${product.name} added to your cart`);
    }

    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2200);
  };

  const closePrompt = useCallback(() => setPromptFor(""), []);

  const goTo = (path) => {
    setPromptFor("");
    navigate(path, {
      state: {
        from: location.pathname + location.search,
        notice: "Please log in or create an account to add products to your cart.",
      },
    });
  };

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch("/products-data/products.json");
        if (!response.ok) throw new Error("Could not load products");
        const data = await response.json();
        // Supports both [ ...products ] and { "products": [ ...products ] }.
        const productList = Array.isArray(data) ? data : data.products;
        if (!Array.isArray(productList)) {
          throw new Error("JSON must be an array or an object with a products array.");
        }
        console.log("Loaded products:", productList);
        setProducts(productList);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  // Prefer marked best sellers; otherwise show the first five products.
  const featuredProducts = products.filter(
    (product) => product.bestSeller === true || product.bestSeller === "true"
  );
  const bestSellers = (featuredProducts.length ? featuredProducts : products)
    .slice(0, 5)
    .map((product) => ({
      ...product,
      image: product.image || IMAGES.product,
    }));

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
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && bestSellers.length === 0 && (
              <p>No products found in products.json.</p>
            )}
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
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

      {promptFor && (
        <LoginPrompt
          productName={promptFor}
          onLogin={() => goTo("/login")}
          onSignup={() => goTo("/signup")}
          onClose={closePrompt}
        />
      )}

      <div className={notice ? "toast show" : "toast"} role="status" aria-live="polite">
        {notice}
      </div>
    </>
  );
}

export default Home;