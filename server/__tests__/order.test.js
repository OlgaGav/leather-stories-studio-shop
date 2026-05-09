import request from 'supertest';
import express from 'express';

jest.mock('stripe', () => {
  const retrieve = jest.fn();
  return jest.fn().mockReturnValue({ checkout: { sessions: { retrieve } } });
});

jest.mock('../models/Order.js', () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

import Stripe from 'stripe';
import Order from '../models/Order.js';
import orderRouter from '../routes/order.js';

const app = express();
app.use(express.json());
app.use('/api/order', orderRouter);

const stripeInstance = new Stripe();

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/order/session/:sessionId', () => {
  describe('session id validation', () => {
    it('returns 400 for an id that does not start with cs_', async () => {
      const res = await request(app).get('/api/order/session/invalid_id');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid session_id');
    });

    it('returns 400 for a payment intent id', async () => {
      const res = await request(app).get('/api/order/session/pi_not_a_checkout');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid session_id');
    });
  });

  describe('order found in database', () => {
    it('returns 200 with the order document', async () => {
      Order.findOne.mockResolvedValue({
        stripeSessionId: 'cs_test_abc123',
        shippingAddress: { name: 'Jane Doe', address: { line1: '123 Main St', country: 'US' } },
        customerEmail: 'jane@example.com',
        paymentStatus: 'paid',
      });

      const res = await request(app).get('/api/order/session/cs_test_abc123');
      expect(res.status).toBe(200);
      expect(res.body.customerEmail).toBe('jane@example.com');
    });

    it('does not call Stripe when the order has a shippingAddress', async () => {
      Order.findOne.mockResolvedValue({
        stripeSessionId: 'cs_test_abc123',
        shippingAddress: { name: 'Jane', address: { line1: '1 St', country: 'US' } },
      });

      await request(app).get('/api/order/session/cs_test_abc123');
      expect(stripeInstance.checkout.sessions.retrieve).not.toHaveBeenCalled();
    });
  });

  describe('order not in database', () => {
    it('returns 409 when Stripe says payment is not confirmed', async () => {
      Order.findOne.mockResolvedValue(null);
      stripeInstance.checkout.sessions.retrieve.mockResolvedValue({ payment_status: 'unpaid' });

      const res = await request(app).get('/api/order/session/cs_test_abc123');
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Payment not confirmed yet');
    });

    it('returns 202 when payment is confirmed but order has not been written yet', async () => {
      Order.findOne.mockResolvedValue(null);
      stripeInstance.checkout.sessions.retrieve.mockResolvedValue({ payment_status: 'paid' });

      const res = await request(app).get('/api/order/session/cs_test_abc123');
      expect(res.status).toBe(202);
    });
  });

  describe('error handling', () => {
    it('returns 500 when the database throws', async () => {
      Order.findOne.mockRejectedValue(new Error('DB connection lost'));

      const res = await request(app).get('/api/order/session/cs_test_abc123');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('DB connection lost');
    });
  });
});
