// server/routes/order.js
import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";

const orderRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

orderRouter.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Not paid" });
    }

    const order = await Order.findOne({ stripeSessionId: session.id });

    if (!order) {
      return res.status(404).json({ error: "Order not found yet" });
    }

    res.json(order);
  } catch (err) {
  console.error(err);
  res.status(err?.statusCode || 500).json({
    error: err?.message || "Server error",
    type: err?.type,
  });
}
});

export default orderRouter;