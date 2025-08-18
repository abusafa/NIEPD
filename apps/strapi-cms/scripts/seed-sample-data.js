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
    category: "sessions"
  }
];

async function seedSampleData() {
  console.log('🌱 Starting manual data seeding...');
  
  try {
    // Seed News
    console.log('📰 Seeding sample news...');
    for (const newsItem of sampleNews) {
      const response = await fetch('http://localhost:1337/api/news-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: newsItem })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created news: ${newsItem.titleEn}`);
      } else {
        console.log(`⚠️  Failed to create news: ${newsItem.titleEn}`);
      }
    }

    // Seed Programs
    console.log('🎓 Seeding sample programs...');
    for (const program of samplePrograms) {
      const response = await fetch('http://localhost:1337/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: program })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created program: ${program.titleEn}`);
      } else {
        console.log(`⚠️  Failed to create program: ${program.titleEn}`);
      }
    }

    // Seed Events
    console.log('📅 Seeding sample events...');
    for (const event of sampleEvents) {
      const response = await fetch('http://localhost:1337/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: event })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created event: ${event.titleEn}`);
      } else {
        console.log(`⚠️  Failed to create event: ${event.titleEn}`);
      }
    }

    console.log('🎉 Sample data seeding completed!');
    console.log('🌐 Visit http://localhost:1337/admin to see the data in the admin panel');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

// Run the seeding
seedSampleData();
