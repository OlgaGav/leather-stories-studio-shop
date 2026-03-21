import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import SiteLayout from "./layouts/SiteLayout";
import Success from "./pages/Success";
import ProductDetailsPage from "./components/ProductDetailsPage";
import ReturnPolicy from "./pages/ReturnPolicy";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // When navigating to a section target, let Index handle the scroll
    if (new URLSearchParams(search).get("section")) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, search]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Pages that should have Navbar + Footer */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<Success />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
        </Route>

        {/* Admin page */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
