import { GraphQLDateTime } from 'graphql-scalars';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export const resolvers = {
  DateTime: GraphQLDateTime,
  JSON: {
    serialize: (value: any) => value,
    parseValue: (value: any) => value,
    parseLiteral: (ast: any) => ast.value,
  },

  Query: {
    // Auth queries
    me: async (_: any, __: any, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      return await prisma.user.findUnique({ where: { id: user.id } });
    },

    users: async (_: any, __: any, { user }: { user: any }) => {
      if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
        throw new Error('Not authorized');
      }
      return await prisma.user.findMany();
    },

    user: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
        throw new Error('Not authorized');
      }
      return await prisma.user.findUnique({ where: { id } });
    },

    // News queries
    news: async (_: any, __: any) => {
      return await prisma.news.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: 'desc' },
      });
    },

    newsItem: async (_: any, { slug }: { slug: string }) => {
      return await prisma.news.findUnique({
        where: { slug },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      });
    },

    // Program queries
    programs: async (_: any, __: any) => {
      return await prisma.program.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: 'desc' },
      });
    },

    program: async (_: any, { slug }: { slug: string }) => {
      return await prisma.program.findUnique({
        where: { slug },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      });
    },

    // Event queries
    events: async (_: any, __: any) => {
      return await prisma.event.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
        orderBy: { startDate: 'asc' },
      });
    },

    event: async (_: any, { slug }: { slug: string }) => {
      return await prisma.event.findUnique({
        where: { slug },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      });
    },

    // Page queries
    pages: async (_: any, __: any) => {
      return await prisma.page.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          parent: true,
          children: true,
          author: true,
        },
        orderBy: { sortOrder: 'asc' },
      });
    },

    page: async (_: any, { slug }: { slug: string }) => {
      return await prisma.page.findUnique({
        where: { slug },
        include: {
          parent: true,
          children: true,
          author: true,
        },
      });
    },

    // FAQ queries
    faqs: async (_: any, __: any) => {
      return await prisma.fAQ.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
          author: true,
        },
        orderBy: { sortOrder: 'asc' },
      });
    },

    // Partner queries
    partners: async (_: any, __: any) => {
      return await prisma.partner.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          author: true,
        },
        orderBy: { sortOrder: 'asc' },
      });
    },

    partner: async (_: any, { slug }: { slug: string }) => {
      return await prisma.partner.findUnique({
        where: { slug },
        include: {
          author: true,
        },
      });
    },

    // Category queries
    categories: async (_: any, { type }: { type?: string }) => {
      const where = type ? { type } : {};
      return await prisma.category.findMany({
        where,
        include: {
          parent: true,
          children: true,
        },
        orderBy: { sortOrder: 'asc' },
      });
    },

    category: async (_: any, { slug }: { slug: string }) => {
      return await prisma.category.findUnique({
        where: { slug },
        include: {
          parent: true,
          children: true,
        },
      });
    },

    // Tag queries
    tags: async (_: any, __: any) => {
      return await prisma.tag.findMany({
        orderBy: { nameEn: 'asc' },
      });
    },

    tag: async (_: any, { slug }: { slug: string }) => {
      return await prisma.tag.findUnique({
        where: { slug },
      });
    },

    // Site data queries
    navigation: async (_: any, __: any) => {
      return await prisma.navigation.findMany({
        where: { isActive: true },
        include: {
          parent: true,
          children: true,
        },
        orderBy: { sortOrder: 'asc' },
      });
    },

    contactInfo: async (_: any, __: any) => {
      return await prisma.contactInfo.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
    },

    siteSettings: async (_: any, __: any) => {
      return await prisma.siteSetting.findMany();
    },

    organizationalStructure: async (_: any, __: any) => {
      return await prisma.organizationalStructure.findMany({
        where: { isActive: true },
        include: {
          parent: true,
          children: true,
        },
        orderBy: { sortOrder: 'asc' },
      });
    },

    media: async (_: any, __: any) => {
      return await prisma.media.findMany({
        orderBy: { createdAt: 'desc' },
      });
    },
  },

  Mutation: {
    // Auth mutations
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Invalid credentials');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid credentials');

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
      return { user, token };
    },

    // News mutations
    createNews: async (_: any, { input }: { input: any }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { tagIds, ...newsData } = input;
      const news = await prisma.news.create({
        data: {
          ...newsData,
          authorId: user.id,
          tags: tagIds ? {
            create: tagIds.map((tagId: string) => ({ tagId }))
          } : undefined,
        },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      });
      return news;
    },

    updateNews: async (_: any, { id, input }: { id: string; input: any }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { tagIds, ...newsData } = input;
      
      // Delete existing tags
      await prisma.newsTag.deleteMany({ where: { newsId: id } });
      
      const news = await prisma.news.update({
        where: { id },
        data: {
          ...newsData,
          tags: tagIds ? {
            create: tagIds.map((tagId: string) => ({ tagId }))
          } : undefined,
        },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      });
      return news;
    },

    deleteNews: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      await prisma.news.delete({ where: { id } });
      return true;
    },

    // Program mutations
    createProgram: async (_: any, { input }: { input: any }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { tagIds, ...programData } = input;
      const program = await prisma.program.create({
        data: {
          ...programData,
          authorId: user.id,
          tags: tagIds ? {
            create: tagIds.map((tagId: string) => ({ tagId }))
          } : undefined,
        },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      });
      return program;
    },

    updateProgram: async (_: any, { id, input }: { id: string; input: any }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { tagIds, ...programData } = input;
      
      // Delete existing tags
      await prisma.programTag.deleteMany({ where: { programId: id } });
      
      const program = await prisma.program.update({
        where: { id },
        data: {
          ...programData,
          tags: tagIds ? {
            create: tagIds.map((tagId: string) => ({ tagId }))
          } : undefined,
        },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      });
      return program;
    },

    deleteProgram: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      await prisma.program.delete({ where: { id } });
      return true;
    },

    // Event mutations
    createEvent: async (_: any, { input }: { input: any }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { tagIds, ...eventData } = input;
      const event = await prisma.event.create({
        data: {
          ...eventData,
          authorId: user.id,
          tags: tagIds ? {
            create: tagIds.map((tagId: string) => ({ tagId }))
          } : undefined,
        },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      });
      return event;
    },

    updateEvent: async (_: any, { id, input }: { id: string; input: any }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { tagIds, ...eventData } = input;
      
      // Delete existing tags
      await prisma.eventTag.deleteMany({ where: { eventId: id } });
      
      const event = await prisma.event.update({
        where: { id },
        data: {
          ...eventData,
          tags: tagIds ? {
            create: tagIds.map((tagId: string) => ({ tagId }))
          } : undefined,
        },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      });
      return event;
    },

    deleteEvent: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      await prisma.event.delete({ where: { id } });
      return true;
    },

    // Category mutations
    createCategory: async (_: any, { input }: { input: any }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const category = await prisma.category.create({
        data: input,
        include: {
          parent: true,
          children: true,
        },
      });
      return category;
    },

    updateCategory: async (_: any, { id, input }: { id: string; input: any }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const category = await prisma.category.update({
        where: { id },
        data: input,
        include: {
          parent: true,
          children: true,
        },
      });
      return category;
    },

    deleteCategory: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      await prisma.category.delete({ where: { id } });
      return true;
    },

    // Tag mutations
    createTag: async (_: any, { input }: { input: any }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const tag = await prisma.tag.create({
        data: input,
      });
      return tag;
    },

    updateTag: async (_: any, { id, input }: { id: string; input: any }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const tag = await prisma.tag.update({
        where: { id },
        data: input,
      });
      return tag;
    },

    deleteTag: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      await prisma.tag.delete({ where: { id } });
      return true;
    },

    // Publishing workflow
    publishContent: async (_: any, { contentType, id }: { contentType: string; id: string }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const updateData = { 
        status: 'PUBLISHED' as const, 
        publishedAt: new Date() 
      };
      
      switch (contentType) {
        case 'news':
          await prisma.news.update({ where: { id }, data: updateData });
          break;
        case 'program':
          await prisma.program.update({ where: { id }, data: updateData });
          break;
        case 'event':
          await prisma.event.update({ where: { id }, data: updateData });
          break;
        default:
          throw new Error('Invalid content type');
      }
      
      return true;
    },

    unpublishContent: async (_: any, { contentType, id }: { contentType: string; id: string }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const updateData = { 
        status: 'DRAFT' as const, 
        publishedAt: null 
      };
      
      switch (contentType) {
        case 'news':
          await prisma.news.update({ where: { id }, data: updateData });
          break;
        case 'program':
          await prisma.program.update({ where: { id }, data: updateData });
          break;
        case 'event':
          await prisma.event.update({ where: { id }, data: updateData });
          break;
        default:
          throw new Error('Invalid content type');
      }
      
      return true;
    },

    submitForReview: async (_: any, { contentType, id }: { contentType: string; id: string }, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      
      const updateData = { status: 'REVIEW' as const };
      
      switch (contentType) {
        case 'news':
          await prisma.news.update({ where: { id }, data: updateData });
          break;
        case 'program':
          await prisma.program.update({ where: { id }, data: updateData });
          break;
        case 'event':
          await prisma.event.update({ where: { id }, data: updateData });
          break;
        default:
          throw new Error('Invalid content type');
      }
      
      return true;
    },
  },

  // Field resolvers
  News: {
    tags: async (parent: any) => {
      const newsWithTags = await prisma.news.findUnique({
        where: { id: parent.id },
        include: { tags: { include: { tag: true } } },
      });
      return newsWithTags?.tags.map(nt => nt.tag) || [];
    },
  },

  Program: {
    tags: async (parent: any) => {
      const programWithTags = await prisma.program.findUnique({
        where: { id: parent.id },
        include: { tags: { include: { tag: true } } },
      });
      return programWithTags?.tags.map(pt => pt.tag) || [];
    },
  },

  Event: {
    tags: async (parent: any) => {
      const eventWithTags = await prisma.event.findUnique({
        where: { id: parent.id },
        include: { tags: { include: { tag: true } } },
      });
      return eventWithTags?.tags.map(et => et.tag) || [];
    },
  },

  Category: {
    newsCount: async (parent: any) => {
      return await prisma.news.count({ where: { categoryId: parent.id } });
    },
    programsCount: async (parent: any) => {
      return await prisma.program.count({ where: { categoryId: parent.id } });
    },
    eventsCount: async (parent: any) => {
      return await prisma.event.count({ where: { categoryId: parent.id } });
    },
  },
};
