import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import sendEmail from "../utils/mailer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function safeParseItems(session) {
  try {
    const raw = session.metadata?.items;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Maps Stripe session shipping_details + customer_details → our DB schema.
 * Returns null if the minimum required fields (line1, country) are absent.
 */
function extractShippingAddress(session) {
  const sd = session.shipping_details;  // present when shipping_address_collection is enabled
  const cd = session.customer_details;  // always present; contains phone

  if (!sd?.address?.line1 || !sd?.address?.country) {
    return null;
  }

  return {
    name:       sd.name || cd?.name || "",
    line1:      sd.address.line1 || "",
    line2:      sd.address.line2 || "",
    city:       sd.address.city || "",
    state:      sd.address.state || "",
    postalCode: sd.address.postal_code || "",
    country:    sd.address.country || "",
    phone:      cd?.phone || "",
  };
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
          return res.json({ received: true });
        }

        // Idempotency guard — Stripe may retry the webhook
        const existing = await Order.findOne({ stripeSessionId: session.id });
        if (existing) {
          console.log("ℹ️  Duplicate webhook for session:", session.id, "— skipping");
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
                shipping_details: session.shipping_details,
                customer_details: session.customer_details,
              },
            );
          }

          const order = await Order.create({
            stripeSessionId: session.id,
            orderRef: session.metadata?.orderRef || "",
            items: orderItems,
            amountTotal: session.amount_total,
            currency: (session.currency || "eur").toUpperCase(),
            customerEmail: session.customer_email,
            paymentStatus: "paid",
            shippingAddress,
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
          // Return 200 so Stripe does not retry — the error needs manual investigation
        }
      }

      res.json({ received: true });
    },
  );
};

export default stripeWebhook;
