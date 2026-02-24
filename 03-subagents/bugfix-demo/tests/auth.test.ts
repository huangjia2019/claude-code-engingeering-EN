import { describe, it, expect } from 'vitest';
import { createUser, authenticate, validateToken, hashPassword } from '../src/auth';

describe('Authentication', () => {
  it('should create a user with hashed password', () => {
    const user = createUser('test@example.com', 'password123');
    expect(user.email).toBe('test@example.com');
    expect(user.passwordHash).not.toBe('password123');
    expect(user.apiToken).toBeDefined();
  });

  it('should authenticate with correct credentials', () => {
    createUser('auth@example.com', 'secret');
    const user = authenticate('auth@example.com', 'secret');
    expect(user).not.toBeNull();
    expect(user!.email).toBe('auth@example.com');
  });

  it('should reject wrong password', () => {
    createUser('wrong@example.com', 'correct');
    const user = authenticate('wrong@example.com', 'incorrect');
    expect(user).toBeNull();
  });

  it('should validate correct token with strict equality', () => {
    const user = createUser('token@example.com', 'pass');
    // This test checks for strict equality (===) behavior
    const result = validateToken(user.apiToken, user.id);
    expect(result).toBe(true);
  });

  it('should reject invalid token', () => {
    const user = createUser('reject@example.com', 'pass');
    const result = validateToken('invalid-token', user.id);
    expect(result).toBe(false);
  });

  it('should reject token for non-existent user', () => {
    const result = validateToken('some-token', 'non-existent-id');
    expect(result).toBe(false);
  });

  it('should hash passwords consistently', () => {
    const hash1 = hashPassword('same-password');
    const hash2 = hashPassword('same-password');
    expect(hash1).toBe(hash2);
  });
});
