import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext"; // adjust path if needed

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const { items } = useCart();
  const cartCount = (items || []).reduce(
    (sum, i) => sum + (i.quantity || 0),
    0,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, search]);

  // Scroll helper (works after navigation too)
  const goToSection = (id) => {
    setMenuOpen(false);

    // if already on home page, just scroll
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // otherwise navigate to home with query param; Index will scroll on load
    navigate(`/?section=${id}`);
  };

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
              className="font-body text-lg text-primary-foreground/80 hover:text-gold-accent tracking-wide transition-colors"
            >
              Story
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => goToSection("products")}
              className="font-body text-lg text-primary-foreground/80 hover:text-gold-accent tracking-wide transition-colors"
            >
              Shop
            </button>
          </li>

          <li>
            <Link
              to="/cart"
              className="relative font-body text-lg text-primary-foreground/80 hover:text-gold-accent tracking-wide transition-colors"
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
                className="font-body text-lg text-primary-foreground/80 hover:text-gold-accent tracking-wide transition-colors"
              >
                Story
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => goToSection("products")}
                className="font-body text-lg text-primary-foreground/80 hover:text-gold-accent tracking-wide transition-colors"
              >
                Shop
              </button>
            </li>

            <li>
              <Link
                to="/cart"
                className="relative font-body text-lg text-primary-foreground/80 hover:text-gold-accent tracking-wide transition-colors"
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
