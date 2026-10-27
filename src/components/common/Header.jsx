import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import logo from "../../assets/images/Logo.png";
import "./Header.css";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Product", to: "/products" },
  { label: "Contact", to: "/contact" },
];

const ICON_PROPS = { size: 24, strokeWidth: 1.75, "aria-hidden": true };

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Close menu and search whenever the page changes
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Shadow gets deeper once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes everything, body scroll is locked while the menu is open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen((o) => !o);
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen((o) => !o);
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/product?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="container header__inner">
        {/* Burger: left on mobile, hidden on desktop */}
        <button
          type="button"
          className="header__icon-btn header__burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={toggleMenu}
        >
          {menuOpen ? <X {...ICON_PROPS} /> : <Menu {...ICON_PROPS} />}
        </button>

        {/* Logo: center on mobile, left on desktop */}
        <Link to="/" className="header__logo" aria-label="Cherry Cheeks home">
          <img src={logo} alt="Cherry Cheeks" className="header__logo-img" />
        </Link>

        {/* Navigation */}
        <nav
          id="main-nav"
          className={`header__nav ${menuOpen ? "header__nav--open" : ""}`}
          aria-label="Main navigation"
        >
          <ul className="header__links">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `header__link ${isActive ? "is-active" : ""}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}

            {/* Only shown inside the mobile menu */}
            <li className="header__mobile-only">
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `header__link ${isActive ? "is-active" : ""}`
                }
              >
                My Account
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Actions: search + cart on mobile, plus account on desktop */}
        <div className="header__actions">
          <button
            type="button"
            className={`header__icon-btn ${searchOpen ? "is-active" : ""}`}
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
            onClick={toggleSearch}
          >
            {searchOpen ? <X {...ICON_PROPS} /> : <Search {...ICON_PROPS} />}
          </button>

          <Link
            to="/account"
            className="header__icon-btn header__account"
            aria-label="My account"
          >
            <User {...ICON_PROPS} />
          </Link>

          <Link
            to="/cart"
            className="header__icon-btn"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingBag {...ICON_PROPS} />
            <span className="header__badge">{cartCount > 99 ? "99+" : cartCount}</span>
          </Link>
        </div>
      </div>

      {/* Search bar drops down under the header */}
      {searchOpen && (
        <div className="header__search">
          <form className="container header__search-form" onSubmit={handleSearch} role="search">
            <input
              type="search"
              className="input"
              placeholder="Search products..."
              aria-label="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Dim backdrop behind the mobile menu */}
      {menuOpen && <div className="header__backdrop" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}