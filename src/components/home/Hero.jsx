import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Sparkles, Star } from "lucide-react";
import skincare from "../../assets/ordinary.png";   // two levels up: components/home -> src
import "./Hero.css";

/**
 * Hero section: text on the left, product image on the right.
 * Uses src/assets/skincare.png by default.
 * <Hero image={otherPhoto} />   -> use a different picture
 */
export default function Hero({ image = skincare, imageAlt = "Cherry Cheeks skincare product" }) {
  return (
    <section className="hero">
      <div className="container hero__inner">
        {/* Text */}
        <div className="hero__content">
          <p className="hero__pill">
            <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
            Natural skincare for everyone
          </p>

          <h1 className="hero__title">
            Glow Naturally &amp;
            <span> Shine Confidently</span>
          </h1>

          <p className="hero__text">
            Gentle, clean beauty and skincare made for your everyday glow.
            Discover products your skin will love.
          </p>

          <div className="hero__actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now
              <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link to="/products?category=skincare" className="btn btn-outline btn-lg">
              Explore Skincare
            </Link>
          </div>

          <div className="hero__proof">
            <span className="hero__stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            <p>
              <strong>4.9 / 5</strong> from 10,000+ happy customers
            </p>
          </div>
        </div>

        {/* Product */}
        <div className="hero__visual">
          <div className="hero__circle" aria-hidden="true" />

          {image ? (
            <img src={image} alt={imageAlt} className="hero__product" />
          ) : (
            <Sparkles size={96} strokeWidth={1} className="hero__placeholder" aria-hidden="true" />
          )}

          {/* Floating labels */}
          </div>
        </div>
  
    </section>
  );
}