import mongoose from "mongoose";

/**
 * Individual item inside the order
 */
const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },

    colorId: { type: String, required: true },
    leatherId: { type: String, default: "" },

    personalizationText: { type: String, default: "" },
    personalizationFont: { type: String, default: "" },

    quantity: { type: Number, required: true, min: 1 },

    // price stored in major unit (e.g. 59.00)
    price: { type: Number, required: true },

    currency: { type: String, required: true },
  },
  { _id: false }
);

/**
 * Order schema
 */
const OrderSchema = new mongoose.Schema(
  {
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    orderRef: {
      type: String,
      index: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    // total in cents (from Stripe)
    amountTotal: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },

    customerEmail: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
      default: "paid",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default mongoose.model("Order", OrderSchema);