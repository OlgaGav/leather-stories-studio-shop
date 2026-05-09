import request from 'supertest';
import express from 'express';

// Mock functions are defined inside the factory so they exist when the factory runs.
// All calls to `new Stripe()` return the same singleton instance (mockReturnValue),
// so the mock functions are shared between the module under test and the test file.
jest.mock('stripe', () => {
  const create = jest.fn();
  return jest.fn().mockReturnValue({ checkout: { sessions: { create } } });
});

import Stripe from 'stripe';
import checkoutRouter from '../routes/checkout.js';

const app = express();
app.use(express.json());
app.use('/api/checkout', checkoutRouter);

const stripeInstance = new Stripe();

const validItem = {
  productId: 'cardholder-model-1',
  name: 'Nomad',
  price: 50,
  quantity: 1,
  colorId: 'black',
  leatherId: 'pueblo',
  currency: 'USD',
};

beforeEach(() => {
  stripeInstance.checkout.sessions.create.mockResolvedValue({
    id: 'cs_test_123',
    url: 'https://checkout.stripe.com/pay/cs_test_123',
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/checkout/create-session', () => {
  describe('cart validation', () => {
    it('returns 400 when items array is empty', async () => {
      const res = await request(app).post('/api/checkout/create-session').send({ items: [] });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Cart is empty');
    });

    it('returns 400 when items is not an array', async () => {
      const res = await request(app).post('/api/checkout/create-session').send({ items: null });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Cart is empty');
    });
  });

  describe('item validation', () => {
    it('returns 400 for missing productId', async () => {
      const { productId: _, ...itemWithout } = validItem;
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [itemWithout] });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing productId');
    });

    it('returns 400 for missing name', async () => {
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [{ ...validItem, name: undefined }] });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing name');
    });

    it('returns 400 for price of zero', async () => {
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [{ ...validItem, price: 0 }] });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid price');
    });

    it('returns 400 for negative price', async () => {
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [{ ...validItem, price: -10 }] });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid price');
    });

    it('returns 400 for quantity of zero', async () => {
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [{ ...validItem, quantity: 0 }] });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid quantity');
    });

    it('returns 400 when both colorId and leatherId are absent', async () => {
      const { colorId: _c, leatherId: _l, ...itemWithout } = validItem;
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [itemWithout] });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing colorId and leatherId');
    });
  });

  describe('personalization validation', () => {
    it('returns 400 when personalization text exceeds 20 characters', async () => {
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({
          items: [{
            ...validItem,
            personalization: { text: 'A'.repeat(21), fontId: 'engagement' },
          }],
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/exceeds 20 character limit/);
    });

    it('returns 400 for an unrecognized font id', async () => {
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({
          items: [{ ...validItem, personalization: { text: 'John', fontId: 'comic-sans' } }],
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid personalization font/);
    });

    it('accepts a valid personalization', async () => {
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({
          items: [{ ...validItem, personalization: { text: 'John', fontId: 'engagement' } }],
        });
      expect(res.status).toBe(200);
    });
  });

  describe('successful session creation', () => {
    it('returns 200 with session id and url', async () => {
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [validItem] });
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('cs_test_123');
      expect(res.body.url).toBe('https://checkout.stripe.com/pay/cs_test_123');
    });

    it('does not apply discount for a single item with qty 1', async () => {
      await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [validItem] });
      const { line_items } = stripeInstance.checkout.sessions.create.mock.calls[0][0];
      // $50 at full price → 5000 cents
      expect(line_items[0].price_data.unit_amount).toBe(5000);
    });

    it('applies 10% discount when total qty is 2', async () => {
      await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [{ ...validItem, quantity: 2 }] });
      const { line_items } = stripeInstance.checkout.sessions.create.mock.calls[0][0];
      // $50 × 0.9 × 100 = 4500 cents
      expect(line_items[0].price_data.unit_amount).toBe(4500);
    });

    it('applies discount when two separate items together reach qty 2', async () => {
      await request(app)
        .post('/api/checkout/create-session')
        .send({
          items: [
            { ...validItem, colorId: 'black' },
            { ...validItem, colorId: 'red' },
          ],
        });
      const { line_items } = stripeInstance.checkout.sessions.create.mock.calls[0][0];
      expect(line_items[0].price_data.unit_amount).toBe(4500);
      expect(line_items[1].price_data.unit_amount).toBe(4500);
    });

    it('passes customerEmail to Stripe when provided', async () => {
      await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [validItem], customerEmail: 'buyer@example.com' });
      const sessionArgs = stripeInstance.checkout.sessions.create.mock.calls[0][0];
      expect(sessionArgs.customer_email).toBe('buyer@example.com');
    });
  });

  describe('Stripe error handling', () => {
    beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
    afterEach(() => console.error.mockRestore());

    it('returns 500 when Stripe throws', async () => {
      stripeInstance.checkout.sessions.create.mockRejectedValueOnce(new Error('Stripe unavailable'));
      const res = await request(app)
        .post('/api/checkout/create-session')
        .send({ items: [validItem] });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Stripe unavailable');
    });
  });
});
