import { describe, it, expect } from 'vitest';
import { findDiscount, applyDiscount } from '../src/discount';

describe('Discount System', () => {
  it('should find valid discount codes', () => {
    const discount = findDiscount('SAVE10');
    expect(discount).toBeDefined();
    expect(discount!.value).toBe(10);
  });

  it('should be case-insensitive', () => {
    const discount = findDiscount('save20');
    expect(discount).toBeDefined();
    expect(discount!.code).toBe('SAVE20');
  });

  it('should return undefined for invalid codes', () => {
    expect(findDiscount('INVALID')).toBeUndefined();
  });

  it('should apply percentage discount correctly', () => {
    const rule = findDiscount('SAVE20')!;
    // 20% off $200 = $160
    const result = applyDiscount(200, rule);
    expect(result).toBe(160);
  });

  it('should apply 10% discount correctly', () => {
    const rule = findDiscount('SAVE10')!;
    // 10% off $100 = $90
    const result = applyDiscount(100, rule);
    expect(result).toBe(90);
  });

  it('should apply fixed discount correctly', () => {
    const rule = findDiscount('FLAT15')!;
    // $15 off $100 = $85
    const result = applyDiscount(100, rule);
    expect(result).toBe(85);
  });

  it('should not apply discount below minimum order amount', () => {
    const rule = findDiscount('SAVE20')!; // min $100
    const result = applyDiscount(50, rule);
    expect(result).toBe(50);
  });

  it('should not go below zero', () => {
    const rule = findDiscount('FLAT15')!;
    const result = applyDiscount(10, rule); // Below min, so no discount
    expect(result).toBe(10);
  });
});
