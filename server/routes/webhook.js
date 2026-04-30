import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import PaymentIssueNotification from "../models/PaymentIssueNotification.js";
import sendEmail, { sendPaymentIssueEmail } from "../utils/mailer.js";
import { extractShippingAddress } from "../utils/extractShippingAddress.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function safeParseItems(session) {
  try {
    const meta = session.metadata || {};

    // Reassemble chunked format: items_0, items_1, ...
    const chunks = [];
    for (let i = 0; `items_${i}` in meta; i++) {
      chunks.push(meta[`items_${i}`]);
    }
    if (chunks.length > 0) {
      const parsed = JSON.parse(chunks.join(""));
      return Array.isArray(parsed) ? parsed : [];
    }

    // Fallback: legacy single-key format
    const raw = meta.items;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Expand compact metadata items to the shape expected by mailer helpers.
function expandCompactItems(compactItems = []) {
  return compactItems.map((i) => ({
    productId: i.productId,
    name: i.name || i.productId,
    colorId: i.colorId,
    leatherId: i.leatherId || "",
    personalizationText: i.pText || i.personalizationText || "",
    personalizationFont: i.pFont || i.personalizationFont || "",
    personalizationFontName: i.pFontName || i.personalizationFontName || "",
    quantity: i.qty || i.quantity || 1,
    price: i.price || 0,
    currency: i.cur || i.currency || "USD",
  }));
}

function getEnvironment() {
  return process.env.NODE_ENV === "production" ? "production" : "staging";
}

// Build a payment issue details object from a Stripe Checkout Session.
function buildSessionIssueDetails(session, eventType, errorReason = null) {
  const items = expandCompactItems(safeParseItems(session));
  const shippingAddress = extractShippingAddress(session);

  return {
    eventType,
    paymentStatus: session.payment_status || "unknown",
    paymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
    stripeSessionId: session.id,
    customerEmail: session.customer_email || null,
    customerName: session.customer_details?.name || null,
    orderRef: session.metadata?.orderRef || null,
    items,
    amountTotal: session.amount_total || 0,
    currency: (session.currency || "usd").toUpperCase(),
    shippingAddress,
    orderNotes: session.metadata?.orderNotes || null,
    errorReason,
    timestamp: new Date(),
    environment: getEnvironment(),
  };
}

// Build a minimal payment issue details object from a Stripe PaymentIntent
// (used when no checkout session is found).
function buildPaymentIntentIssueDetails(pi, eventType) {
  return {
    eventType,
    paymentStatus: pi.status || "unknown",
    paymentIntentId: pi.id,
    stripeSessionId: null,
    customerEmail: null,
    customerName: null,
    orderRef: null,
    items: [],
    amountTotal: pi.amount || 0,
    currency: (pi.currency || "usd").toUpperCase(),
    shippingAddress: null,
    orderNotes: null,
    errorReason: pi.last_payment_error?.message || null,
    timestamp: new Date(),
    environment: getEnvironment(),
  };
}

// Send a payment issue warning email with deduplication.
// identifier — stripeSessionId or paymentIntentId (used as dedup key).
// eventType  — Stripe event type (or internal label like "order.create.failed").
async function notifyPaymentIssue(identifier, eventType, details) {
  try {
    await PaymentIssueNotification.create({ identifier, eventType });
  } catch (e) {
    if (e.code === 11000) {
      console.log(
        `ℹ️  Payment issue email already sent for ${identifier} / ${eventType} — skipping`
      );
      return;
    }
    // Non-duplicate error — log but still try to send the email
    console.error("⚠️ Failed to save PaymentIssueNotification:", e.message);
  }

  try {
    await sendPaymentIssueEmail(details);
    console.log(`📧 Payment issue email sent for ${identifier} / ${eventType}`);
  } catch (e) {
    console.error("❌ Failed to send payment issue email:", e.message);
  }
}

const stripeWebhook = (app) => {
  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET,
        );
      } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // ── checkout.session.completed ──────────────────────────────────────────
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        console.log(
          "📦 Webhook checkout.session.completed — session:", session.id,
          "payment_status:", session.payment_status,
          "customer_email:", session.customer_email,
        );

        const isPaid =
          session.payment_status === "paid" || session.status === "complete";

        if (!isPaid) {
          console.warn(
            "⚠️ checkout.session.completed but payment_status is not paid:",
            session.payment_status, "— session:", session.id,
          );
          const details = buildSessionIssueDetails(
            session,
            event.type,
            `Session completed but payment_status is "${session.payment_status}"`,
          );
          notifyPaymentIssue(session.id, event.type, details).catch(() => {});
          return res.json({ received: true });
        }

        // Idempotency guard — Stripe may retry the webhook.
        // If the order exists but shippingAddress was never persisted, patch it now.
        const existing = await Order.findOne({ stripeSessionId: session.id });
        if (existing) {
          if (!existing.shippingAddress) {
            const shippingAddress = extractShippingAddress(session);
            if (shippingAddress) {
              await Order.updateOne(
                { _id: existing._id },
                { $set: { shippingAddress } },
              );
              console.log(
                "✅ Patched missing shippingAddress for order:", existing._id,
                "session:", session.id,
              );
            } else {
              console.error(
                "❌ Shipping address still missing on webhook replay for session:", session.id,
                "— manual follow-up required.",
                {
                  collected_information: session.collected_information,
                  customer_details: session.customer_details,
                },
              );
            }
          } else {
            console.log("ℹ️  Duplicate webhook for session:", session.id, "— skipping");
          }
          return res.json({ received: true });
        }

        try {
          const items = safeParseItems(session);

          const orderItems = items.map((i) => ({
            productId: i.productId,
            name: i.name || i.productId,
            colorId: i.colorId,
            leatherId: i.leatherId || "",
            personalizationText: i.pText || i.personalizationText || "",
            personalizationFont: i.pFont || i.personalizationFont || "",
            personalizationFontName: i.pFontName || i.personalizationFontName || "",
            quantity: i.qty || i.quantity || 1,
            price: i.price || 0,
            currency: i.cur || session.currency?.toUpperCase() || "EUR",
          }));

          // Extract shipping address from Stripe session data
          const shippingAddress = extractShippingAddress(session);
          if (!shippingAddress) {
            // Payment was taken — we must still create the order so it isn't lost.
            // Log an actionable error for manual follow-up.
            console.error(
              "❌ Shipping address missing or incomplete for session:", session.id,
              "— order will be created WITHOUT shipping address. Manual follow-up required.",
              {
                collected_information: session.collected_information,
                customer_details: session.customer_details,
              },
            );
          }

          const order = await Order.create({
            stripeSessionId: session.id,
            orderRef: session.metadata?.orderRef || "",
            items: orderItems,
            amountTotal: session.amount_total,
            amountTax: session.total_details?.amount_tax || 0,
            currency: (session.currency || "eur").toUpperCase(),
            customerEmail: session.customer_email,
            paymentStatus: "paid",
            shippingAddress,
            orderNotes: session.metadata?.orderNotes || "",
          });

          console.log("✅ Order saved:", order._id, "session:", session.id);

          sendEmail(order).catch((e) =>
            console.error("❌ Email sending failed:", e.message),
          );
        } catch (err) {
          console.error("❌ Order create failed for session:", session.id, "—", err?.message);
          if (err?.errors) {
            console.error("❌ Validation errors:", JSON.stringify(err.errors, null, 2));
          }
          console.error(err);

          // Notify owner so the paid-but-unrecorded order can be investigated manually.
          const details = buildSessionIssueDetails(
            session,
            "order.create.failed",
            err?.message || "Order creation failed after successful payment",
          );
          notifyPaymentIssue(session.id, "order.create.failed", details).catch(() => {});

          // Return 200 so Stripe does not retry — the error needs manual investigation.
        }
      }

      // ── checkout.session.async_payment_failed ───────────────────────────────
      else if (event.type === "checkout.session.async_payment_failed") {
        const session = event.data.object;
        console.warn(
          "⚠️ checkout.session.async_payment_failed — session:", session.id,
          "customer:", session.customer_email,
        );
        const details = buildSessionIssueDetails(session, event.type);
        notifyPaymentIssue(session.id, event.type, details).catch(() => {});
      }

      // ── checkout.session.expired ────────────────────────────────────────────
      else if (event.type === "checkout.session.expired") {
        const session = event.data.object;
        console.warn(
          "⚠️ checkout.session.expired — session:", session.id,
          "customer:", session.customer_email,
        );
        const details = buildSessionIssueDetails(session, event.type);
        notifyPaymentIssue(session.id, event.type, details).catch(() => {});
      }

      // ── payment_intent.payment_failed ───────────────────────────────────────
      else if (event.type === "payment_intent.payment_failed") {
        const pi = event.data.object;
        const errorReason = pi.last_payment_error?.message || null;
        console.warn(
          "⚠️ payment_intent.payment_failed — pi:", pi.id,
          "error:", errorReason,
        );

        // Try to find the checkout session for full cart details.
        let details;
        try {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: pi.id,
            limit: 1,
          });
          const session = sessions.data[0];
          if (session) {
            details = buildSessionIssueDetails(session, event.type, errorReason);
          }
        } catch (e) {
          console.error("⚠️ Could not look up checkout session for PI:", pi.id, e.message);
        }

        if (!details) {
          details = buildPaymentIntentIssueDetails(pi, event.type);
        }

        notifyPaymentIssue(pi.id, event.type, details).catch(() => {});
      }

      res.json({ received: true });
    },
  );
};

export default stripeWebhook;
