// src/utils/catalog.js
import { products } from "../data/products";

export const productById = Object.fromEntries(products.map(p => [p.id, p]));

export function getColorName(productId, colorId) {
  const p = productById[productId];
  return p?.colors?.find(c => c.id === colorId)?.name || colorId;
}

export function getLeatherName(productId, leatherId) {
  const p = productById[productId];
  return p?.leathers?.find(l => l.id === leatherId)?.name || leatherId;
}