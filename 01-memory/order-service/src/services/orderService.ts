import { OrderRepo } from '../repos/orderRepo';

interface CreateOrderInput {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface Order {
  id: string;
  customerId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export class OrderService {
  private repo = new OrderRepo();

  async listOrders(): Promise<Order[]> {
    return this.repo.findAll();
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.repo.findById(id);
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    // Business logic: calculate totals
    const items: OrderItem[] = input.items.map(item => ({
      ...item,
      subtotal: item.quantity * item.unitPrice,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Business rule: minimum order amount
    if (totalAmount < 1.0) {
      throw new Error('Order total must be at least $1.00');
    }

    // Business rule: max 100 items per order
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity > 100) {
      throw new Error('Maximum 100 items per order');
    }

    return this.repo.create({
      customerId: input.customerId,
      status: 'pending',
      totalAmount,
      items,
    });
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.repo.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Business rule: can only cancel pending orders
    if (order.status !== 'pending') {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    return this.repo.updateStatus(id, 'cancelled');
  }
}
