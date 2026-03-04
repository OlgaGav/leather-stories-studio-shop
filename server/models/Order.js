// server/models/Order.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, default: "" },
    colorId: { type: String, required: true },
    leatherId: { type: String, default: "" },
    personalizationText: { type: String, default: "" },
    personalizationFont: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // dollars (your current compact metadata uses dollars)
    currency: { type: String, default: "USD" },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    stripeSessionId: { type: String, required: true, unique: true, index: true },
    orderRef: { type: String, default: "" },

    items: { type: [OrderItemSchema], default: [] },

    amountTotal: { type: Number, default: 0 }, // cents (Stripe session.amount_total)
    currency: { type: String, default: "USD" },

    customerEmail: { type: String, default: "" },
    paymentStatus: { type: String, default: "unpaid" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);