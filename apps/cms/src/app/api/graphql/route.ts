import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { typeDefs } from '@/lib/graphql/schema';
import { resolvers } from '@/lib/graphql/resolvers';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
});

// Create Next.js handler
const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    let user = null;
    
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string; email: string };
        user = await prisma.user.findUnique({ 
          where: { id: decoded.userId }
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
    
    return {
      user: user || undefined,
      prisma,
    };
  },
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
