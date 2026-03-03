export function getVariantImages(product, selection = {}) {
  const { color, leather } = selection;

  // Find best match among variants
  const match = product.variants?.find((v) => {
    const colorOk = color ? v.color === color : true;
    const leatherOk = leather ? v.leather === leather : true;
    return colorOk && leatherOk;
  });

  if (match?.images?.length) return match.images;

  // If color selected but no exact match, try color-only match
  if (color) {
    const colorOnly = product.variants?.find((v) => v.color === color && !v.leather);
    if (colorOnly?.images?.length) return colorOnly.images;
  }

  // fallback
  return product.defaultImages || [];
}