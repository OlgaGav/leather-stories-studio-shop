// server/routes/order.js
import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import { extractShippingAddress } from "../utils/extractShippingAddress.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId?.startsWith("cs_")) {
      return res.status(400).json({ error: "Invalid session_id" });
    }

    // 1) If already in DB, return immediately.
    //    If shippingAddress is missing, attempt a one-time patch from Stripe.
    const existing = await Order.findOne({ stripeSessionId: sessionId });
    if (existing) {
      if (!existing.shippingAddress) {
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          const shippingAddress = extractShippingAddress(session);
          if (shippingAddress) {
            existing.shippingAddress = shippingAddress;
            await existing.save();
            console.log(
              "✅ Patched missing shippingAddress for order:", existing._id,
              "via session retrieval",
            );
          } else {
            console.error(
              "❌ Shipping address missing in Stripe session for order:", existing._id,
              "session:", sessionId,
              "— manual follow-up required.",
            );
          }
        } catch (patchErr) {
          console.error(
            "⚠️  Could not patch shippingAddress from Stripe for session:", sessionId,
            "—", patchErr.message,
          );
        }
      }
      return res.json(existing);
    }

    // 2) Not in DB yet: verify with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      // not paid or still open
      return res.status(409).json({ error: "Payment not confirmed yet" });
    }

    // Paid, but webhook hasn't written to DB yet
    return res.status(202).json({ error: "Paid. Finalizing order…" });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
});

export default router;
