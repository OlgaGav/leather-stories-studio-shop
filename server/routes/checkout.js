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
    const { items, customerEmail } = req.body;

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

    const compactItems = items.map((i) => ({
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
    if (metadataItemsJson.length > 4500) {
      return res.status(400).json({
        error: "Cart too large to store in metadata. Reduce items.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,

      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,

      customer_email: customerEmail || undefined,

      // Collect shipping address for fulfilment.
      shipping_address_collection: {
        allowed_countries: ALLOWED_SHIPPING_COUNTRIES,
      },

      // Collect phone number for shipping/fulfilment
      phone_number_collection: { enabled: true },

      metadata: {
        orderRef,
        items: metadataItemsJson,
      },
    });
    console.log("Created Stripe session:", session.id);
    console.log(
      "shipping_address_collection on created session:",
      session.shipping_address_collection,
    );

    const processedSession = await stripe.checkout.sessions.retrieve(
      session.id,
    );
    console.log(
      "Retrieved session shipping details:",
      session.shipping_details,
    );
    console.log(
      "Retrieved session shipping config:",
      session.shipping_address_collection,
    );
    return res.json({ url: session.url, id: session.id, orderRef });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: err?.message || "Server error" });
  }
});

export default router;
