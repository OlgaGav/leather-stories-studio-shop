import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import stampRoutes from "./routes/stamp.js";
import orderRoutes from "./routes/order.js";
import checkoutRoutes from "./routes/checkout.js";
import createWebhookRoute from "./routes/webhook.js";

const app = express();

// Env guards
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Check server/.env");
  process.exit(1);
}
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing. Check server/.env");
  process.exit(1);
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.error("❌ STRIPE_WEBHOOK_SECRET is missing. Check server/.env");
  process.exit(1);
}

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
  })
);

// Stripe webhook (must be before express.json)
createWebhookRoute(app);

// JSON parsing for normal routes
app.use(express.json());

// Routes
app.use("/api/stamp", stampRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/checkout", checkoutRoutes);

app.get("/", (req, res) => res.send("API running"));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));