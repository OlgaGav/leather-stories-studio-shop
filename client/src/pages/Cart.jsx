import { useMemo, useState } from "react";
import { Truck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getColorName, getLeatherName } from "../utils/catalog";
import { getVariantImages } from "../utils/productImages";
import { productById } from "../utils/catalog";

function formatMoney(amount, currency = "USD") {
  const symbol =
    currency === "EUR" ? "€" : currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${Number(amount || 0).toFixed(2)}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function getFallbackImage(productId) {
  let image = "/images/placeholder.jpg"; // default placeholder

  // Try to find product-specific fallback
  try {
    const skuImages = getVariantImages(productById[productId], {});
    if (skuImages?.length) {
      image = skuImages[0];
    }
  } catch (e) {
    console.log("Error getting fallback image for product", {
      productId,
      error: e,
    });
  }

  return image;
}

function CartShippingNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3">
      <Truck size={16} className="mt-0.5 shrink-0 text-gold-accent" />
      <div>
        <p className="text-sm font-medium text-foreground">
          Free shipping in the US
        </p>
        <p className="text-sm text-muted-foreground">
          Your order ships free anywhere in the United States.
        </p>
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();

  const [email, setEmail] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailOk = useMemo(() => isValidEmail(email), [email]);
  const canCheckout = items.length > 0 && emailOk && !submitting;

  async function handleCheckout() {
    if (!items.length) return;

    setTouchedEmail(true);
    if (!emailOk) return;

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: Number(i.price),
          currency: (i.currency || "USD").toUpperCase(),
          colorId: i.colorId,
          leatherId: i.leatherId || "",
          personalization: i.personalization || null,
          quantity: parseInt(i.quantity, 10) || 1,
        })),
        customerEmail: email.trim(),
      };

      const res = await fetch(
        "/api/checkout/create-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Checkout API error:", res.status, data);
        alert(
          data?.error
            ? `Checkout failed: ${data.error}`
            : `Checkout failed (${res.status})`,
        );
        return;
      }

      if (data.url) {
        window.location.assign(data.url);
      } else {
        alert("Checkout failed: no URL returned");
      }
    } catch (e) {
      console.error(e);
      alert(e?.message || "Checkout failed");
    } finally {
      setSubmitting(false);
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
            {/* Email (required) */}
            <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-lg">
              <div className="font-display text-xl">Contact email</div>
              <p className="mt-2 text-lg text-muted-foreground">
                We’ll send your order confirmation here. This email will be
                pre-filled on Stripe Checkout.
              </p>

              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground">
                  Email <span className="text-destructive">*</span>
                </label>

                <input
                  className={`mt-2 w-full rounded-2xl border bg-background px-4 py-3 text-lg outline-none transition ${
                    touchedEmail && !emailOk
                      ? "border-destructive"
                      : "border-border focus:border-accent"
                  }`}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouchedEmail(true)}
                  required
                />

                {touchedEmail && !emailOk ? (
                  <div className="mt-2 text-sm text-destructive">
                    Please enter a valid email address.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {items.map((item) => {
                const imageSrc =
                  item.imageUrl ||
                  getFallbackImage(item.productId, {
                    colorId: item.colorId,
                    leatherId: item.leatherId,
                  });
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-lg md:flex-row md:items-center md:justify-between"
                  >
                    {/* Left: image + details */}
                    <div className="flex gap-5 min-w-0">
                      {/* Image */}
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-background/40">
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = getFallbackImage(
                              item.productId,
                              {
                                colorId: item.colorId,
                                leatherId: item.leatherId,
                              },
                            );
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <div className="font-medium text-foreground">
                            {item.name}
                          </div>
                          <div className="text-lg text-muted-foreground">
                            {formatMoney(item.price, item.currency)}
                            <span className="text-muted-foreground/70">
                              {" "}
                              / ea
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1 text-lg text-muted-foreground">
                          <div>
                            Color:{" "}
                            <span className="text-foreground">
                              {getColorName(item.productId, item.colorId)}
                            </span>
                          </div>

                          {item.leatherId ? (
                            <div>
                              Leather:{" "}
                              <span className="text-foreground">
                                {getLeatherName(item.productId, item.leatherId)}
                              </span>
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
                    </div>

                    {/* Right: quantity + subtotal */}
                    <div className="flex items-center justify-between gap-6 md:justify-end">
                      <div className="flex items-center gap-2">
                        <button
                          className="h-10 w-10 rounded-full border border-border bg-background text-lg hover:bg-muted transition"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <div className="w-10 text-center text-lg font-medium">
                          {item.quantity}
                        </div>

                        <button
                          className="h-10 w-10 rounded-full border border-border bg-background text-lg hover:bg-muted transition"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
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
                          {formatMoney(
                            Number(item.price) * Number(item.quantity),
                            item.currency,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total + Checkout */}
            <div className="mt-10 rounded-3xl border border-border bg-card p-7 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="font-display text-xl">Total</div>
                <div className="font-display text-xl text-accent">
                  {formatMoney(total, items[0]?.currency || "USD")}
                </div>
              </div>

              <div className="mt-6">
                <CartShippingNotice />
              </div>

              <button
                className="mt-4 w-full rounded-full bg-accent px-6 py-3 text-lg font-medium tracking-wide text-accent-foreground shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={!canCheckout}
              >
                {submitting ? "Redirecting…" : "Checkout"}
              </button>

              <p className="mt-3 text-lg text-muted-foreground">
                You’ll complete payment securely on Stripe.
              </p>

              {!emailOk && touchedEmail ? (
                <p className="mt-2 text-sm text-destructive">
                  Email is required to proceed to checkout.
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
