import Fastify from 'fastify';
import cors from '@fastify/cors';
import { orderRoutes } from './routes/orders';

const app = Fastify({ logger: true });

app.register(cors, { origin: true });
app.register(orderRoutes, { prefix: '/api/orders' });

app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { app };
