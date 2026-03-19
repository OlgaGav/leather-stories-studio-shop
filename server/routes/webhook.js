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

const stripeWebhook = (app) => {
  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      console.log("✅ Webhook hit"); // <--- added log for debugging
      const sig = req.headers["stripe-signature"];
      console.log("Stripe-Signature header present:", Boolean(sig)); // <--- added log for debugging
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
        console.log("EVENT:", event.type, "session.id:", session.id, "payment_status:", session.payment_status, "status:", session.status);
        console.log("EVENT TYPE:", event.type);
        console.log("session.id:", session.id);
        console.log("payment_status:", session.payment_status);
        console.log("customer_email:", session.customer_email);
        const isPaid =
          session.payment_status === "paid" || session.status === "complete";
        try {
          // Only treat it as paid
          if (!isPaid) {
            return res.json({ received: true });
          }

          // Avoid duplicates if Stripe retries
          const existing = await Order.findOne({ stripeSessionId: session.id });
          if (existing) {
            return res.json({ received: true });
          }

          const items = safeParseItems(session);

          // Build order items (supports your compact metadata format)
          const orderItems = items.map((i) => ({
            productId: i.productId,
            name: i.name || i.productId, // in case you add it later
            colorId: i.colorId,
            leatherId: i.leatherId || "",
            personalizationText: i.pText || i.personalizationText || "",
            personalizationFont: i.pFont || i.personalizationFont || "",
            quantity: i.qty || i.quantity || 1,
            price: i.price || 0,
            currency: i.cur || session.currency?.toUpperCase() || "EUR",
          }));

          const order = await Order.create({
            stripeSessionId: session.id, // ✅ used by Success page
            orderRef: session.metadata?.orderRef || "",
            items: orderItems,
            amountTotal: session.amount_total, // cents
            currency: (session.currency || "eur").toUpperCase(),
            customerEmail: session.customer_email,
            paymentStatus: "paid",
          });
          console.log("✅ Order saved for session:", session.id);

          // Send emails (don't await, as we don't want to block the response)
          sendEmail(order).catch((e) =>
            console.error("❌ Email sending failed:", e.message),
          );
        } catch (err) {
          console.error("❌ Order create failed:", err?.message);
          if (err?.errors) console.error("❌ Validation errors:", JSON.stringify(err.errors, null, 2));
          console.error(err);
        }
      }

      res.json({ received: true });
    },
  );
};

export default stripeWebhook;
