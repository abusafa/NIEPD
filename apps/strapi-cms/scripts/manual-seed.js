const { createStrapi } = require('@strapi/strapi');

async function seedData() {
  console.log('🚀 Starting manual data seeding...');
  
  const strapi = await createStrapi().load();
  
  try {
    // Sample news data
    const newsData = [
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
        featured: true
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
        featured: true
      }
    ];

    // Sample programs data
    const programsData = [
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
        isCertified: true
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
        isCertified: true
      }
    ];

    // Sample events data
    const eventsData = [
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
        category: "sessions"
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
        category: "conferences"
      }
    ];

    // Seed News
    console.log('📰 Creating news articles...');
    for (const news of newsData) {
      try {
        const created = await strapi.entityService.create('api::news.news', {
          data: news,
        });
        console.log(`✅ Created news: ${news.titleEn}`);
      } catch (error) {
        console.log(`⚠️  Error creating news: ${error.message}`);
      }
    }

    // Seed Programs
    console.log('🎓 Creating programs...');
    for (const program of programsData) {
      try {
        const created = await strapi.entityService.create('api::program.program', {
          data: program,
        });
        console.log(`✅ Created program: ${program.titleEn}`);
      } catch (error) {
        console.log(`⚠️  Error creating program: ${error.message}`);
      }
    }

    // Seed Events
    console.log('📅 Creating events...');
    for (const event of eventsData) {
      try {
        const created = await strapi.entityService.create('api::event.event', {
          data: event,
        });
        console.log(`✅ Created event: ${event.titleEn}`);
      } catch (error) {
        console.log(`⚠️  Error creating event: ${error.message}`);
      }
    }

    console.log('🎉 Manual seeding completed!');
    console.log('🌐 Check the admin panel: http://localhost:1337/admin');
    console.log('🔗 API endpoints:');
    console.log('   - http://localhost:1337/api/news-articles');
    console.log('   - http://localhost:1337/api/programs');
    console.log('   - http://localhost:1337/api/events');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await strapi.destroy();
    process.exit(0);
  }
}

seedData();
