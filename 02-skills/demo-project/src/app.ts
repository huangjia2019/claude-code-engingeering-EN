// This file has intentional issues for code review practice.
// Can you spot them all?

import Fastify from 'fastify';

const app = Fastify();

// Issue: hardcoded database credentials
const DB_HOST = 'production-db.company.com';
const DB_PASSWORD = 'super_secret_p@ssw0rd_123';

const users: any[] = []; // Issue: using 'any'

// Issue: business logic in route handler (should be in service layer)
app.get('/api/users', async (request, reply) => {
  // Issue: no pagination
  return reply.send(users);
});

app.post('/api/users', async (request, reply) => {
  const body = request.body as any; // Issue: no input validation

  // Issue: SQL injection risk (simulated)
  const query = `SELECT * FROM users WHERE email = '${body.email}'`;
  console.log('Would execute:', query);

  // Issue: business logic in route
  if (users.length > 1000) {
    return reply.status(400).send({ error: 'Too many users' });
  }

  const user = {
    id: Math.random().toString(36).slice(2), // Issue: not UUID
    name: body.name,
    email: body.email,
    password: body.password, // Issue: storing plain text password
    createdAt: new Date(),
  };

  users.push(user);

  // Issue: returning password in response
  return reply.status(201).send(user);
});

// Issue: no error handling for non-existent user
app.get('/api/users/:id', async (request, reply) => {
  const { id } = request.params as any;
  const user = users.find(u => u.id === id);
  return reply.send(user); // Could send undefined
});

// Unused function — dead code
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

app.listen({ port: 3000 });

export { app };
