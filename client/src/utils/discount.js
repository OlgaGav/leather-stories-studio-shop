export const DISCOUNT_RATE = 0.10;
export const DISCOUNT_MIN_QTY = 2;

/**
 * Calculate multi-wallet discount info for a cart.
 * All products in this store are wallets, so discount applies to all items.
 *
 * @param {Array} items — cart items with { price, quantity }
 * @returns {{
 *   totalQty: number,
 *   subtotal: number,
 *   isEligible: boolean,
 *   discountAmount: number,
 *   discountedTotal: number,
 *   needed: number        // wallets still needed to qualify (0 if already eligible)
 * }}
 */
export function calcDiscount(items) {
  const totalQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isEligible = totalQty >= DISCOUNT_MIN_QTY;
  const discountAmount = isEligible ? subtotal * DISCOUNT_RATE : 0;
  const discountedTotal = subtotal - discountAmount;
  const needed = Math.max(0, DISCOUNT_MIN_QTY - totalQty);

  return { totalQty, subtotal, isEligible, discountAmount, discountedTotal, needed };
}
