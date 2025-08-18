const fs = require('fs');
const path = require('path');

// Sample data to seed
const sampleNews = [
  {
    titleAr: "إطلاق المرحلة الثانية من البرامج التطويرية",
    titleEn: "Launch of Second Phase of Development Programs",
    summaryAr: "يسعد المعهد الإعلان عن بدء التسجيل في المرحلة الثانية من البرامج التطويرية للمعلمين",
    summaryEn: "The institute is pleased to announce the start of registration for the second phase of teacher development programs",
    contentAr: "أطلق المعهد الوطني للتطوير المهني التعليمي اليوم المرحلة الثانية من برامجه التطويرية المتقدمة، والتي تستهدف تطوير قدرات المعلمين والقيادات التعليمية في مجالات التكنولوجيا الحديثة والابتكار في التعليم.",
    contentEn: "The National Institute for Professional Educational Development today launched the second phase of its advanced development programs, targeting the development of teachers and educational leaders capabilities in modern technology and innovation in education.",
    category: "programs",
    authorAr: "إدارة الإعلام",
    authorEn: "Media Department",
    dateAr: "15 يناير 2024",
    dateEn: "January 15, 2024",
    featured: true,
    publishedAt: new Date()
  },
  {
    titleAr: "شراكة استراتيجية مع جامعة سنغافورة الوطنية",
    titleEn: "Strategic Partnership with National University of Singapore",
    summaryAr: "وقع المعهد اتفاقية شراكة مع جامعة سنغافورة الوطنية لتطوير برامج القيادة التعليمية",
    summaryEn: "The institute signed a partnership agreement with the National University of Singapore to develop educational leadership programs",
    contentAr: "في خطوة مهمة نحو التطوير والتميز، وقع المعهد الوطني للتطوير المهني التعليمي اتفاقية شراكة استراتيجية مع جامعة سنغافورة الوطنية، إحدى الجامعات الرائدة عالمياً في مجال التعليم والبحث العلمي.",
    contentEn: "In an important step towards development and excellence, the National Institute for Professional Educational Development signed a strategic partnership agreement with the National University of Singapore, one of the world's leading universities in education and scientific research.",
    category: "partnerships",
    authorAr: "قسم الشراكات الدولية",
    authorEn: "International Partnerships Department",
    dateAr: "10 يناير 2024",
    dateEn: "January 10, 2024",
    featured: true,
    publishedAt: new Date()
  }
];

const samplePrograms = [
  {
    titleAr: "برنامج إعداد المعلم",
    titleEn: "Teacher Preparation Program",
    descriptionAr: "برنامج استراتيجي شامل لإعداد المعلمين الجدد وتأهيلهم للعمل في الميدان التعليمي بأعلى المعايير المهنية",
    descriptionEn: "Comprehensive strategic program for preparing new teachers and qualifying them to work in the educational field with the highest professional standards",
    category: "educational",
    duration: 120,
    durationType: "hours",
    level: "intermediate",
    instructorAr: "د. أحمد محمد",
    instructorEn: "Dr. Ahmed Mohamed",
    rating: 4.8,
    participants: 890,
    partnerAr: "المعهد الوطني للتعليم - سنغافورة",
    partnerEn: "National Institute of Education - Singapore",
    featuresAr: ["منهج عالمي متطور", "تدريب عملي مكثف", "شهادة معتمدة دولياً"],
    featuresEn: ["Advanced global curriculum", "Intensive practical training", "Internationally accredited certificate"],
    targetAudienceAr: "جميع المعلمين",
    targetAudienceEn: "All Teachers",
    prerequisitesAr: "بكالوريوس في التخصص",
    prerequisitesEn: "Bachelor's degree in specialization",
    certification: "معتمدة",
    status: "active",
    featured: true,
    launchDate: "2021-03-01",
    isFree: true,
    isCertified: true,
    publishedAt: new Date()
  },
  {
    titleAr: "برنامج القيادة التعليمية",
    titleEn: "Educational Leadership Program",
    descriptionAr: "برنامج متخصص لتطوير قدرات القيادات المدرسية والإدارية في المؤسسات التعليمية",
    descriptionEn: "Specialized program for developing the capabilities of school and administrative leaders in educational institutions",
    category: "leadership",
    duration: 60,
    durationType: "hours",
    level: "advanced",
    instructorAr: "د. خالد السعيد",
    instructorEn: "Dr. Khalid Al-Saeed",
    rating: 4.7,
    participants: 450,
    partnerAr: "معهد الإدارة العامة",
    partnerEn: "Institute of Public Administration",
    featuresAr: ["مهارات القيادة التحويلية", "إدارة التغيير", "بناء الفرق الفعالة"],
    featuresEn: ["Transformational leadership skills", "Change management", "Building effective teams"],
    targetAudienceAr: "القيادات التعليمية",
    targetAudienceEn: "Educational Leaders",
    prerequisitesAr: "خبرة إدارية لا تقل عن 3 سنوات",
    prerequisitesEn: "Minimum 3 years management experience",
    certification: "معتمدة",
    status: "active",
    featured: true,
    launchDate: "2021-06-01",
    isFree: true,
    isCertified: true,
    publishedAt: new Date()
  }
];

const sampleEvents = [
  {
    titleAr: "لقاء دور الإدارة المدرسية في بناء العلاقات الإيجابية",
    titleEn: "Session on School Administration Role in Building Positive Relationships",
    summaryAr: "لقاء تطويري متخصص يناقش دور الإدارة المدرسية في بناء العلاقات الإيجابية داخل المجتمع المدرسي",
    summaryEn: "Specialized development session discussing the role of school administration in building positive relationships within the school community",
    descriptionAr: "ينظم المعهد الوطني للتطوير المهني التعليمي لقاءً تطويرياً متخصصاً حول دور الإدارة المدرسية في بناء العلاقات الإيجابية.",
    descriptionEn: "The National Institute for Educational Professional Development organizes a specialized development session on the role of school administration in building positive relationships.",
    startDate: "2025-08-18",
    endDate: "2025-08-18",
    startTime: "09:00:00",
    endTime: "12:00:00",
    locationAr: "افتراضي",
    locationEn: "Virtual",
    venueAr: "منصة زووم",
    venueEn: "Zoom Platform",
    registrationUrl: "https://niepd.futurex.sa/events/register/1",
    capacity: 500,
    registrationDeadline: "2025-08-15",
    eventTypeAr: "لقاء تطويري",
    eventTypeEn: "Development Session",
    status: "upcoming",
    featured: true,
    category: "sessions",
    publishedAt: new Date()
  },
  {
    titleAr: "المعرض الدولي للتعليم",
    titleEn: "International Education Exhibition",
    summaryAr: "المعهد الوطني للتطوير المهني التعليمي يشارك في المعرض الدولي للتعليم ويقدم ورش عمل متخصصة",
    summaryEn: "National Institute for Educational Professional Development participates in International Education Exhibition and presents specialized workshops",
    descriptionAr: "شارك المعهد الوطني للتطوير المهني التعليمي في المعرض الدولي للتعليم، حيث قدم عرضاً شاملاً لبرامجه وخدماته التطويرية.",
    descriptionEn: "The National Institute for Educational Professional Development participated in the International Education Exhibition, where it presented a comprehensive display of its programs and development services.",
    startDate: "2025-04-15",
    endDate: "2025-04-17",
    startTime: "09:00:00",
    endTime: "18:00:00",
    locationAr: "الرياض",
    locationEn: "Riyadh",
    venueAr: "مركز الرياض الدولي للمؤتمرات والمعارض",
    venueEn: "Riyadh International Convention & Exhibition Center",
    capacity: 10000,
    eventTypeAr: "معرض",
    eventTypeEn: "Exhibition",
    status: "upcoming",
    featured: true,
    category: "conferences",
    publishedAt: new Date()
  }
];

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    console.log('🚀 Starting NIEPD CMS bootstrap...');

    try {
      // Enable API permissions for public role
      console.log('🔐 Setting up API permissions...');
      
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      if (publicRole) {
        // Enable permissions for all content types
        const permissions = await strapi.query('plugin::users-permissions.permission').findMany({
          where: {
            role: publicRole.id,
            action: { $in: ['find', 'findOne'] }
          }
        });

        for (const permission of permissions) {
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: permission.id },
            data: { enabled: true }
          });
        }
        console.log('✅ API permissions enabled for all content types');
      }

      // Check if data already exists
      const existingNews = await strapi.entityService.findMany('api::news.news', {
        limit: 1,
      });

      if (existingNews.length > 0) {
        console.log('📊 Data already exists, skipping seeding...');
        return;
      }

      console.log('📥 Starting data seeding...');

      // Seed News
      console.log('📰 Seeding news articles...');
      let newsCount = 0;
      for (const newsItem of sampleNews) {
        try {
          await strapi.entityService.create('api::news.news', {
            data: newsItem,
          });
          newsCount++;
          console.log(`✅ Created news: ${newsItem.titleEn}`);
        } catch (error) {
          console.log(`⚠️  Error creating news: ${newsItem.titleEn} - ${error.message}`);
        }
      }

      // Seed Programs
      console.log('🎓 Seeding programs...');
      let programsCount = 0;
      for (const program of samplePrograms) {
        try {
          await strapi.entityService.create('api::program.program', {
            data: program,
          });
          programsCount++;
          console.log(`✅ Created program: ${program.titleEn}`);
        } catch (error) {
          console.log(`⚠️  Error creating program: ${program.titleEn} - ${error.message}`);
        }
      }

      // Seed Events
      console.log('📅 Seeding events...');
      let eventsCount = 0;
      for (const event of sampleEvents) {
        try {
          await strapi.entityService.create('api::event.event', {
            data: event,
          });
          eventsCount++;
          console.log(`✅ Created event: ${event.titleEn}`);
        } catch (error) {
          console.log(`⚠️  Error creating event: ${event.titleEn} - ${error.message}`);
        }
      }

      // Seed additional content types with data from JSON files
      console.log('📂 Seeding additional content types...');
      
      // Categories data
      const categoriesData = [
        { slug: "programs", nameAr: "البرامج", nameEn: "Programs", type: "news", descriptionAr: "أخبار البرامج والدورات التدريبية", descriptionEn: "News about programs and training courses", sortOrder: 1, status: "active" },
        { slug: "events", nameAr: "الفعاليات", nameEn: "Events", type: "news", descriptionAr: "الفعاليات واللقاءات والمؤتمرات", descriptionEn: "Events meetings and conferences", sortOrder: 2, status: "active" },
        { slug: "general-education", nameAr: "التربوي العام", nameEn: "General Education", type: "program", descriptionAr: "برامج التطوير المهني العامة", descriptionEn: "General professional development programs", sortOrder: 1, status: "active" },
        { slug: "teacher-preparation", nameAr: "إعداد المعلم", nameEn: "Teacher Preparation", type: "program", descriptionAr: "برامج إعداد المعلمين الجدد", descriptionEn: "New teacher preparation programs", sortOrder: 2, status: "active" }
      ];

      // Tags data
      const tagsData = [
        { slug: "teacher-preparation", nameAr: "إعداد المعلم", nameEn: "Teacher Preparation", descriptionAr: "برامج إعداد وتأهيل المعلمين", descriptionEn: "Teacher preparation and qualification programs", status: "active" },
        { slug: "singapore", nameAr: "سنغافورة", nameEn: "Singapore", descriptionAr: "الشراكة مع سنغافورة", descriptionEn: "Partnership with Singapore", status: "active" },
        { slug: "professional-development", nameAr: "تطوير مهني", nameEn: "Professional Development", descriptionAr: "التطوير المهني للمعلمين", descriptionEn: "Professional development for teachers", status: "active" },
        { slug: "stem", nameAr: "STEM", nameEn: "STEM", descriptionAr: "العلوم والتكنولوجيا والهندسة والرياضيات", descriptionEn: "Science Technology Engineering Mathematics", status: "active" }
      ];

      // Partners data
      const partnersData = [
        { nameAr: "وزارة التعليم", nameEn: "Ministry of Education", descriptionAr: "الجهة الحكومية المشرفة على التعليم في المملكة العربية السعودية", descriptionEn: "The government body overseeing education in the Kingdom of Saudi Arabia", type: "local", categoryAr: "حكومي", categoryEn: "Government", since: "2019", website: "https://moe.gov.sa" },
        { nameAr: "جامعة سنغافورة الوطنية", nameEn: "National University of Singapore", descriptionAr: "إحدى الجامعات الرائدة عالمياً في مجال التعليم والبحث العلمي", descriptionEn: "One of the world's leading universities in education and scientific research", type: "international", categoryAr: "أكاديمي", categoryEn: "Academic", since: "2021", website: "https://nus.edu.sg" },
        { nameAr: "المركز الوطني للتعليم الإلكتروني", nameEn: "National Center for E-Learning", descriptionAr: "مركز متخصص في تطوير وتنظيم التعليم الإلكتروني في المملكة", descriptionEn: "A specialized center for developing and regulating e-learning in the Kingdom", type: "local", categoryAr: "تعليمي", categoryEn: "Educational", since: "2020", website: "https://nelc.gov.sa" }
      ];

      // Site Settings data
      const siteSettingsData = [
        { key: "site_name", valueAr: "المعهد الوطني للتطوير المهني التعليمي", valueEn: "National Institute for Educational Professional Development", type: "text", category: "general", descriptionAr: "اسم الموقع الرسمي", descriptionEn: "Official site name", status: "active" },
        { key: "site_tagline", valueAr: "رائد وشريك استراتيجي في بناء القدرات التعليمية", valueEn: "Leading strategic partner in building educational capacities", type: "text", category: "general", descriptionAr: "شعار الموقع", descriptionEn: "Site tagline", status: "active" },
        { key: "contact_email", valueAr: "niepd@moe.gov.sa", valueEn: "niepd@moe.gov.sa", type: "email", category: "contact", descriptionAr: "البريد الإلكتروني الرئيسي", descriptionEn: "Main contact email", status: "active" }
      ];

      // Seed Categories
      let categoriesCount = 0;
      for (const category of categoriesData) {
        try {
          await strapi.entityService.create('api::category.category', {
            data: { ...category, publishedAt: new Date() },
          });
          categoriesCount++;
          console.log(`✅ Created category: ${category.nameEn}`);
        } catch (error) {
          console.log(`⚠️  Error creating category: ${category.nameEn} - ${error.message}`);
        }
      }

      // Seed Tags
      let tagsCount = 0;
      for (const tag of tagsData) {
        try {
          await strapi.entityService.create('api::tag.tag', {
            data: { ...tag, publishedAt: new Date() },
          });
          tagsCount++;
          console.log(`✅ Created tag: ${tag.nameEn}`);
        } catch (error) {
          console.log(`⚠️  Error creating tag: ${tag.nameEn} - ${error.message}`);
        }
      }

      // Seed Partners
      let partnersCount = 0;
      for (const partner of partnersData) {
        try {
          await strapi.entityService.create('api::partner.partner', {
            data: { ...partner, publishedAt: new Date() },
          });
          partnersCount++;
          console.log(`✅ Created partner: ${partner.nameEn}`);
        } catch (error) {
          console.log(`⚠️  Error creating partner: ${partner.nameEn} - ${error.message}`);
        }
      }

      // Seed Site Settings
      let settingsCount = 0;
      for (const setting of siteSettingsData) {
        try {
          await strapi.entityService.create('api::site-setting.site-setting', {
            data: setting,
          });
          settingsCount++;
          console.log(`✅ Created site setting: ${setting.key}`);
        } catch (error) {
          console.log(`⚠️  Error creating site setting: ${setting.key} - ${error.message}`);
        }
      }

      console.log('🎉 Data seeding completed!');
      console.log(`📊 Summary: ${newsCount} news, ${programsCount} programs, ${eventsCount} events, ${categoriesCount} categories, ${tagsCount} tags, ${partnersCount} partners, ${settingsCount} settings`);
      console.log('🌐 Admin panel: http://localhost:1337/admin');
      console.log('🔗 API endpoints:');
      console.log('   - http://localhost:1337/api/news-articles');
      console.log('   - http://localhost:1337/api/programs');
      console.log('   - http://localhost:1337/api/events');
      console.log('   - http://localhost:1337/api/categories');
      console.log('   - http://localhost:1337/api/tags');
      console.log('   - http://localhost:1337/api/partners');
      console.log('   - http://localhost:1337/api/site-settings');

    } catch (error) {
      console.error('❌ Bootstrap error:', error);
    }
  },
};