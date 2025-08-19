import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  isActive: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      userId: user.id, 
      role: user.role,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function getUserFromToken(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
    
    if (!user || !user.isActive) {
      return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
}

export function hasPermission(userRole: string, requiredRoles: string[]): boolean {
  const roleHierarchy = {
    'SUPER_ADMIN': 5,
    'ADMIN': 4,
    'EDITOR': 3,
    'AUTHOR': 2,
    'VIEWER': 1,
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = Math.min(...requiredRoles.map(role => roleHierarchy[role as keyof typeof roleHierarchy] || 0));
  
  return userLevel >= requiredLevel;
}

export async function createDefaultAdmin() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });
  
  if (!existingAdmin) {
    const hashedPassword = await hashPassword('admin123');
    await prisma.user.create({
      data: {
        email: 'admin@niepd.sa',
        username: 'admin',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    console.log('Default admin user created: admin@niepd.sa / admin123');
  }
}
