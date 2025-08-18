const fs = require('fs');
const path = require('path');

// Data file paths
const DATA_DIR = path.join(__dirname, '../../../data');

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

// Helper function to make API requests
async function createEntity(endpoint, data) {
  try {
    const response = await fetch(`http://localhost:1337/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data })
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
  } catch (error) {
    throw error;
  }
}

async function importAllData() {
  console.log('🚀 Starting comprehensive data import via API...');
  
  try {
    // Wait for Strapi to be ready
    console.log('⏳ Waiting for Strapi to be ready...');
    let ready = false;
    let attempts = 0;
    while (!ready && attempts < 30) {
      try {
        const response = await fetch('http://localhost:1337/admin');
        if (response.status < 500) {
          ready = true;
        }
      } catch (error) {
        // Still starting up
      }
      if (!ready) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      }
    }
    
    if (!ready) {
      throw new Error('Strapi did not start within expected time');
    }
    
    console.log('✅ Strapi is ready!');

    // Import Categories
    console.log('📂 Importing categories...');
    const categories = readJsonFile(path.join(DATA_DIR, 'categories.json'));
    if (categories) {
      for (const category of categories) {
        try {
          await createEntity('categories', {
            slug: category.slug,
            nameAr: category.name_ar,
            nameEn: category.name_en,
            type: category.type,
            descriptionAr: category.description_ar,
            descriptionEn: category.description_en,
            parentId: category.parent_id,
            sortOrder: category.sort_order,
            status: category.status
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
          await createEntity('partners', {
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
            featured: partner.featured || false
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
          await createEntity('faqs', {
            category: faq.category,
            questionAr: faq.questionAr,
            questionEn: faq.questionEn,
            answerAr: faq.answerAr,
            answerEn: faq.answerEn,
            sortOrder: faq.id,
            featured: false
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
          await createEntity('tags', {
            slug: tag.slug,
            nameAr: tag.name_ar,
            nameEn: tag.name_en,
            descriptionAr: tag.description_ar,
            descriptionEn: tag.description_en,
            status: tag.status
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
          await createEntity('navigations', {
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
            descriptionEn: nav.description_en
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
          await createEntity('pages', {
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
            template: page.template
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
          await createEntity('site-settings', {
            key: setting.key,
            valueAr: setting.value_ar,
            valueEn: setting.value_en,
            type: setting.type,
            category: setting.category,
            descriptionAr: setting.description_ar,
            descriptionEn: setting.description_en,
            status: setting.status
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
          await createEntity('contact-infos', {
            type: contact.type,
            labelAr: contact.label_ar,
            labelEn: contact.label_en,
            value: contact.value,
            displayValueAr: contact.display_value_ar,
            displayValueEn: contact.display_value_en,
            icon: contact.icon,
            url: contact.url,
            status: contact.status,
            sortOrder: contact.sort_order
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
    process.exit(1);
  }
}

importAllData();
