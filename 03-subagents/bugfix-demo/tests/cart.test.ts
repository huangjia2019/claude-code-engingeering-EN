import { describe, it, expect, beforeEach } from 'vitest';
import { ShoppingCart } from '../src/cart';

describe('ShoppingCart', () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  it('should add items to cart', () => {
    cart.addItem({ productId: 'p1', name: 'Widget', quantity: 2, unitPrice: 10 });
    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItemCount()).toBe(2);
  });

  it('should merge quantities for same product', () => {
    cart.addItem({ productId: 'p1', name: 'Widget', quantity: 2, unitPrice: 10 });
    cart.addItem({ productId: 'p1', name: 'Widget', quantity: 3, unitPrice: 10 });
    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItemCount()).toBe(5);
  });

  it('should calculate correct total', () => {
    cart.addItem({ productId: 'p1', name: 'Widget', quantity: 2, unitPrice: 10 });
    cart.addItem({ productId: 'p2', name: 'Gadget', quantity: 1, unitPrice: 25 });
    // Expected: 2 * 10 + 1 * 25 = 45
    expect(cart.getTotal()).toBe(45);
  });

  it('should calculate total for single item', () => {
    cart.addItem({ productId: 'p1', name: 'Widget', quantity: 1, unitPrice: 50 });
    // Expected: 1 * 50 = 50
    expect(cart.getTotal()).toBe(50);
  });

  it('should remove items', () => {
    cart.addItem({ productId: 'p1', name: 'Widget', quantity: 2, unitPrice: 10 });
    cart.removeItem('p1');
    expect(cart.getItems()).toHaveLength(0);
  });

  it('should clear all items', () => {
    cart.addItem({ productId: 'p1', name: 'Widget', quantity: 2, unitPrice: 10 });
    cart.addItem({ productId: 'p2', name: 'Gadget', quantity: 1, unitPrice: 25 });
    cart.clear();
    expect(cart.getItems()).toHaveLength(0);
    expect(cart.getTotal()).toBe(0);
  });
});
