import { createHash, timingSafeEqual } from 'crypto';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  apiToken: string;
}

// Simple in-memory user store for demo
const users: Map<string, User> = new Map();

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function createUser(email: string, password: string): User {
  const user: User = {
    id: crypto.randomUUID(),
    email,
    passwordHash: hashPassword(password),
    apiToken: crypto.randomUUID(),
  };
  users.set(user.id, user);
  return user;
}

export function authenticate(email: string, password: string): User | null {
  const hash = hashPassword(password);
  for (const user of users.values()) {
    if (user.email === email && user.passwordHash === hash) {
      return user;
    }
  }
  return null;
}

// BUG: Uses simple string comparison (==) instead of timing-safe comparison
// This is vulnerable to timing attacks on API token validation
export function validateToken(providedToken: string, userId: string): boolean {
  const user = users.get(userId);
  if (!user) return false;

  // BUG: Should use timingSafeEqual to prevent timing attacks
  return providedToken == user.apiToken;
}

export function getUser(id: string): User | undefined {
  return users.get(id);
}
