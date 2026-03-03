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
          <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
          <p className="mt-2 text-neutral-600">
            Select color/leather, add personalization, then order.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onOrderNow={orderNow} />
        ))}
      </div>
    </section>
  );
}