import { useEffect, useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import logo from "../../assets/logo.svg";
import "./Header.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about Us" },
  { label: "Product", href: "/product" },
  { label: "Contact", href: "/contact" },
];

const ICON_PROPS = { size: 24, strokeWidth: 1.75, "aria-hidden": true };

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  // Shadow appears once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu with Escape, lock body scroll while open
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (href) => {
    setActivePath(href);
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="container header__inner">
        {/* Logo */}
        <a href="/" className="header__logo" aria-label="Cherry Cheeks home">
          <img src={logo} alt="Cherry Cheeks" className="header__logo-img" />
        </a>

        {/* Navigation */}
        <nav
          id="main-nav"
          className={`header__nav ${menuOpen ? "header__nav--open" : ""}`}
          aria-label="Main navigation"
        >
          <ul className="header__links">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`header__link ${activePath === href ? "is-active" : ""}`}
                  aria-current={activePath === href ? "page" : undefined}
                  onClick={() => handleNavClick(href)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          <button type="button" className="header__icon-btn" aria-label="Search">
            <Search {...ICON_PROPS} />
          </button>
          <a href="/account" className="header__icon-btn" aria-label="My account">
            <User {...ICON_PROPS} />
          </a>
          <a href="/cart" className="header__icon-btn" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBag {...ICON_PROPS} />
            <span className="header__badge">{cartCount > 99 ? "99+" : cartCount}</span>
          </a>

          <button
            type="button"
            className="header__icon-btn header__burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X {...ICON_PROPS} /> : <Menu {...ICON_PROPS} />}
          </button>
        </div>
      </div>

      {/* Dim backdrop behind the mobile menu */}
      {menuOpen && <div className="header__backdrop" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}