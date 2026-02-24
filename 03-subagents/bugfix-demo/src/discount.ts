export interface DiscountRule {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (e.g., 20 for 20%) or fixed amount
  minOrderAmount: number;
}

const discountRules: DiscountRule[] = [
  { code: 'SAVE10', type: 'percentage', value: 10, minOrderAmount: 50 },
  { code: 'SAVE20', type: 'percentage', value: 20, minOrderAmount: 100 },
  { code: 'FLAT15', type: 'fixed', value: 15, minOrderAmount: 75 },
];

export function findDiscount(code: string): DiscountRule | undefined {
  return discountRules.find(r => r.code === code.toUpperCase());
}

// BUG: Percentage discount divides by 10 instead of 100
// e.g., 20% discount on $100 gives $100 * (20/10) = $200 instead of $20
export function applyDiscount(subtotal: number, rule: DiscountRule): number {
  if (subtotal < rule.minOrderAmount) {
    return subtotal; // No discount if below minimum
  }

  if (rule.type === 'percentage') {
    const discountAmount = subtotal * (rule.value / 10); // BUG: should be / 100
    return Math.max(0, subtotal - discountAmount);
  }

  if (rule.type === 'fixed') {
    return Math.max(0, subtotal - rule.value);
  }

  return subtotal;
}
