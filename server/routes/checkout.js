import express from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { ALLOWED_SHIPPING_COUNTRIES } from "../config/shipping.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function normalizeItem(raw) {
  const price = Number(raw?.price);
  const quantity = Number(raw?.quantity);

  return {
    ...raw,
    price,
    quantity: Number.isInteger(quantity) ? quantity : Math.floor(quantity),
    currency: (raw?.currency || "USD").toUpperCase(),
  };
}

function validateItem(item) {
  if (!item?.productId) return "Missing productId";
  if (!item?.name) return "Missing name";
  if (!Number.isFinite(item?.price) || item.price <= 0) return "Invalid price";
  if (!item?.leatherId && !item?.colorId)
    return "Missing colorId and leatherId";
  if (!item?.currency) return "Missing currency";
  if (!Number.isInteger(item?.quantity) || item.quantity < 1)
    return "Invalid quantity";
  return null;
}

router.post("/create-session", async (req, res) => {
  try {
    const { items, customerEmail, orderNotes } = req.body;

    if (!process.env.CLIENT_URL) {
      return res.status(500).json({ error: "CLIENT_URL is missing in env" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const normalizedItems = items.map(normalizeItem);

    for (const it of normalizedItems) {
      const err = validateItem(it);
      if (err) return res.status(400).json({ error: err, item: it });
    }

    const orderRef = crypto.randomUUID();

    const line_items = normalizedItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: item.currency.toLowerCase(),
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name,
          description: [
            `Color: ${item.colorId}`,
            item.leatherId ? `Leather: ${item.leatherId}` : null,
            item.personalization?.text
              ? `Personalization: ${item.personalization.text}`
              : null,
          ]
            .filter(Boolean)
            .join(" | "),
        },
      },
    }));

    // Multi-wallet discount: 10% off when total wallet quantity >= 2.
    // Enforced server-side as a negative line item so Stripe reflects the
    // actual charged amount and it cannot be bypassed by the frontend.
    const DISCOUNT_RATE = 0.10;
    const DISCOUNT_MIN_QTY = 2;
    const totalQty = normalizedItems.reduce((sum, i) => sum + i.quantity, 0);
    if (totalQty >= DISCOUNT_MIN_QTY) {
      const subtotalCents = normalizedItems.reduce(
        (sum, i) => sum + Math.round(i.price * 100) * i.quantity,
        0,
      );
      const discountCents = Math.round(subtotalCents * DISCOUNT_RATE);
      const currency = normalizedItems[0].currency.toLowerCase();
      line_items.push({
        quantity: 1,
        price_data: {
          currency,
          unit_amount: -discountCents,
          product_data: { name: "Multi-wallet discount (10%)" },
        },
      });
    }

    const compactItems = normalizedItems.map((i) => ({
      productId: i.productId,
      name: i.name,
      colorId: i.colorId,
      leatherId: i.leatherId || "",
      pText: i.personalization?.text || "",
      pFont: i.personalization?.fontId || "",
      qty: i.quantity,
      price: i.price,
      cur: i.currency,
    }));

    const metadataItemsJson = JSON.stringify(compactItems);

    // Stripe limits each metadata value to 500 chars and allows up to 50 keys.
    // Split the items JSON into 500-char chunks: items_0, items_1, ...
    // Reserve 1 key for orderRef → max 49 chunks = 24 500 chars, far more than needed.
    const CHUNK_SIZE = 500;
    const MAX_CHUNKS = 49;
    const totalChunks = Math.ceil(metadataItemsJson.length / CHUNK_SIZE);
    if (totalChunks > MAX_CHUNKS) {
      return res.status(400).json({
        error: "Cart too large to store in metadata. Reduce items.",
      });
    }

    const itemChunks = {};
    for (let i = 0; i < totalChunks; i++) {
      itemChunks[`items_${i}`] = metadataItemsJson.slice(
        i * CHUNK_SIZE,
        (i + 1) * CHUNK_SIZE,
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,

      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,

      customer_email: customerEmail || undefined,
      billing_address_collection: "required",
      // Collect shipping address for fulfilment.
      shipping_address_collection: {
        allowed_countries: ALLOWED_SHIPPING_COUNTRIES,
      },
      automatic_tax: {
        enabled: true,
      },
      // Collect phone number for shipping/fulfilment
      phone_number_collection: { enabled: true },

      metadata: {
        orderRef,
        ...itemChunks,
        ...(orderNotes ? { orderNotes: String(orderNotes).slice(0, 500) } : {}),
      },
    });
    
    return res.status(200).json({
      id: session.id,
      url: session.url,
    });

  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: err?.message || "Server error" });
  }
});

export default router;
