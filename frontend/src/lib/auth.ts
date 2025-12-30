import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = "your-super-secret-key-change-it"; // Matches Python backend

export function createAccessToken(data: any) {
  return jwt.sign(data, SECRET_KEY, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return null;
  }
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}
