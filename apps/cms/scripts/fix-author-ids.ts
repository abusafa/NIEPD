import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAuthorIds() {
  try {
    // Find the first admin user to use as default author
    const adminUser = await prisma.user.findFirst({
      where: {
        role: {
          in: ['SUPER_ADMIN', 'ADMIN']
        }
      }
    });

    if (!adminUser) {
      console.error('No admin user found! Please create an admin user first.');
      return;
    }

    console.log(`Using admin user: ${adminUser.email} (${adminUser.id})`);

    // Update News records with NULL authorId
    const newsUpdated = await prisma.news.updateMany({
      where: {
        authorId: null
      },
      data: {
        authorId: adminUser.id
      }
    });

    console.log(`Updated ${newsUpdated.count} news records with author ID`);

    // Update Program records with NULL authorId
    const programsUpdated = await prisma.program.updateMany({
      where: {
        authorId: null
      },
      data: {
        authorId: adminUser.id
      }
    });

    console.log(`Updated ${programsUpdated.count} program records with author ID`);

    // Update Event records with NULL authorId
    const eventsUpdated = await prisma.event.updateMany({
      where: {
        authorId: null
      },
      data: {
        authorId: adminUser.id
      }
    });

    console.log(`Updated ${eventsUpdated.count} event records with author ID`);

    console.log('✅ All NULL authorId values have been fixed!');
  } catch (error) {
    console.error('❌ Error fixing author IDs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAuthorIds();
