import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Skincare", to: "/products?category=skincare" },
      { label: "Makeup", to: "/products?category=makeup" },
      { label: "Haircare", to: "/products?category=haircare" },
      { label: "Bodycare", to: "/products?category=bodycare" },
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
      { label: "hello@cherrycheeks.com", href: "mailto:hello@cherrycheeks.com" },
      { label: "+855 12 345 678", href: "tel:+85512345678" },
      { label: "Phnom Penh, Cambodia" }, // plain text, no link
    ],
  },
];

// TODO: replace with the client's real profile URLs
const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" />
      </>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    icon: (
      <>
        <path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 11.8a29 29 0 0 0 .5 5.3 2.8 2.8 0 0 0 2 2c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-5.3 29 29 0 0 0-.5-5.4z" />
        <polygon points="9.75 15 15.5 11.8 9.75 8.5 9.75 15" />
      </>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/",
    icon: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />,
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES = {
  invalid: "Please enter a valid email address.",
  failed: "Something went wrong. Please try again.",
  success: "Thanks for subscribing!",
};

function FooterLink({ to, href, label }) {
  if (to) return <Link to={to}>{label}</Link>;
  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {label}
      </a>
    );
  }
  return <span>{label}</span>;
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | invalid | failed

  const hasError = status === "invalid" || status === "failed";

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
        disabled={status === "loading"}
      />
      <button
        type="submit"
        className="footer__btn"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Joining..." : "Join"}
      </button>
      <p
        id="footer-status"
        className="footer__status"
        role="status"
        aria-live="polite"
      >
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
      <span aria-hidden="true">↑</span> Back to top
    </button>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          {/* Brand + newsletter */}
          <div className="footer__brand">
            <h2 className="footer__brand-title">Stay Glowing</h2>
            <p className="footer__newsletter">
              Join our newsletter and get 10% off your first order.
            </p>
            <Newsletter />
            <ul className="footer__socials">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    aria-label={`${s.name} (opens in a new tab)`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {s.icon}
                    </svg>
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