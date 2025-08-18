import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
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
      const authHeader = req.headers.get('authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        user = await prisma.user.findUnique({ 
          where: { id: decoded.userId }
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
    
    return {
      user,
      prisma,
    };
  },
});

export { handler as GET, handler as POST };
