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

const DISCOUNT_RATE = 0.10;
const DISCOUNT_MIN_QTY = 2;

function calcDiscount(items = []) {
  const totalQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isEligible = totalQty >= DISCOUNT_MIN_QTY;
  const discountAmount = isEligible ? subtotal * DISCOUNT_RATE : 0;
  return { isEligible, subtotal, discountAmount };
}

function formatMoney(amountCents, currency = "EUR") {
  const amount = (amountCents || 0) / 100;
  const symbol =
    currency === "EUR" ? "€" :
    currency === "USD" ? "$" :
    currency + " ";
  return `${symbol}${amount.toFixed(2)}`;
}

const PRODUCT_LABELS = {
  // colors
  "olive-grey-embossed": "Olive Grey Embossed",
  "olive-grey": "Olive Grey",
  "red-embossed": "Red Embossed",
  red: "Red",
  black: "Black",
  natural: "Natural",
  // leathers
  pueblo: "Pueblo Leather",
  "walpier-ghost-leather": "Walpier Ghost Leather",
};

function formatLabel(slug) {
  if (!slug) return "-";
  if (PRODUCT_LABELS[slug]) return PRODUCT_LABELS[slug];
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

function buildShippingHtml(addr) {
  if (!addr?.address?.line1) return "<p>Not provided</p>";
  const a = addr.address;
  const lines = [
    addr.name,
    a.line1,
    a.line2,
    [a.city, a.state, a.postalCode].filter(Boolean).join(", "),
    a.country,
    addr.phone ? `Phone: ${addr.phone}` : null,
  ].filter(Boolean);
  return lines.map((l) => `<div>${l}</div>`).join("");
}

function buildItemsText(items = []) {
  return items
    .map((item, index) => {
      return [
        `${index + 1}. ${item.name || formatLabel(item.productId)}`,
        `   Color: ${formatLabel(item.colorId)}`,
        item.leatherId ? `   Leather: ${formatLabel(item.leatherId)}` : null,
        item.personalizationText
          ? `   Personalization: ${item.personalizationText}${item.personalizationFont ? ` (${formatLabel(item.personalizationFont)})` : ""}`
          : null,
        `   Quantity: ${item.quantity}`,
        `   Price: ${formatMoney(item.price * 100, item.currency)} each`,
        `   Subtotal: ${formatMoney(item.price * item.quantity * 100, item.currency)}`,
      ].filter(Boolean).join("\n");
    })
    .join("\n\n");
}

function buildItemsHtml(items = []) {
  return items
    .map((item) => {
      const rows = [
        ["Product", item.name || formatLabel(item.productId)],
        ["Color", formatLabel(item.colorId)],
        item.leatherId ? ["Leather", formatLabel(item.leatherId)] : null,
        item.personalizationText
          ? ["Personalization", `${item.personalizationText}${item.personalizationFont ? ` (${formatLabel(item.personalizationFont)})` : ""}`]
          : null,
        ["Quantity", item.quantity],
        ["Price", `${formatMoney(item.price * 100, item.currency)} each`],
        ["Subtotal", formatMoney(item.price * item.quantity * 100, item.currency)],
      ].filter(Boolean);

      const rowsHtml = rows
        .map(
          ([label, value]) =>
            `<tr>
              <td style="padding:4px 12px 4px 0;color:#666;font-size:14px;white-space:nowrap;vertical-align:top;">${label}</td>
              <td style="padding:4px 0;font-size:14px;color:#222;">${value}</td>
            </tr>`
        )
        .join("");

      return `<div style="padding:12px 0;border-bottom:1px solid #e8e0d8;">
        <table style="border-collapse:collapse;">${rowsHtml}</table>
      </div>`;
    })
    .join("");
}

// ── Customer email ────────────────────────────────────────────────────────────

function buildCustomerHtml(order) {
  const customerName = order.shippingAddress?.name || "Valued Customer";
  const orderRef = order.orderRef || order.stripeSessionId;
  const totalPaid = formatMoney(order.amountTotal, order.currency);
  const itemsHtml = buildItemsHtml(order.items);
  const shippingHtml = buildShippingHtml(order.shippingAddress);
  const { isEligible, subtotal, discountAmount } = calcDiscount(order.items);
  const subtotalText = formatMoney(Math.round(subtotal * 100), order.currency);
  const discountText = formatMoney(Math.round(discountAmount * 100), order.currency);
  const amountTax = order.amountTax || 0;
  const taxText = formatMoney(amountTax, order.currency);

  const notesSection = order.orderNotes
    ? `<!-- Order Notes -->
      <p style="margin:0 0 12px;font-size:16px;font-weight:bold;border-bottom:2px solid #2c1a0e;padding-bottom:6px;">Your Order Notes</p>
      <div style="background:#fdf8f3;border-left:3px solid #b47c3b;padding:12px 16px;font-size:14px;line-height:1.7;color:#444;margin-bottom:28px;border-radius:0 4px 4px 0;">
        ${order.orderNotes}
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Georgia,serif;color:#222;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e8e0d8;">

          <!-- Header -->
          <tr>
            <td style="background:#2c1a0e;padding:28px 36px;text-align:center;">
              <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#f5efe8;letter-spacing:0.05em;">Leather Stories Studio</p>
              <p style="margin:6px 0 0;font-size:13px;color:#c9b99a;letter-spacing:0.08em;font-family:Arial,sans-serif;">ORDER CONFIRMATION</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 28px;">

              <p style="margin:0 0 8px;font-size:17px;">Hello ${customerName},</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#333;">
                Thank you for your order and for supporting Leather Stories Studio.
              </p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#444;">
                We are a small handcrafted studio, and every order means a great deal to us. Your support helps us continue creating carefully made leather goods with attention to detail, quality, and character. We truly value every customer and are grateful that you chose our work.
              </p>

              <!-- Order Reference -->
              <p style="margin:0 0 24px;font-size:14px;color:#555;">
                <strong>Order Reference:</strong> ${orderRef}
              </p>

              <!-- Order Summary -->
              <p style="margin:0 0 12px;font-size:16px;font-weight:bold;border-bottom:2px solid #2c1a0e;padding-bottom:6px;">Order Summary</p>
              ${itemsHtml}
              ${isEligible || amountTax > 0 ? `
              <table style="border-collapse:collapse;width:100%;margin:12px 0 4px;">
                ${isEligible ? `
                <tr>
                  <td style="font-size:14px;color:#666;padding:3px 0;">Subtotal</td>
                  <td style="font-size:14px;color:#222;text-align:right;">${subtotalText}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#b47c3b;padding:3px 0;">Discount (10% multi-wallet)</td>
                  <td style="font-size:14px;color:#b47c3b;text-align:right;">−${discountText}</td>
                </tr>` : ""}
                ${amountTax > 0 ? `
                <tr>
                  <td style="font-size:14px;color:#666;padding:3px 0;">Tax</td>
                  <td style="font-size:14px;color:#222;text-align:right;">${taxText}</td>
                </tr>` : ""}
              </table>
              <div style="border-top:1px solid #e8e0d8;margin:6px 0 4px;"></div>
              ` : ""}
              <p style="margin:8px 0 28px;font-size:15px;font-weight:bold;">
                Total Paid: ${totalPaid}
              </p>

              <!-- Shipping Details -->
              <p style="margin:0 0 12px;font-size:16px;font-weight:bold;border-bottom:2px solid #2c1a0e;padding-bottom:6px;">Shipping Details</p>
              <div style="font-size:14px;line-height:1.8;color:#333;margin-bottom:28px;">
                ${shippingHtml}
              </div>

              ${notesSection}

              <!-- Next steps -->
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#333;">
                We will begin crafting or preparing your order shortly. You will receive another email as soon as your order has shipped.
              </p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#444;">
                Because each piece is made from natural vegetable-tanned leather, slight variations in tone, grain, and character are part of what makes every item unique.
              </p>

              <!-- Return Policy -->
              <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#333;">
                You can review our return and exchange terms here:<br />
                <a href="https://leather-stories-studio.com/return-policy" style="color:#2c1a0e;font-weight:bold;">https://leather-stories-studio.com/return-policy</a>
              </p>

              <!-- Support -->
              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#333;">
                If you have any questions about your order, feel free to reply to this email. We are always happy to help.
              </p>

              <!-- Sign-off -->
              <p style="margin:0 0 4px;font-size:15px;color:#333;">Thank you again for supporting small business and handcrafted work.</p>
              <p style="margin:0 0 4px;font-size:15px;color:#333;">Warmly,</p>
              <p style="margin:0 0 4px;font-size:15px;font-weight:bold;color:#2c1a0e;">Leather Stories Studio</p>
              <p style="margin:0;font-size:14px;">
                <a href="mailto:order@leather-stories-studio.com" style="color:#2c1a0e;">order@leather-stories-studio.com</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0ebe3;padding:16px 36px;text-align:center;border-top:1px solid #e8e0d8;">
              <p style="margin:0;font-size:12px;color:#888;">Leather Stories Studio &mdash; handcrafted leather goods</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildCustomerText(order) {
  const customerName = order.shippingAddress?.name || "Valued Customer";
  const orderRef = order.orderRef || order.stripeSessionId;
  const totalPaid = formatMoney(order.amountTotal, order.currency);
  const itemsText = buildItemsText(order.items);
  const shippingText = buildShippingText(order.shippingAddress);
  const { isEligible, subtotal, discountAmount } = calcDiscount(order.items);
  const subtotalText = formatMoney(Math.round(subtotal * 100), order.currency);
  const discountText = formatMoney(Math.round(discountAmount * 100), order.currency);
  const amountTax = order.amountTax || 0;
  const taxText = formatMoney(amountTax, order.currency);

  const notesSection = order.orderNotes
    ? `------------------------------------------------------------
Your Order Notes
------------------------------------------------------------

${order.orderNotes}

`
    : "";

  return `Hello ${customerName},

Thank you for your order and for supporting Leather Stories Studio.

We are a small handcrafted studio, and every order means a great deal to us. Your support helps us continue creating carefully made leather goods with attention to detail, quality, and character. We truly value every customer and are grateful that you chose our work.

Order Reference: ${orderRef}

------------------------------------------------------------
Order Summary
------------------------------------------------------------

${itemsText}
${isEligible ? `
Subtotal:                    ${subtotalText}
Discount (10% multi-wallet): −${discountText}` : ""}${amountTax > 0 ? `
Tax:                         ${taxText}` : ""}${isEligible || amountTax > 0 ? `
` : ""}
Total Paid: ${totalPaid}

------------------------------------------------------------
Shipping Details
------------------------------------------------------------

${shippingText}

${notesSection}We will begin crafting or preparing your order shortly. You will receive another email as soon as your order has shipped.

Because each piece is made from natural vegetable-tanned leather, slight variations in tone, grain, and character are part of what makes every item unique.

You can review our return and exchange terms here:
https://leather-stories-studio.com/return-policy

If you have any questions about your order, feel free to reply to this email. We are always happy to help.

Thank you again for supporting small business and handcrafted work.

Warmly,
Leather Stories Studio
order@leather-stories-studio.com
`;
}

// ── Owner email ───────────────────────────────────────────────────────────────

function buildOwnerHtml(order) {
  const orderRef = order.orderRef || "—";
  const totalPaid = formatMoney(order.amountTotal, order.currency);
  const itemsHtml = buildItemsHtml(order.items);
  const shippingHtml = buildShippingHtml(order.shippingAddress);
  const { isEligible, subtotal, discountAmount } = calcDiscount(order.items);
  const subtotalText = formatMoney(Math.round(subtotal * 100), order.currency);
  const discountText = formatMoney(Math.round(discountAmount * 100), order.currency);
  const amountTax = order.amountTax || 0;
  const taxText = formatMoney(amountTax, order.currency);

  const notesSection = order.orderNotes
    ? `<!-- Customer Notes — highlighted -->
          <tr>
            <td style="padding:0 36px 28px;">
              <p style="margin:0 0 10px;font-size:16px;font-weight:bold;border-bottom:2px solid #b47c3b;padding-bottom:6px;color:#2c1a0e;">
                ⚠️ Customer Order Notes
              </p>
              <div style="background:#fff8ed;border:1px solid #e8c97a;border-left:4px solid #b47c3b;padding:14px 18px;font-size:15px;line-height:1.7;color:#333;border-radius:0 6px 6px 0;">
                ${order.orderNotes}
              </div>
            </td>
          </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Order</title>
</head>
<body style="margin:0;padding:0;background:#f5f0ea;font-family:Arial,sans-serif;color:#222;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ea;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #ddd5c8;border-radius:4px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#2c1a0e;padding:24px 36px;">
              <p style="margin:0;font-size:20px;color:#f5efe8;font-family:Georgia,serif;letter-spacing:0.04em;">Leather Stories Studio</p>
              <p style="margin:4px 0 0;font-size:12px;color:#c9b99a;letter-spacing:0.1em;">NEW ORDER RECEIVED</p>
            </td>
          </tr>

          <!-- Customer + Amount banner -->
          <tr>
            <td style="background:#fdf8f3;padding:18px 36px;border-bottom:1px solid #e8e0d8;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:13px;color:#888;">Customer</p>
                    <p style="margin:2px 0 0;font-size:15px;font-weight:bold;color:#222;">${order.customerEmail}</p>
                  </td>
                  <td style="text-align:right;">
                    <p style="margin:0;font-size:13px;color:#888;">Total${isEligible ? " (10% off)" : ""}</p>
                    <p style="margin:2px 0 0;font-size:20px;font-weight:bold;color:#2c1a0e;">${totalPaid}</p>
                    ${isEligible ? `<p style="margin:2px 0 0;font-size:11px;color:#b47c3b;">−${discountText} discount applied</p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${notesSection}

          <!-- Order Items -->
          <tr>
            <td style="padding:28px 36px 0;">
              <p style="margin:0 0 12px;font-size:16px;font-weight:bold;border-bottom:2px solid #2c1a0e;padding-bottom:6px;color:#2c1a0e;">Order Items</p>
              ${itemsHtml}
              ${isEligible || amountTax > 0 ? `
              <table style="border-collapse:collapse;width:100%;margin:12px 0 4px;">
                ${isEligible ? `
                <tr>
                  <td style="font-size:14px;color:#666;padding:3px 0;">Subtotal</td>
                  <td style="font-size:14px;color:#222;text-align:right;">${subtotalText}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#b47c3b;padding:3px 0;font-weight:bold;">Discount (10% multi-wallet)</td>
                  <td style="font-size:14px;color:#b47c3b;text-align:right;font-weight:bold;">−${discountText}</td>
                </tr>` : ""}
                ${amountTax > 0 ? `
                <tr>
                  <td style="font-size:14px;color:#666;padding:3px 0;">Tax</td>
                  <td style="font-size:14px;color:#222;text-align:right;">${taxText}</td>
                </tr>` : ""}
              </table>
              <div style="border-top:1px solid #e8e0d8;margin:6px 0 4px;"></div>
              ` : ""}
              <p style="margin:8px 0 28px;font-size:15px;font-weight:bold;color:#222;">
                Total Paid: ${totalPaid}
              </p>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding:0 36px 28px;">
              <p style="margin:0 0 12px;font-size:16px;font-weight:bold;border-bottom:2px solid #2c1a0e;padding-bottom:6px;color:#2c1a0e;">Ship To</p>
              <div style="font-size:14px;line-height:1.9;color:#333;">
                ${shippingHtml}
              </div>
            </td>
          </tr>

          <!-- Debug / Reference -->
          <tr>
            <td style="background:#f5f0ea;padding:18px 36px;border-top:1px solid #e8e0d8;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:bold;color:#888;letter-spacing:0.08em;text-transform:uppercase;">Reference &amp; Debug</p>
              <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="font-size:12px;color:#999;padding-right:12px;white-space:nowrap;padding-bottom:4px;">Order Ref</td>
                  <td style="font-size:12px;color:#555;font-family:monospace;padding-bottom:4px;">${orderRef}</td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:#999;padding-right:12px;white-space:nowrap;">Stripe Session</td>
                  <td style="font-size:12px;color:#555;font-family:monospace;">${order.stripeSessionId}</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildOwnerText(order) {
  const orderRef = order.orderRef || "—";
  const totalPaid = formatMoney(order.amountTotal, order.currency);
  const itemsText = buildItemsText(order.items);
  const shippingText = buildShippingText(order.shippingAddress);
  const { isEligible, subtotal, discountAmount } = calcDiscount(order.items);
  const subtotalText = formatMoney(Math.round(subtotal * 100), order.currency);
  const discountText = formatMoney(Math.round(discountAmount * 100), order.currency);
  const amountTax = order.amountTax || 0;
  const taxText = formatMoney(amountTax, order.currency);

  const notesSection = order.orderNotes
    ? `============================================================
!! CUSTOMER ORDER NOTES !!
============================================================

${order.orderNotes}

`
    : "";

  return `NEW ORDER RECEIVED — Leather Stories Studio
============================================================

Customer Email: ${order.customerEmail}
Total: ${totalPaid}${isEligible ? ` (incl. 10% multi-wallet discount of −${discountText})` : ""}

${notesSection}------------------------------------------------------------
Order Items
------------------------------------------------------------

${itemsText}
${isEligible ? `
Subtotal:                    ${subtotalText}
Discount (10% multi-wallet): −${discountText}` : ""}${amountTax > 0 ? `
Tax:                         ${taxText}` : ""}${isEligible || amountTax > 0 ? `
` : ""}
Total Paid: ${totalPaid}

------------------------------------------------------------
Ship To
------------------------------------------------------------

${shippingText}

------------------------------------------------------------
Reference & Debug
------------------------------------------------------------

Order Ref:      ${orderRef}
Stripe Session: ${order.stripeSessionId}
`;
}

// ── Sender ────────────────────────────────────────────────────────────────────

const sendEmail = async (order) => {
  // Customer confirmation email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: order.customerEmail,
    subject: "Your Leather Wallet Order Confirmation",
    text: buildCustomerText(order),
    html: buildCustomerHtml(order),
  });

  // Owner notification email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.OWNER_EMAIL,
    subject: `New Order — ${formatMoney(order.amountTotal, order.currency)} (${order.orderRef || order.stripeSessionId})`,
    text: buildOwnerText(order),
    html: buildOwnerHtml(order),
  });
};

export default sendEmail;
