import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { formatMoneyFromCents } from "../utils/productVariant";
import { useCart } from "../context/CartContext";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  const { clearCart } = useCart();
  const didClearRef = useRef(false);

  function shouldClearForSession(sessionId) {
    try {
      const key = "leather_cart_last_cleared_session";
      return localStorage.getItem(key) !== sessionId;
    } catch {
      return true;
    }
  }

  function markCleared(sessionId) {
    try {
      localStorage.setItem("leather_cart_last_cleared_session", sessionId);
    } catch {}
  }

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setTimedOut(false);
      setOrder(null);
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const maxAttempts = 12; // 12 * 2s = 24s
    const intervalMs = 2000;

    async function load() {
      try {
        const res = await fetch(`/api/order/session/${sessionId}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        // Success: got an order object
        if (res.ok && data && !data.error) {
          setOrder(data);
          setLoading(false);
          setTimedOut(false);

          if (!didClearRef.current && shouldClearForSession(sessionId)) {
            clearCart();
            markCleared(sessionId);
            didClearRef.current = true;
          }
          return;
        }

        const msg = String(data?.error || "").toLowerCase();
        const isFinalizing =
          res.status === 202 ||
          res.status === 409 ||
          res.status === 404 || // often "not created yet"
          msg.includes("finalizing") ||
          msg.includes("processing") ||
          msg.includes("paid");

        // Keep waiting (webhook delay)
        if (isFinalizing && attempts < maxAttempts) {
          attempts += 1;
          setTimeout(load, intervalMs);
          return;
        }

        // Timeout / stop retrying
        setLoading(false);
        setTimedOut(true);
      } catch {
        if (!cancelled) {
          setLoading(false);
          setTimedOut(true);
        }
      }
    }

    // reset state for this session
    setLoading(true);
    setTimedOut(false);
    setOrder(null);

    load();

    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  const totalText = useMemo(() => {
    if (!order) return "";
    return formatMoneyFromCents(order.amountTotal, order.currency || "USD");
  }, [order]);

  // Shared layout wrappers (theme)
  const Page = ({ children }) => (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-16">{children}</div>
    </div>
  );

  const Card = ({ children }) => (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      {children}
    </div>
  );

  const PrimaryLink = ({ to, children }) => (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium tracking-wide text-accent-foreground shadow-sm transition hover:opacity-90"
    >
      {children}
    </Link>
  );

  const SecondaryLink = ({ to, children }) => (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium tracking-wide text-foreground transition hover:bg-muted"
    >
      {children}
    </Link>
  );

  if (!sessionId) {
    return (
      <Page>
        <div className="mx-auto max-w-2xl">
          <Card>
            <h1 className="font-display text-2xl md:text-3xl">Missing session_id</h1>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              This page needs a Stripe session id in the URL.
            </p>
            <div className="mt-8">
              <PrimaryLink to="/">Go back home</PrimaryLink>
            </div>
          </Card>
        </div>
      </Page>
    );
  }

  // Loading state (still polling)
  if (loading) {
    return (
      <Page>
        <div className="mx-auto max-w-2xl">
          <Card>
            <p className="text-[11px] tracking-[0.22em] uppercase text-gold-accent">
              Payment received
            </p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">
              Thank you for your order!
            </h1>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              We’re finalizing your order details. This can take a few seconds.
            </p>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 animate-pulse bg-accent/70" />
            </div>
          </Card>
        </div>
      </Page>
    );
  }

  // Finished polling but still no order
  if (!order && timedOut) {
    return (
      <Page>
        <div className="mx-auto max-w-2xl">
          <Card>
            <p className="text-[11px] tracking-[0.22em] uppercase text-gold-accent">
              Payment processing
            </p>

            <h1 className="mt-3 font-display text-3xl md:text-4xl">
              Thank you for your order!
            </h1>

            <p className="mt-3 font-body text-sm text-muted-foreground">
              Your payment is still processing. You will receive an email update
              when processing is completed.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex items-center justify-center rounded-full bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-primary-foreground transition hover:opacity-90"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
              <SecondaryLink to="/">Home</SecondaryLink>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Session: <span className="font-mono">{sessionId}</span>
            </p>
          </Card>
        </div>
      </Page>
    );
  }

  // If loading is false and order is still null (rare), show same processing UX
  if (!order) {
    return (
      <Page>
        <div className="mx-auto max-w-2xl">
          <Card>
            <p className="text-[11px] tracking-[0.22em] uppercase text-gold-accent">
              Payment processing
            </p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">
              Thank you for your order!
            </h1>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Your payment is still processing. You will receive an email update
              when processing is completed.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex items-center justify-center rounded-full bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-primary-foreground transition hover:opacity-90"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
              <SecondaryLink to="/">Home</SecondaryLink>
            </div>
          </Card>
        </div>
      </Page>
    );
  }

  // Order confirmed (we have full details)
  return (
    <Page>
      <div className="mx-auto max-w-3xl pt-6">
        <Card>
          <p className="text-[11px] tracking-[0.22em] uppercase text-gold-accent">
            Order confirmed
          </p>

          <h1 className="mt-3 font-display text-3xl md:text-4xl">
            Thank you for your order!
          </h1>

          <p className="mt-3 font-body text-sm text-muted-foreground">
            A confirmation email has been sent to{" "}
            <span className="font-medium text-foreground">
              {order.customerEmail}
            </span>
            .
          </p>

          <div className="mt-7 rounded-2xl border border-border bg-background/60 p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Order reference
            </div>
            <div className="mt-1 font-medium text-foreground">
              {order.orderRef || order.stripeSessionId}
            </div>
          </div>

          <h2 className="mt-10 font-display text-xl">Items</h2>

          <div className="mt-4 space-y-4">
            {(order.items || []).map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="rounded-2xl border border-border bg-background/40 p-4"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="font-medium text-foreground">
                      {item.name || item.productId}
                    </div>

                    <div className="mt-1 text-sm text-muted-foreground">
                      Color:{" "}
                      <span className="text-foreground">{item.colorId}</span>
                      {item.leatherId ? (
                        <>
                          {" "}
                          • Leather:{" "}
                          <span className="text-foreground">{item.leatherId}</span>
                        </>
                      ) : null}
                    </div>

                    {item.personalizationText ? (
                      <div className="mt-1 text-sm text-muted-foreground">
                        Personalization:{" "}
                        <span className="text-foreground">
                          “{item.personalizationText}”
                        </span>
                        {item.personalizationFont ? (
                          <span className="text-muted-foreground">
                            {" "}
                            ({item.personalizationFont})
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-1 text-sm text-muted-foreground">
                      Quantity:{" "}
                      <span className="text-foreground">{item.quantity}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="font-semibold text-foreground">
                      {item.currency === "USD"
                        ? "$"
                        : item.currency === "EUR"
                          ? "€"
                          : `${item.currency} `}
                      {Number(item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between rounded-2xl border border-border bg-background/60 px-5 py-4">
            <div className="font-display text-lg">Total paid</div>
            <div className="font-display text-lg text-accent">{totalText}</div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink to="/">Back to shop</PrimaryLink>
            <SecondaryLink to="/cart">View cart</SecondaryLink>
          </div>
        </Card>
      </div>
    </Page>
  );
};

export default Success;