import ProductCard from "./ProductCard";
import { products } from "../data/products";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const orderNow = (cartItem) => {
    addToCart({ ...cartItem, quantity: 1 });
    navigate("/cart");
  };

  return (
    <section id="products" className="mx-auto max-w-6xl px-6 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-gold-accent tracking-[0.3em] uppercase text-lg mb-6">Our collection</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Select model, color, then order.
          </p>
        </div>
      </div>

      {/* Multi-wallet promo */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl bg-accent/10 border border-accent/25 px-5 py-3 text-sm font-medium text-accent w-fit">
        <span>🎁</span>
        <span>Buy 2 or more wallets and get <strong>10% off</strong> your order.</span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onOrderNow={orderNow} />
        ))}
      </div>
    </section>
  );
}