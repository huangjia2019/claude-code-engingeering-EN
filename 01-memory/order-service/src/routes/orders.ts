import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { OrderService } from '../services/orderService';

// Validation schemas — routes handle parsing ONLY
const createOrderSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1),
});

const orderIdSchema = z.object({
  id: z.string().uuid(),
});

export async function orderRoutes(app: FastifyInstance) {
  const orderService = new OrderService();

  // GET /api/orders
  app.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    const orders = await orderService.listOrders();
    return reply.send(orders);
  });

  // GET /api/orders/:id
  app.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = orderIdSchema.parse(request.params);
    const order = await orderService.getOrder(id);
    if (!order) {
      return reply.status(404).send({ error: 'Order not found' });
    }
    return reply.send(order);
  });

  // POST /api/orders
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = createOrderSchema.parse(request.body);
    const order = await orderService.createOrder(data);
    return reply.status(201).send(order);
  });

  // PATCH /api/orders/:id/cancel
  app.patch('/:id/cancel', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = orderIdSchema.parse(request.params);
    const order = await orderService.cancelOrder(id);
    return reply.send(order);
  });
}
