import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import stampRoutes from "./routes/stamp.js";
import orderRoutes from "./routes/order.js";
import checkoutRoutes from "./routes/checkout.js";
import createWebhookRoute from "./routes/webhook.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Env guards
["MONGO_URI", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"].forEach((k) => {
  if (!process.env[k]) {
    console.error(`❌ ${k} is missing. Check server/.env`);
    process.exit(1);
  }
});

// CORS 
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://leather-stories-studio.com",
  "https://staging.leather-stories-studio.com",
]);

const corsMiddleware = cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Stripe-Signature"],
});

app.use(corsMiddleware);

// Express 5-safe OPTIONS handling (NO "*")
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return corsMiddleware(req, res, next);
  next();
});

// Stripe webhook (must be before express.json)
createWebhookRoute(app);

// JSON parsing for normal routes
app.use(express.json());

// API routes
app.use("/api/stamp", stampRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/checkout", checkoutRoutes);

// Serve React build only when present
const clientBuildPath = path.join(__dirname, "public");
if (fs.existsSync(path.join(clientBuildPath, "index.html"))) {
  app.use(express.static(clientBuildPath));
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();
    return res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => res.send("API running"));
}

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});