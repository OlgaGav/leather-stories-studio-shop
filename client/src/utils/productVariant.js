export function findVariant(product, { colorId, leatherId }) {
  const variants = product.variants || [];
  // best match: color + leather
  let v = variants.find(
    (x) => x.colorId === colorId && x.leatherId === leatherId,
  );
  if (v) return v;

  // fallback: color only
  v = variants.find((x) => x.colorId === colorId && !x.leatherId);
  if (v) return v;

  // fallback: first variant
  return variants[0] || null;
}

export function formatMoney(amount, currency = "USD") {
  const symbol =
    currency === "EUR" ? "€" : currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${amount}`;
}

export function formatMoneyFromCents(amountCents, currency = "USD") {
  const amount = (amountCents || 0) / 100;
  const symbol =
    currency === "EUR" ? "€" : currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${amount.toFixed(2)}`;
}
