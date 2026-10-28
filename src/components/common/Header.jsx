import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

// FIX 1: Import useCart
import { useCart } from "../../context/CartContext";

import logo from "../../assets/images/Logo.png";
import "./Header.css";

// Navigation links
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Product", to: "/products" },
  { label: "Contact", to: "/contact" },
];

const ICON_PROPS = {
  size: 24,
  strokeWidth: 1.75,
  "aria-hidden": true,
};

export default function Header() {
  // Get cart count from CartContext
  const { cartCount = 0 } = useCart();

  // States
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // React Router
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Close menu and search when page changes
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Add shadow when scrolling
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close menu using Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);

    document.body.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setSearchOpen(false);
  };

  // Toggle search bar
  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
    setMenuOpen(false);
  };

  // Handle product search
  const handleSearch = (e) => {
    e.preventDefault();

    const q = query.trim();

    if (!q) return;

    // FIX 2: Correct route
    navigate(`/products?q=${encodeURIComponent(q)}`);

    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header
      className={`header ${
        scrolled ? "header--scrolled" : ""
      }`}
    >
      <div className="container header__inner">

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="header__icon-btn header__burger"
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <X {...ICON_PROPS} />
          ) : (
            <Menu {...ICON_PROPS} />
          )}
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="header__logo"
          aria-label="Cherry Cheeks home"
        >
          <img
            src={logo}
            alt="Cherry Cheeks"
            className="header__logo-img"
          />
        </Link>

        {/* Navigation */}
        <nav
          id="main-nav"
          className={`header__nav ${
            menuOpen ? "header__nav--open" : ""
          }`}
          aria-label="Main navigation"
        >
          <ul className="header__links">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `header__link ${
                      isActive ? "is-active" : ""
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}

            {/* Mobile Account Link */}
            <li className="header__mobile-only">
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `header__link ${
                    isActive ? "is-active" : ""
                  }`
                }
              >
                My Account
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header__actions">

          {/* Search Button */}
          <button
            type="button"
            className={`header__icon-btn ${
              searchOpen ? "is-active" : ""
            }`}
            aria-label={
              searchOpen ? "Close search" : "Search"
            }
            aria-expanded={searchOpen}
            onClick={toggleSearch}
          >
            {searchOpen ? (
              <X {...ICON_PROPS} />
            ) : (
              <Search {...ICON_PROPS} />
            )}
          </button>

          {/* Account Button */}
          <Link
            to="/account"
            className="header__icon-btn header__account"
            aria-label="My account"
          >
            <User {...ICON_PROPS} />
          </Link>

          {/* Shopping Cart */}
          <Link
            to="/cart"
            className="header__icon-btn"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingBag {...ICON_PROPS} />

            <span className="header__badge">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          </Link>

        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="header__search">
          <form
            className="container header__search-form"
            onSubmit={handleSearch}
            role="search"
          >
            <input
              type="search"
              className="input"
              placeholder="Search products..."
              aria-label="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />

            <button
              type="submit"
              className="btn btn-primary btn-sm"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Backdrop */}
      {menuOpen && (
        <div
          className="header__backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}