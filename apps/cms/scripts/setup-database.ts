import { PrismaClient } from '@prisma/client';
import { createDefaultAdmin, hashPassword } from '../src/lib/auth';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create default admin user
    await createDefaultAdmin();

    // Get admin user ID for author references
    const adminUser = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
      select: { id: true }
    });

    if (!adminUser) {
      throw new Error('Default admin user not found');
    }

    // Import existing data
    await importData(adminUser.id);

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function importData(adminUserId: string) {
  console.log('Importing data...');

  // Define data files and their corresponding models
  const dataFiles = [
    {
      file: 'users.json',
      model: 'user',
      skipDelete: true, // Don't delete existing users due to foreign key constraints
      transform: async (data: any[]) => {
        const transformedUsers = [];
        for (const item of data) {
          const hashedPassword = await hashPassword(item.password);
          transformedUsers.push({
            id: item.id.toString(),
            email: item.email,
            username: item.username,
            password: hashedPassword,
            firstName: item.firstName,
            lastName: item.lastName,
            role: item.role,
            isActive: item.isActive,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          });
        }
        return transformedUsers;
      }
    },
    {
      file: 'categories.json',
      model: 'category',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        slug: item.slug,
        nameAr: item.name_ar,
        nameEn: item.name_en,
        type: item.type.toUpperCase() as any,
        descriptionAr: item.description_ar,
        descriptionEn: item.description_en,
        parentId: item.parent_id?.toString(),
        sortOrder: item.sort_order || 0,
        status: 'PUBLISHED' as const,
        createdAt: new Date(item.created_at || Date.now()),
        updatedAt: new Date(item.updated_at || Date.now()),
      }))
    },
    {
      file: 'tags.json',
      model: 'tag',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        slug: item.slug,
        nameAr: item.name_ar,
        nameEn: item.name_en,
        createdAt: new Date(item.created_at || Date.now()),
        updatedAt: new Date(item.updated_at || Date.now()),
      }))
    },
    {
      file: 'news.json',
      model: 'news',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        titleAr: item.titleAr,
        titleEn: item.titleEn,
        summaryAr: item.summaryAr,
        summaryEn: item.summaryEn,
        contentAr: item.contentAr,
        contentEn: item.contentEn,
        slug: item.titleEn?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `news-${item.id}`,
        authorId: adminUserId,
        image: item.image,
        featured: item.featured || false,
        status: 'PUBLISHED' as const,
        publishedAt: new Date(item.dateEn || Date.now()),
        createdAt: new Date(item.dateEn || Date.now()),
        updatedAt: new Date(item.dateEn || Date.now()),
      }))
    },
    {
      file: 'programs.json',
      model: 'program',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        titleAr: item.titleAr,
        titleEn: item.titleEn,
        descriptionAr: item.descriptionAr,
        descriptionEn: item.descriptionEn,
        slug: item.titleEn?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `program-${item.id}`,
        duration: item.duration || 0,
        durationType: (item.durationType?.toUpperCase() || 'HOURS') as any,
        level: (item.level?.toUpperCase() || 'BEGINNER') as any,
        rating: item.rating || 0,
        participants: item.participants || 0,
        image: item.image,
        authorId: adminUserId,
        featuresAr: item.featuresAr,
        featuresEn: item.featuresEn,
        targetAudienceAr: item.targetAudienceAr,
        targetAudienceEn: item.targetAudienceEn,
        prerequisites: item.prerequisitesEn || item.prerequisitesAr,
        certification: item.certification,
        featured: item.featured || false,
        isFree: item.isFree !== false,
        isCertified: item.isCertified || false,
        status: item.status?.toUpperCase() === 'ACTIVE' ? 'PUBLISHED' as const : 'DRAFT' as const,
        launchDate: item.launchDate ? new Date(item.launchDate) : null,
        publishedAt: item.status?.toUpperCase() === 'ACTIVE' ? new Date(item.launchDate || Date.now()) : null,
        createdAt: new Date(item.launchDate || Date.now()),
        updatedAt: new Date(item.launchDate || Date.now()),
      }))
    },
    {
      file: 'events.json',
      model: 'event',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        titleAr: item.titleAr,
        titleEn: item.titleEn,
        summaryAr: item.summaryAr,
        summaryEn: item.summaryEn,
        descriptionAr: item.descriptionAr,
        descriptionEn: item.descriptionEn,
        slug: item.titleEn?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `event-${item.id}`,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        startTime: item.startTime ? new Date(`${item.startDate}T${item.startTime}.000Z`) : null,
        endTime: item.endTime ? new Date(`${item.startDate}T${item.endTime}.000Z`) : null,
        locationAr: item.locationAr,
        locationEn: item.locationEn,
        venueAr: item.venueAr,
        venueEn: item.venueEn,
        registrationUrl: item.registrationUrl,
        capacity: item.capacity,
        registrationDeadline: item.registrationDeadline ? new Date(item.registrationDeadline) : null,
        eventTypeAr: item.eventTypeAr,
        eventTypeEn: item.eventTypeEn,
        image: item.image,
        featured: item.featured || false,
        eventStatus: (item.status?.toUpperCase() || 'UPCOMING') as any,
        status: 'PUBLISHED' as const,
        authorId: adminUserId,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    },
    {
      file: 'pages.json',
      model: 'page',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        slug: item.slug,
        titleAr: item.title_ar,
        titleEn: item.title_en,
        metaTitleAr: item.meta_title_ar,
        metaTitleEn: item.meta_title_en,
        metaDescriptionAr: item.meta_description_ar,
        metaDescriptionEn: item.meta_description_en,
        contentAr: '', // Add content later
        contentEn: '', // Add content later
        template: item.template || 'page',
        language: 'BOTH' as const,
        parentId: item.parent_id?.toString(),
        sortOrder: item.sort_order || 0,
        status: item.status?.toUpperCase() === 'PUBLISHED' ? 'PUBLISHED' as const : 'DRAFT' as const,
        publishedAt: item.status?.toUpperCase() === 'PUBLISHED' ? new Date(item.created_at || Date.now()) : null,
        createdAt: new Date(item.created_at || Date.now()),
        updatedAt: new Date(item.updated_at || Date.now()),
      }))
    },
    {
      file: 'partners.json',
      model: 'partner',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        organizationAr: item.nameAr, // Use organization name since nameAr contains organization name
        organizationEn: item.nameEn, // Use organization name since nameEn contains organization name
        descriptionAr: item.descriptionAr,
        descriptionEn: item.descriptionEn,
        slug: item.nameEn?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `partner-${item.id}`,
        logo: item.logo,
        website: item.website,
        type: item.categoryEn || item.type, // Map categoryEn to type for better organization
        featured: item.featured || false,
        sortOrder: item.sortOrder || item.id || 0,
        status: 'PUBLISHED' as const,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    },
    {
      file: 'navigation.json',
      model: 'navigation',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        labelAr: item.title_ar,
        labelEn: item.title_en,
        url: item.url,
        parentId: item.parent_id?.toString(),
        sortOrder: item.sort_order || 0,
        isActive: item.status === 'active',
        target: item.target || '_self',
        createdAt: new Date(item.created_at || Date.now()),
        updatedAt: new Date(item.updated_at || Date.now()),
      }))
    },
    {
      file: 'contact-info.json',
      model: 'contactInfo',
      transform: (data: any) => {
        const records = [];
        let sortOrder = 0;

        // Transform contactMethods
        if (data.contactMethods && Array.isArray(data.contactMethods)) {
          for (const method of data.contactMethods) {
            records.push({
              id: `contact-${sortOrder + 1}`,
              type: 'CONTACT',
              labelAr: method.titleAr,
              labelEn: method.titleEn,
              valueAr: method.valueAr,
              valueEn: method.valueEn,
              icon: method.icon,
              sortOrder: sortOrder++,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }

        // Transform departments
        if (data.departments && Array.isArray(data.departments)) {
          for (const dept of data.departments) {
            records.push({
              id: `dept-${sortOrder + 1}`,
              type: 'DEPARTMENT',
              labelAr: dept.nameAr,
              labelEn: dept.nameEn,
              valueAr: `البريد: ${dept.email} | الهاتف: ${dept.phone}`,
              valueEn: `Email: ${dept.email} | Phone: ${dept.phone}`,
              icon: 'Building',
              sortOrder: sortOrder++,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }

        return records;
      }
    },
    {
      file: 'faq.json',
      model: 'fAQ',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        questionAr: item.questionAr,
        questionEn: item.questionEn,
        answerAr: item.answerAr,
        answerEn: item.answerEn,
        sortOrder: item.sortOrder || 0,
        status: 'PUBLISHED' as const,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    },
    {
      file: 'organizational-structure.json',
      model: 'organizationalStructure',
      transform: (data: any) => {
        const records = [];
        
        // Import board members
        if (data.board) {
          for (const member of data.board) {
            records.push({
              id: `board-${member.id}`,
              nameAr: member.nameAr,
              nameEn: member.nameEn,
              positionAr: member.titleAr || member.roleAr,
              positionEn: member.titleEn || member.roleEn,
              descriptionAr: member.bioAr,
              descriptionEn: member.bioEn,
              image: member.photo,
              sortOrder: member.id,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
        
        // Import management team
        if (data.management) {
          for (const member of data.management) {
            records.push({
              id: `mgmt-${member.id}`,
              nameAr: member.nameAr,
              nameEn: member.nameEn,
              positionAr: member.titleAr || member.roleAr,
              positionEn: member.titleEn || member.roleEn,
              descriptionAr: member.bioAr,
              descriptionEn: member.bioEn,
              image: member.photo,
              sortOrder: member.id,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
        
        // Import departments if exists
        if (data.departments) {
          for (const dept of data.departments) {
            records.push({
              id: `dept-${dept.id}`,
              nameAr: dept.nameAr,
              nameEn: dept.nameEn,
              positionAr: dept.titleAr || dept.roleAr,
              positionEn: dept.titleEn || dept.roleEn,
              descriptionAr: dept.bioAr,
              descriptionEn: dept.bioEn,
              image: dept.icon ? `/icons/${dept.icon.toLowerCase()}.svg` : null,
              sortOrder: dept.id,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        } {
          for (const dept of data.departments) {
            if (dept.staff) {
              for (const member of dept.staff) {
                records.push({
                  id: `dept-${dept.id}-${member.id}`,
                  nameAr: member.nameAr,
                  nameEn: member.nameEn,
                  positionAr: member.titleAr || member.roleAr,
                  positionEn: member.titleEn || member.roleEn,
                  descriptionAr: member.bioAr,
                  descriptionEn: member.bioEn,
                  image: member.photo,
                  sortOrder: member.id,
                  isActive: true,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }
            }
          }
        }
        
        return records;
      }
    },
    {
      file: 'contact-messages.json',
      model: 'contactMessage',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        name: item.name,
        email: item.email,
        phone: item.phone,
        subject: item.subject,
        message: item.message,
        status: item.status,
        ipAddress: item.ipAddress,
        userAgent: item.userAgent,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }))
    },
    {
      file: 'error-reports.json',
      model: 'errorReport',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        titleAr: item.titleAr,
        titleEn: item.titleEn,
        descriptionAr: item.descriptionAr,
        descriptionEn: item.descriptionEn,
        userEmail: item.userEmail,
        userName: item.userName,
        userPhone: item.userPhone,
        pageUrl: item.pageUrl,
        userAgent: item.userAgent,
        ipAddress: item.ipAddress,
        browserInfo: item.browserInfo,
        errorStack: item.errorStack,
        errorType: item.errorType,
        severity: item.severity,
        status: item.status,
        assignedToId: item.assignedToId,
        resolutionNotesAr: item.resolutionNotesAr,
        resolutionNotesEn: item.resolutionNotesEn,
        resolvedAt: item.resolvedAt ? new Date(item.resolvedAt) : null,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }))
    },
    {
      file: 'news-tags.json',
      model: 'newsTag',
      transform: (data: any[]) => data.map(item => ({
        newsId: item.newsId.toString(),
        tagId: item.tagId.toString(),
      }))
    },
    {
      file: 'program-tags.json',
      model: 'programTag',
      transform: (data: any[]) => data.map(item => ({
        programId: item.programId.toString(),
        tagId: item.tagId.toString(),
      }))
    },
    {
      file: 'event-tags.json',
      model: 'eventTag',
      transform: (data: any[]) => data.map(item => ({
        eventId: item.eventId.toString(),
        tagId: item.tagId.toString(),
      }))
    }
  ];

  const dataDirectory = path.join(process.cwd(), 'data');

  for (const { file, model, transform } of dataFiles) {
    try {
      const filePath = path.join(dataDirectory, file);
      
      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}, skipping...`);
        continue;
      }

      const rawData = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(rawData);
      const transformedData = await transform(jsonData);

      console.log(`Importing ${transformedData.length} records from ${file}...`);

      // Clear existing data
      await (prisma as any)[model].deleteMany();

      // Import new data
      for (const item of transformedData) {
        try {
          await (prisma as any)[model].create({ data: item });
        } catch (error) {
          console.error(`Error importing ${model} record:`, error);
        }
      }

      console.log(`✓ Imported ${file}`);
    } catch (error) {
      console.error(`Error importing ${file}:`, error);
    }
  }

  // Import site settings
  try {
    const settingsFile = path.join(dataDirectory, 'site_settings.json');
    if (fs.existsSync(settingsFile)) {
      const settingsData = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
      await prisma.siteSetting.deleteMany();
      
      for (const setting of settingsData) {
        await prisma.siteSetting.create({
          data: {
            key: setting.key,
            valueAr: setting.value_ar,
            valueEn: setting.value_en,
            type: setting.type || 'text',
            groupName: setting.group_name,
          }
        });
      }
      console.log('✓ Imported site settings');
    }
  } catch (error) {
    console.error('Error importing site settings:', error);
  }

  // Import brand colors as site settings
  try {
    const brandColorsFile = path.join(dataDirectory, 'brand-colors.json');
    if (fs.existsSync(brandColorsFile)) {
      const brandColorsData = JSON.parse(fs.readFileSync(brandColorsFile, 'utf8'));
      
      // Store brand colors as a single JSON setting
      await prisma.siteSetting.create({
        data: {
          key: 'brand_colors',
          valueEn: JSON.stringify(brandColorsData),
          valueAr: JSON.stringify(brandColorsData),
          type: 'json',
          groupName: 'branding',
        }
      });
      console.log('✓ Imported brand colors');
    }
  } catch (error) {
    console.error('Error importing brand colors:', error);
  }

  // Import statistics as site settings
  try {
    const statisticsFile = path.join(dataDirectory, 'statistics.json');
    if (fs.existsSync(statisticsFile)) {
      const statisticsData = JSON.parse(fs.readFileSync(statisticsFile, 'utf8'));
      
      // Store statistics as individual settings or as JSON
      await prisma.siteSetting.create({
        data: {
          key: 'institute_statistics',
          valueEn: JSON.stringify(statisticsData),
          valueAr: JSON.stringify(statisticsData),
          type: 'json',
          groupName: 'statistics',
        }
      });
      console.log('✓ Imported statistics');
    }
  } catch (error) {
    console.error('Error importing statistics:', error);
  }

  // Import media files
  try {
    const mediaFile = path.join(dataDirectory, 'media.csv');
    if (fs.existsSync(mediaFile)) {
      const csvContent = fs.readFileSync(mediaFile, 'utf8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      await prisma.media.deleteMany();
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length >= headers.length) {
          const mediaData = {
            filename: values[headers.indexOf('filename')] || `media-${i}`,
            originalName: values[headers.indexOf('original_name')] || values[headers.indexOf('filename')] || `media-${i}`,
            mimeType: values[headers.indexOf('mime_type')] || 'image/jpeg',
            size: parseInt(values[headers.indexOf('size')] || '0'),
            path: values[headers.indexOf('path')] || values[headers.indexOf('url')] || `/uploads/${values[headers.indexOf('filename')] || `media-${i}`}`,
            alt: values[headers.indexOf('alt_text_en')] || values[headers.indexOf('alt_text_ar')] || '',
            description: values[headers.indexOf('description')] || '',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          await prisma.media.create({ data: mediaData });
        }
      }
      console.log('✓ Imported media files');
    }
  } catch (error) {
    console.error('Error importing media files:', error);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Database setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}
