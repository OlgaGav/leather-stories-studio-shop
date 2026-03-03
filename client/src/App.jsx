import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import SiteLayout from "./layouts/SiteLayout";
import Success from "./pages/Success";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

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
        </Route>

        {/* Admin page */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
