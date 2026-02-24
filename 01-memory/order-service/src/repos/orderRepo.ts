// In production, this would use Prisma. For the workshop demo,
// we use an in-memory store so no database setup is needed.

interface OrderRecord {
  id: string;
  customerId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderRepo {
  // In-memory store for workshop demo
  private static orders: Map<string, OrderRecord> = new Map();

  async findAll(): Promise<OrderRecord[]> {
    return Array.from(OrderRepo.orders.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<OrderRecord | null> {
    return OrderRepo.orders.get(id) ?? null;
  }

  async create(data: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderRecord> {
    const now = new Date();
    const record: OrderRecord = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    OrderRepo.orders.set(record.id, record);
    return record;
  }

  async updateStatus(id: string, status: OrderRecord['status']): Promise<OrderRecord> {
    const record = OrderRepo.orders.get(id);
    if (!record) {
      throw new Error(`Order ${id} not found`);
    }
    record.status = status;
    record.updatedAt = new Date();
    return record;
  }
}
