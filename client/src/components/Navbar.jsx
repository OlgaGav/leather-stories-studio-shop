import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";

const PRODUCTS = [
  { label: "Nomad", slug: "nomad" },
  { label: "Ranger", slug: "ranger" },
  { label: "Nomad Premium", slug: "nomad-premium" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const { items } = useCart();
  const cartCount = (items || []).reduce(
    (sum, i) => sum + (i.quantity || 0),
    0,
  );

  const isProductsActive = pathname.startsWith("/products/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname, search]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const goToSection = (id) => {
    setMenuOpen(false);
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate(`/?section=${id}`);
  };

  const navLinkClass =
    "font-body text-lg text-primary-foreground/80 hover:text-gold-accent tracking-wide transition-colors";
  const activeNavLinkClass = "font-body text-lg text-gold-accent tracking-wide transition-colors";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-espresso/95 backdrop-blur-md shadow-lg"
          : "bg-espresso/80"
      }`}
    >
      <div className="container px-6 flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center font-display text-2xl md:text-xl lg:text-xl text-primary-foreground"
        >
          <img
            src="/images/logo-light.png"
            alt="Leather Stories Studio Logo"
            className="h-12 w-12 md:h-10 md:w-10 mr-2"
          />
          Leather Stories{" "}
          <span className="font-script text-gold-accent text-3xl md:text-2xl lg:text-2xl leading-none ml-1">
            Studio
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <button
              type="button"
              onClick={() => goToSection("story")}
              className={navLinkClass}
            >
              Story
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => goToSection("products")}
              className={navLinkClass}
            >
              Shop
            </button>
          </li>

          {/* Products dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className={`flex items-center gap-1 ${isProductsActive ? activeNavLinkClass : navLinkClass}`}
              aria-expanded={dropdownOpen}
            >
              Products
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <ul className="absolute top-full right-0 mt-2 w-48 bg-espresso/95 backdrop-blur-md border border-primary-foreground/10 rounded-md shadow-lg py-1 animate-fade-in">
                {PRODUCTS.map(({ label, slug }) => {
                  const isActive = pathname === `/products/${slug}`;
                  return (
                    <li key={slug}>
                      <Link
                        to={`/products/${slug}`}
                        className={`block px-4 py-2.5 font-body text-sm tracking-wide transition-colors ${
                          isActive
                            ? "text-gold-accent"
                            : "text-primary-foreground/80 hover:text-gold-accent hover:bg-primary-foreground/5"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/cart"
              className={`relative ${navLinkClass}`}
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-gold-accent text-espresso text-[11px] font-semibold px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden text-primary-foreground"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-espresso/95 backdrop-blur-md border-t border-primary-foreground/10 animate-fade-in">
          <ul className="flex flex-col items-center gap-6 py-8">
            <li>
              <button
                type="button"
                onClick={() => goToSection("story")}
                className={navLinkClass}
              >
                Story
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => goToSection("products")}
                className={navLinkClass}
              >
                Shop
              </button>
            </li>

            {/* Mobile Products accordion */}
            <li className="w-full px-10 text-center">
              <button
                type="button"
                onClick={() => setMobileProductsOpen((v) => !v)}
                className={`flex items-center justify-center gap-1 w-full ${isProductsActive ? activeNavLinkClass : navLinkClass}`}
                aria-expanded={mobileProductsOpen}
              >
                Products
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {mobileProductsOpen && (
                <ul className="mt-3 flex flex-col gap-3 border-t border-primary-foreground/10 pt-3">
                  {PRODUCTS.map(({ label, slug }) => {
                    const isActive = pathname === `/products/${slug}`;
                    return (
                      <li key={slug}>
                        <Link
                          to={`/products/${slug}`}
                          onClick={() => setMenuOpen(false)}
                          className={`font-body text-base tracking-wide transition-colors ${
                            isActive
                              ? "text-gold-accent"
                              : "text-primary-foreground/70 hover:text-gold-accent"
                          }`}
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/cart"
                className={`relative ${navLinkClass}`}
                onClick={() => setMenuOpen(false)}
              >
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-gold-accent text-espresso text-[11px] font-semibold px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
