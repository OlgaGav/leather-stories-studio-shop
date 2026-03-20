/**
 * Maps Stripe Checkout Session shipping data into the application ShippingAddressSchema shape.
 *
 * Reads from session.collected_information.shipping_details (Stripe API >= 2025-03-31 / Basil).
 * Falls back to the legacy top-level session.shipping_details for older API versions or test
 * environments that have not yet migrated.
 *
 * Returns null when the minimum required fields (line1, country) are absent.
 *
 * @param {import('stripe').Stripe.Checkout.Session} session
 * @returns {{ name: string, address: { line1, line2, city, state, postalCode, country }, phone: string } | null}
 */
export function extractShippingAddress(session) {
  const sd =
    session.collected_information?.shipping_details || // current Stripe API (Basil 2025-03-31+)
    session.shipping_details ||                        // legacy fallback
    null;

  const cd = session.customer_details; // always present; contains phone

  if (!sd?.address?.line1 || !sd?.address?.country) {
    return null;
  }

  return {
    name:    sd.name || cd?.name || "",
    address: {
      line1:      sd.address.line1       || "",
      line2:      sd.address.line2       || "",
      city:       sd.address.city        || "",
      state:      sd.address.state       || "",
      postalCode: sd.address.postal_code || "",
      country:    sd.address.country     || "",
    },
    phone: cd?.phone || "",
  };
}
