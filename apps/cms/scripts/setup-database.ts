import { PrismaClient } from '@prisma/client';
import { createDefaultAdmin } from '../src/lib/auth';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create default admin user
    await createDefaultAdmin();

    // Import existing data
    await importData();

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function importData() {
  console.log('Importing data...');

  // Define data files and their corresponding models
  const dataFiles = [
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
        authorAr: item.authorAr,
        authorEn: item.authorEn,
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
        instructorAr: item.instructorAr,
        instructorEn: item.instructorEn,
        rating: item.rating || 0,
        participants: item.participants || 0,
        image: item.image,
        partnerAr: item.partnerAr,
        partnerEn: item.partnerEn,
        featuresAr: item.featuresAr,
        featuresEn: item.featuresEn,
        targetAudienceAr: item.targetAudienceAr,
        targetAudienceEn: item.targetAudienceEn,
        prerequisitesAr: item.prerequisitesAr,
        prerequisitesEn: item.prerequisitesEn,
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
        startTime: item.startTime,
        endTime: item.endTime,
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
        descriptionAr: item.descriptionAr,
        descriptionEn: item.descriptionEn,
        slug: item.nameEn?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `partner-${item.id}`,
        logo: item.logo,
        website: item.website,
        type: item.type,
        featured: item.featured || false,
        sortOrder: item.sortOrder || 0,
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
        labelAr: item.labelAr,
        labelEn: item.labelEn,
        url: item.url,
        parentId: item.parentId?.toString(),
        sortOrder: item.sortOrder || 0,
        isActive: item.isActive !== false,
        target: item.target || '_self',
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    },
    {
      file: 'contact-info.json',
      model: 'contactInfo',
      transform: (data: any[]) => data.map(item => ({
        id: item.id.toString(),
        type: item.type,
        labelAr: item.labelAr,
        labelEn: item.labelEn,
        valueAr: item.valueAr,
        valueEn: item.valueEn,
        icon: item.icon,
        sortOrder: item.sortOrder || 0,
        isActive: item.isActive !== false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
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
        
        // Import executive team if exists
        if (data.executive) {
          for (const member of data.executive) {
            records.push({
              id: `exec-${member.id}`,
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
      const transformedData = transform(jsonData);

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
