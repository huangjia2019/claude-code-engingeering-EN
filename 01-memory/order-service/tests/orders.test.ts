import { describe, it, expect, beforeEach } from 'vitest';
import { OrderService } from '../src/services/orderService';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    service = new OrderService();
  });

  it('should create an order with correct total', async () => {
    const order = await service.createOrder({
      customerId: '550e8400-e29b-41d4-a716-446655440000',
      items: [
        { productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 2, unitPrice: 29.99 },
        { productId: '550e8400-e29b-41d4-a716-446655440002', quantity: 1, unitPrice: 49.99 },
      ],
    });

    expect(order.status).toBe('pending');
    expect(order.totalAmount).toBeCloseTo(109.97);
    expect(order.items).toHaveLength(2);
  });

  it('should reject orders below minimum amount', async () => {
    await expect(service.createOrder({
      customerId: '550e8400-e29b-41d4-a716-446655440000',
      items: [
        { productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 1, unitPrice: 0.50 },
      ],
    })).rejects.toThrow('at least $1.00');
  });

  it('should reject orders exceeding max items', async () => {
    await expect(service.createOrder({
      customerId: '550e8400-e29b-41d4-a716-446655440000',
      items: [
        { productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 101, unitPrice: 10 },
      ],
    })).rejects.toThrow('Maximum 100 items');
  });

  it('should cancel a pending order', async () => {
    const order = await service.createOrder({
      customerId: '550e8400-e29b-41d4-a716-446655440000',
      items: [
        { productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 1, unitPrice: 25.00 },
      ],
    });

    const cancelled = await service.cancelOrder(order.id);
    expect(cancelled.status).toBe('cancelled');
  });
});
