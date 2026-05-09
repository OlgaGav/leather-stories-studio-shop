import { extractShippingAddress } from '../utils/extractShippingAddress.js';

const validAddress = {
  line1: '123 Main St',
  line2: 'Apt 4',
  city: 'Springfield',
  state: 'IL',
  postal_code: '62701',
  country: 'US',
};

const makeSession = ({ shippingDetails, legacyShippingDetails, customerDetails } = {}) => ({
  collected_information: shippingDetails ? { shipping_details: shippingDetails } : undefined,
  shipping_details: legacyShippingDetails,
  customer_details: customerDetails ?? { name: 'Default User', phone: '+1234567890' },
});

describe('extractShippingAddress', () => {
  describe('new Stripe API (collected_information)', () => {
    it('extracts all fields correctly', () => {
      const session = makeSession({
        shippingDetails: { name: 'Jane Doe', address: validAddress },
        customerDetails: { phone: '+1234567890' },
      });
      expect(extractShippingAddress(session)).toEqual({
        name: 'Jane Doe',
        address: {
          line1: '123 Main St',
          line2: 'Apt 4',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
          country: 'US',
        },
        phone: '+1234567890',
      });
    });
  });

  describe('legacy fallback (session.shipping_details)', () => {
    it('reads from top-level shipping_details when collected_information is absent', () => {
      const session = makeSession({
        legacyShippingDetails: { name: 'John Legacy', address: validAddress },
        customerDetails: { phone: '+9999999999' },
      });
      const result = extractShippingAddress(session);
      expect(result.name).toBe('John Legacy');
      expect(result.address.line1).toBe('123 Main St');
      expect(result.phone).toBe('+9999999999');
    });
  });

  describe('name fallback', () => {
    it('falls back to customer_details.name when shipping name is absent', () => {
      const session = makeSession({
        shippingDetails: { address: validAddress },
        customerDetails: { name: 'Customer Name', phone: '' },
      });
      expect(extractShippingAddress(session).name).toBe('Customer Name');
    });

    it('returns empty string when both shipping name and customer name are absent', () => {
      const session = makeSession({
        shippingDetails: { address: validAddress },
        customerDetails: { phone: '' },
      });
      expect(extractShippingAddress(session).name).toBe('');
    });
  });

  describe('returns null for invalid sessions', () => {
    it('returns null when line1 is missing', () => {
      const session = makeSession({
        shippingDetails: { name: 'Jane', address: { country: 'US' } },
      });
      expect(extractShippingAddress(session)).toBeNull();
    });

    it('returns null when country is missing', () => {
      const session = makeSession({
        shippingDetails: { name: 'Jane', address: { line1: '123 Main St' } },
      });
      expect(extractShippingAddress(session)).toBeNull();
    });

    it('returns null when shipping_details is entirely absent', () => {
      const session = { collected_information: {}, customer_details: {} };
      expect(extractShippingAddress(session)).toBeNull();
    });
  });

  describe('optional fields', () => {
    it('returns empty string for phone when customer_details is null', () => {
      const session = {
        collected_information: { shipping_details: { name: 'Jane', address: validAddress } },
        customer_details: null,
      };
      expect(extractShippingAddress(session).phone).toBe('');
    });

    it('maps postal_code to postalCode', () => {
      const session = makeSession({
        shippingDetails: { name: 'Jane', address: validAddress },
      });
      expect(extractShippingAddress(session).address.postalCode).toBe('62701');
    });

    it('returns empty string for optional address fields that are absent', () => {
      const session = makeSession({
        shippingDetails: {
          name: 'Jane',
          address: { line1: '123 Main St', country: 'US' },
        },
      });
      const result = extractShippingAddress(session);
      expect(result.address.line2).toBe('');
      expect(result.address.city).toBe('');
      expect(result.address.state).toBe('');
      expect(result.address.postalCode).toBe('');
    });
  });
});
