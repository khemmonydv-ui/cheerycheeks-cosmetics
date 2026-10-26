import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Sparkles, Star } from "lucide-react";
import skincare from "../../assets/skincare.png"; // two levels up: components/home -> src

// Little foam bubbles that rise behind the product
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

/**
 * Immersive hero:
 * - text and product slide in one after another
 * - product, labels and the big "GLOW" word move slightly with the mouse
 * - bubbles, soft blobs and a rotating badge keep it alive
 * Everything stops for people who turned on "reduce motion".
 */
export default function HeroShowcase({
  image,
  imageAlt = "Cherry Cheeks skincare product",
}) {
  const sectionRef = useRef(null);
  const src = image ?? skincare;

  // Mouse parallax: writes --mx and --my (-0.5 to 0.5) on the section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || touch) return undefined;
    <SectionHead
      eyebrow="From the journal"
      title="Tips, trends & insight"
      to="/blog"
      linkLabel="View all articles"
    />;
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
      {/* Soft drifting color blobs */}
      <div className="showcase__blob showcase__blob--1" aria-hidden="true" />
      <div className="showcase__blob showcase__blob--2" aria-hidden="true" />

      <div className="container showcase__inner">
        {/* ---------- Text ---------- */}
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

        {/* ---------- Visual ---------- */}
        <div className="showcase__visual">
          {/* Big outlined word behind the product */}
          <div
            className="showcase__layer showcase__layer--word"
            aria-hidden="true"
          >
            <span className="showcase__word">GLOW</span>
          </div>

          {/* Rising bubbles */}
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

          {/* Product */}
          <div className="showcase__layer showcase__layer--product">
            <img src={src} alt={imageAlt} className="showcase__product" />
          </div>

          {/* Floating labels */}
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

          {/* Rotating badge */}
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
                <text></text>
              </svg>
              <Leaf size={22} strokeWidth={1.75} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
