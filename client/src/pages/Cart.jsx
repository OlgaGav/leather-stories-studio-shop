import { useCart } from "../context/CartContext";

function formatMoney(amount, currency = "EUR") {
  const symbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${amount.toFixed(2)}`;
}

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();

  async function handleCheckout() {
    if (!items.length) return;

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/checkout/create-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            currency: i.currency || "EUR",
            colorId: i.colorId,
            leatherId: i.leatherId || "",
            personalization: i.personalization || null,
            quantity: i.quantity,
          })),
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data?.error || "Checkout failed");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Checkout failed: no URL returned");
    }
  }

  return (
    <div className="w-full bg-background text-foreground">
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-2xl tracking-[0.22em] uppercase text-gold-accent pt-5">
              Your selection
            </p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">Cart</h1>
            <p className="mt-2 font-body text-lg text-muted-foreground">
              Review your items before checkout.
            </p>
          </div>

          {items.length > 0 && (
            <button
              className="rounded-full border border-border bg-background px-5 py-2 text-lg font-medium hover:bg-muted transition"
              onClick={clearCart}
            >
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
            <div className="font-display text-xl">Your cart is empty.</div>
            <p className="mt-2 text-lg text-muted-foreground">
              Browse products and add your favorites.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-lg md:flex-row md:items-center md:justify-between"
                >
                  {/* Left: details */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <div className="font-medium text-foreground">
                        {item.name}
                      </div>
                      <div className="text-lg text-muted-foreground">
                        {formatMoney(item.price, item.currency)}
                        <span className="text-muted-foreground/70"> / ea</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1 text-lg text-muted-foreground">
                      <div>
                        Color:{" "}
                        <span className="text-foreground">{item.colorId}</span>
                      </div>

                      {item.leatherId ? (
                        <div>
                          Leather:{" "}
                          <span className="text-foreground">{item.leatherId}</span>
                        </div>
                      ) : null}

                      {item.personalization?.text ? (
                        <div>
                          Personalization:{" "}
                          <span className="text-foreground">
                            “{item.personalization.text}”
                          </span>
                          {item.personalization.fontId ? (
                            <span className="text-muted-foreground">
                              {" "}
                              ({item.personalization.fontId})
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <button
                      className="mt-4 inline-flex text-lg text-destructive hover:underline"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  {/* Right: quantity + subtotal */}
                  <div className="flex items-center justify-between gap-6 md:justify-end">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        className="h-10 w-10 rounded-full border border-border bg-background text-lg hover:bg-muted transition"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <div className="w-10 text-center text-lg font-medium">
                        {item.quantity}
                      </div>

                      <button
                        className="h-10 w-10 rounded-full border border-border bg-background text-lg hover:bg-muted transition"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Subtotal
                      </div>
                      <div className="font-semibold text-foreground">
                        {formatMoney(item.price * item.quantity, item.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total + Checkout */}
            <div className="mt-10 rounded-3xl border border-border bg-card p-7 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="font-display text-xl">Total</div>
                <div className="font-display text-xl text-accent">
                  {formatMoney(total, items[0]?.currency || "EUR")}
                </div>
              </div>

              <button
                className="mt-6 w-full rounded-full bg-accent px-6 py-3 text-lg font-medium tracking-wide text-accent-foreground shadow-lg hover:opacity-90 transition"
                onClick={handleCheckout}
              >
                Checkout
              </button>

              <p className="mt-3 text-lg text-muted-foreground">
                You’ll complete payment securely on Stripe.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}