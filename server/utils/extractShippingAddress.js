/**
 * Maps Stripe Checkout Session shipping_details + customer_details
 * into the application ShippingAddressSchema shape.
 *
 * Returns null when the minimum required fields (line1, country) are absent.
 *
 * @param {import('stripe').Stripe.Checkout.Session} session
 * @returns {{ name, line1, line2, city, state, postalCode, country, phone } | null}
 */
export function extractShippingAddress(session) {
  const sd = session.shipping_details; // present when shipping_address_collection is enabled
  const cd = session.customer_details; // always present; contains phone

  if (!sd?.address?.line1 || !sd?.address?.country) {
    return null;
  }

  return {
    name:       sd.name || cd?.name || "",
    line1:      sd.address.line1 || "",
    line2:      sd.address.line2 || "",
    city:       sd.address.city || "",
    state:      sd.address.state || "",
    postalCode: sd.address.postal_code || "",
    country:    sd.address.country || "",
    phone:      cd?.phone || "",
  };
}
