import mongoose from "mongoose";

// Tracks which payment issue warning emails have been sent.
// Compound unique index prevents duplicate emails for the same session/PI + event type.
const PaymentIssueNotificationSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true }, // stripeSessionId or paymentIntentId
    eventType:  { type: String, required: true },
  },
  { timestamps: true }
);

PaymentIssueNotificationSchema.index(
  { identifier: 1, eventType: 1 },
  { unique: true }
);

export default mongoose.model("PaymentIssueNotification", PaymentIssueNotificationSchema);
