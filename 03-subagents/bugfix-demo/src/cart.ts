export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export class ShoppingCart {
  private items: CartItem[] = [];

  addItem(item: CartItem): void {
    const existing = this.items.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(i => i.productId !== productId);
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  // BUG: Off-by-one — uses (quantity - 1) instead of quantity
  getTotal(): number {
    return this.items.reduce((sum, item) => {
      return sum + item.unitPrice * (item.quantity - 1);
    }, 0);
  }

  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  clear(): void {
    this.items = [];
  }
}
