import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Hero from "../components/Hero";
import Story from "../components/Story";
import Products from "../components/Products";

const Index = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    const section = params.get("section");
    if (!section) return;

    // setTimeout gives the DOM time to settle after navigation
    // before we attempt to scroll (avoids race with ScrollToTop)
    const timer = setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => clearTimeout(timer);
  }, [params]);

  return (
    <>
      <Hero />
      <Story />
      <Products />
    </>
  );
};

export default Index;