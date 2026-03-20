import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function formatMoney(amountCents, currency = "EUR") {
  const amount = (amountCents || 0) / 100;
  const symbol =
    currency === "EUR" ? "€" :
    currency === "USD" ? "$" :
    currency + " ";
  return `${symbol}${amount.toFixed(2)}`;
}

function buildShippingText(addr) {
  if (!addr?.address?.line1) return "  Not provided";
  const a = addr.address;
  const lines = [
    addr.name,
    a.line1,
    a.line2,
    [a.city, a.state, a.postalCode].filter(Boolean).join(", "),
    a.country,
    addr.phone ? `Phone: ${addr.phone}` : null,
  ].filter(Boolean);
  return lines.map((l) => `  ${l}`).join("\n");
}

function buildItemsText(items = []) {
  return items
    .map((item, index) => {
      return `
${index + 1}. ${item.name || item.productId}
   Color: ${item.colorId || "-"}
   ${item.leatherId ? `Leather: ${item.leatherId}` : ""}
   ${item.personalizationText ? `Personalization: ${item.personalizationText} (${item.personalizationFont || "-"})` : ""}
   Quantity: ${item.quantity}
   Price: ${formatMoney(item.price * 100, item.currency)} each
   Subtotal: ${formatMoney(item.price * item.quantity * 100, item.currency)}
`;
    })
    .join("\n");
}

const sendEmail = async (order) => {
  const itemsText = buildItemsText(order.items);
  const totalText = formatMoney(order.amountTotal, order.currency);
  const shippingText = buildShippingText(order.shippingAddress);

  // ----------------------
  // Customer email
  // ----------------------
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: order.customerEmail,
    subject: "Your Leather Wallet Order Confirmation",
    text: `
Thank you for your order!

Order Reference: ${order.orderRef || order.stripeSessionId}

Items:
${itemsText}

Total Paid: ${totalText}

Shipping Address:
${shippingText}

We will start crafting your order shortly.
You’ll receive another email when it ships.

Thank you for supporting our studio.
`,
  });

  // ----------------------
  // Owner email
  // ----------------------
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.OWNER_EMAIL,
    subject: `New Order Received (${order.orderRef || order.stripeSessionId})`,
    text: `
New order received!

Stripe Session ID: ${order.stripeSessionId}
Order Ref: ${order.orderRef}
Customer Email: ${order.customerEmail}

Items:
${itemsText}

Total: ${totalText}

Shipping Address:
${shippingText}

Full Order Object:
${JSON.stringify(order, null, 2)}
`,
  });
};

export default sendEmail;