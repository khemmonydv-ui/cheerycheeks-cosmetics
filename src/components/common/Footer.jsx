import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowUp,
  LoaderCircle,
} from "lucide-react";
import "./Footer.css";




/* ---------- Brand icons ----------
   Lucide v1 removed ALL brand logos (Facebook, Instagram, Youtube...), so
   these four are small custom SVGs drawn in the same style. They take the
   same props as a Lucide icon (size, strokeWidth). */
function SvgIcon({ size = 20, strokeWidth = 1.75, children, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

const InstagramIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" />
  </SvgIcon>
);

const FacebookIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </SvgIcon>
);

const YoutubeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 11.8a29 29 0 0 0 .5 5.3 2.8 2.8 0 0 0 2 2c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-5.3 29 29 0 0 0-.5-5.4z" />
    <polygon points="9.75 15 15.5 11.8 9.75 8.5 9.75 15" />
  </SvgIcon>
);

const TikTokIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </SvgIcon>
);

/* ---------- Data ---------- */
const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/product" },
      { label: "Skincare", to: "/product?category=skincare" },
      { label: "Makeup", to: "/product?category=makeup" },
      { label: "Haircare", to: "/product?category=haircare" },
      { label: "Bodycare", to: "/product?category=bodycare" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "FAQs", to: "/faq" },
      { label: "Shipping & Delivery", to: "/shipping" },
      { label: "Returns & Refunds", to: "/returns" },
      { label: "Track Your Order", to: "/track-order" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Story", to: "/story" },
      { label: "Blog", to: "/blog" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Contact Us",
    links: [
      { label: "hello@cherrycheeks.com", href: "mailto:hello@cherrycheeks.com", icon: Mail },
      { label: "+855 12 345 678", href: "tel:+85512345678", icon: Phone },
      { label: "Phnom Penh, Cambodia", icon: MapPin }, // plain text, no link
    ],
  },
];

// TODO: replace with your real profile URLs
const socials = [
  { name: "Instagram", href: "https://www.instagram.com/", Icon: InstagramIcon },
  { name: "Facebook", href: "https://www.facebook.com/", Icon: FacebookIcon },
  { name: "YouTube", href: "https://www.youtube.com/", Icon: YoutubeIcon },
  { name: "TikTok", href: "https://www.tiktok.com/", Icon: TikTokIcon },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES = {
  invalid: "Please enter a valid email address.",
  failed: "Something went wrong. Please try again.",
  success: "Thanks for subscribing!",
};

/* ---------- Pieces ---------- */
function FooterLink({ to, href, label, icon: Icon }) {
  const content = (
    <>
      {Icon && <Icon size={16} strokeWidth={1.75} aria-hidden="true" />}
      <span>{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className="footer__link">
        {content}
      </Link>
    );
  }

  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className="footer__link"
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {content}
      </a>
    );
  }

  return <span className="footer__link">{content}</span>;
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | invalid | failed

  const hasError = status === "invalid" || status === "failed";
  const loading = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();

    if (!EMAIL_RE.test(value)) {
      setStatus("invalid");
      return;
    }

    setStatus("loading");
    try {
      // TODO: replace this fake delay with your real API / mailing service call
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <form className="footer__form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="footer-email" className="visually-hidden">
        Email address
      </label>
      <input
        id="footer-email"
        className="footer__input"
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle" && status !== "loading") setStatus("idle");
        }}
        autoComplete="email"
        aria-invalid={hasError}
        aria-describedby="footer-status"
        disabled={loading}
      />
      <button type="submit" className="footer__btn" disabled={loading}>
        {loading ? (
          <>
            <LoaderCircle size={16} strokeWidth={2} className="footer__spin" aria-hidden="true" />
            Joining...
          </>
        ) : (
          <>
            Join
            <Send size={16} strokeWidth={2} aria-hidden="true" />
          </>
        )}
      </button>
      <p id="footer-status" className="footer__status" role="status" aria-live="polite">
        {MESSAGES[status] ?? ""}
      </p>
    </form>
  );
}

function BackToTop() {
  const handleClick = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button type="button" className="footer__top" onClick={handleClick}>
      <ArrowUp size={16} strokeWidth={2} aria-hidden="true" />
      Back to top
    </button>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* .container = same width and side padding as the header */}
      <div className="container">
        <div className="footer__grid">
          {/* Brand + newsletter */}
          <div className="footer__brand">
            <h2 className="footer__brand-title">Stay Glowing</h2>
            <p className="footer__newsletter">
              Join our newsletter and get 10% off your first order.
            </p>
            <Newsletter />
            <ul className="footer__socials">
              {socials.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    aria-label={`${name} (opens in a new tab)`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((col) => {
            const headingId = `footer-${col.title.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <div key={col.title} className="footer__column">
                <h3 id={headingId} className="footer__title">
                  {col.title}
                </h3>
                <ul className="footer__links" aria-labelledby={headingId}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {year} Cherry Cheeks Beauty. All Rights Reserved
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}

export default Footer;