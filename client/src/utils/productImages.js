export function getVariantImages(product, selection = {}) {
  const { colorId, leatherId } = selection;

  // Find best match among variants
  const match = product.variants?.find((v) => {
    const colorOk = colorId ? v.color === colorId : true;
    const leatherOk = leatherId ? v.leather === leatherId : true;
    return colorOk && leatherOk;
  });

  if (match?.images?.length) return match.images;

  // If color selected but no exact match, try color-only match
  if (colorId) {
    const colorOnly = product.variants?.find((v) => v.color === colorId && !v.leather);
    if (colorOnly?.images?.length) return colorOnly.images;
  }

  // fallback
  return product.defaultImages || [];
}