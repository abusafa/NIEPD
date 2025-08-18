const { createStrapi } = require('@strapi/strapi');
const fs = require('fs');
const path = require('path');

// Data file paths
const DATA_DIR = path.join(__dirname, '../../../data');
const REACT_DATA_DIR = path.join(__dirname, '../../react-template/public/data');

// Helper function to read JSON file
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
    return null;
  }
}

async function importAllData() {
  console.log('🚀 Starting comprehensive data import...');
  
  const strapi = await createStrapi().load();
  
  try {
    // Import Categories
    console.log('📂 Importing categories...');
    const categories = readJsonFile(path.join(DATA_DIR, 'categories.json'));
    if (categories) {
      for (const category of categories) {
        try {
          await strapi.entityService.create('api::category.category', {
            data: {
              slug: category.slug,
              nameAr: category.name_ar,
              nameEn: category.name_en,
              type: category.type,
              descriptionAr: category.description_ar,
              descriptionEn: category.description_en,
              parentId: category.parent_id,
              sortOrder: category.sort_order,
              status: category.status,
              publishedAt: new Date()
            },
          });
          console.log(`✅ Created category: ${category.name_en}`);
        } catch (error) {
          console.log(`⚠️  Error creating category: ${category.name_en} - ${error.message}`);
        }
      }
    }

    // Import Partners
    console.log('🤝 Importing partners...');
    const partners = readJsonFile(path.join(DATA_DIR, 'partners.json'));
    if (partners) {
      for (const partner of partners) {
        try {
          await strapi.entityService.create('api::partner.partner', {
            data: {
              nameAr: partner.nameAr,
              nameEn: partner.nameEn,
              descriptionAr: partner.descriptionAr,
              descriptionEn: partner.descriptionEn,
              type: partner.type,
              categoryAr: partner.categoryAr,
              categoryEn: partner.categoryEn,
              since: partner.since,
              website: partner.website,
              logo: partner.logo,
              featured: partner.featured || false,
              publishedAt: new Date()
            },
          });
          console.log(`✅ Created partner: ${partner.nameEn}`);
        } catch (error) {
          console.log(`⚠️  Error creating partner: ${partner.nameEn} - ${error.message}`);
        }
      }
    }

    // Import FAQs
    console.log('❓ Importing FAQs...');
    const faqs = readJsonFile(path.join(DATA_DIR, 'faq.json'));
    if (faqs) {
      for (const faq of faqs) {
        try {
          await strapi.entityService.create('api::faq.faq', {
            data: {
              category: faq.category,
              questionAr: faq.questionAr,
              questionEn: faq.questionEn,
              answerAr: faq.answerAr,
              answerEn: faq.answerEn,
              sortOrder: faq.id,
              featured: false,
              publishedAt: new Date()
            },
          });
          console.log(`✅ Created FAQ: ${faq.questionEn.substring(0, 50)}...`);
        } catch (error) {
          console.log(`⚠️  Error creating FAQ: ${error.message}`);
        }
      }
    }

    // Import Tags
    console.log('🏷️  Importing tags...');
    const tags = readJsonFile(path.join(DATA_DIR, 'tags.json'));
    if (tags) {
      for (const tag of tags) {
        try {
          await strapi.entityService.create('api::tag.tag', {
            data: {
              slug: tag.slug,
              nameAr: tag.name_ar,
              nameEn: tag.name_en,
              descriptionAr: tag.description_ar,
              descriptionEn: tag.description_en,
              status: tag.status,
              publishedAt: new Date()
            },
          });
          console.log(`✅ Created tag: ${tag.name_en}`);
        } catch (error) {
          console.log(`⚠️  Error creating tag: ${tag.name_en} - ${error.message}`);
        }
      }
    }

    // Import Navigation
    console.log('🧭 Importing navigation...');
    const navigation = readJsonFile(path.join(DATA_DIR, 'navigation.json'));
    if (navigation) {
      for (const nav of navigation) {
        try {
          await strapi.entityService.create('api::navigation.navigation', {
            data: {
              menuType: nav.menu_type,
              parentId: nav.parent_id,
              titleAr: nav.title_ar,
              titleEn: nav.title_en,
              url: nav.url,
              icon: nav.icon,
              sortOrder: nav.sort_order,
              status: nav.status,
              target: nav.target,
              cssClass: nav.css_class,
              descriptionAr: nav.description_ar,
              descriptionEn: nav.description_en,
              publishedAt: new Date()
            },
          });
          console.log(`✅ Created navigation: ${nav.title_en}`);
        } catch (error) {
          console.log(`⚠️  Error creating navigation: ${nav.title_en} - ${error.message}`);
        }
      }
    }

    // Import Pages
    console.log('📄 Importing pages...');
    const pages = readJsonFile(path.join(DATA_DIR, 'pages.json'));
    if (pages) {
      for (const page of pages) {
        try {
          await strapi.entityService.create('api::page.page', {
            data: {
              slug: page.slug,
              titleAr: page.title_ar,
              titleEn: page.title_en,
              metaTitleAr: page.meta_title_ar,
              metaTitleEn: page.meta_title_en,
              metaDescriptionAr: page.meta_description_ar,
              metaDescriptionEn: page.meta_description_en,
              status: page.status,
              language: page.language,
              parentId: page.parent_id,
              sortOrder: page.sort_order,
              template: page.template,
              publishedAt: new Date()
            },
          });
          console.log(`✅ Created page: ${page.title_en}`);
        } catch (error) {
          console.log(`⚠️  Error creating page: ${page.title_en} - ${error.message}`);
        }
      }
    }

    // Import Site Settings
    console.log('⚙️  Importing site settings...');
    const siteSettings = readJsonFile(path.join(DATA_DIR, 'site_settings.json'));
    if (siteSettings) {
      for (const setting of siteSettings) {
        try {
          await strapi.entityService.create('api::site-setting.site-setting', {
            data: {
              key: setting.key,
              valueAr: setting.value_ar,
              valueEn: setting.value_en,
              type: setting.type,
              category: setting.category,
              descriptionAr: setting.description_ar,
              descriptionEn: setting.description_en,
              status: setting.status
            },
          });
          console.log(`✅ Created site setting: ${setting.key}`);
        } catch (error) {
          console.log(`⚠️  Error creating site setting: ${setting.key} - ${error.message}`);
        }
      }
    }

    // Import Contact Info
    console.log('📞 Importing contact info...');
    const contactInfo = readJsonFile(path.join(DATA_DIR, 'contact.json'));
    if (contactInfo) {
      for (const contact of contactInfo) {
        try {
          await strapi.entityService.create('api::contact-info.contact-info', {
            data: {
              type: contact.type,
              labelAr: contact.label_ar,
              labelEn: contact.label_en,
              value: contact.value,
              displayValueAr: contact.display_value_ar,
              displayValueEn: contact.display_value_en,
              icon: contact.icon,
              url: contact.url,
              status: contact.status,
              sortOrder: contact.sort_order,
              publishedAt: new Date()
            },
          });
          console.log(`✅ Created contact info: ${contact.label_en}`);
        } catch (error) {
          console.log(`⚠️  Error creating contact info: ${contact.label_en} - ${error.message}`);
        }
      }
    }

    console.log('🎉 Comprehensive data import completed!');
    console.log('🌐 Admin panel: http://localhost:1337/admin');
    console.log('🔗 API endpoints available:');
    console.log('   - http://localhost:1337/api/categories');
    console.log('   - http://localhost:1337/api/partners');
    console.log('   - http://localhost:1337/api/faqs');
    console.log('   - http://localhost:1337/api/tags');
    console.log('   - http://localhost:1337/api/navigations');
    console.log('   - http://localhost:1337/api/pages');
    console.log('   - http://localhost:1337/api/site-settings');
    console.log('   - http://localhost:1337/api/contact-infos');
    console.log('   - http://localhost:1337/api/news-articles');
    console.log('   - http://localhost:1337/api/programs');
    console.log('   - http://localhost:1337/api/events');

  } catch (error) {
    console.error('❌ Import error:', error);
  } finally {
    await strapi.destroy();
    process.exit(0);
  }
}

importAllData();
