// lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { getAdminUser as getAdminUserFromDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number, username: string) {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' });
}

export async function getAdminUser(username: string) {
  return getAdminUserFromDb(username);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getAuthToken() {
  try {
    const cookieStore = cookies();
    return cookieStore.get('admin_token')?.value;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const token = getAuthToken();
  if (!token) return false;
  return verifyToken(token) !== null;
}

export function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}