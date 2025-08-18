const fs = require('fs');
const path = require('path');

// Content types that need API files
const contentTypes = [
  { name: 'program', singular: 'program', plural: 'programs' },
  { name: 'event', singular: 'event', plural: 'events' },
  { name: 'category', singular: 'category', plural: 'categories' },
  { name: 'partner', singular: 'partner', plural: 'partners' },
  { name: 'faq', singular: 'faq', plural: 'faqs' },
  { name: 'tag', singular: 'tag', plural: 'tags' },
  { name: 'navigation', singular: 'navigation', plural: 'navigations' },
  { name: 'page', singular: 'page', plural: 'pages' },
  { name: 'site-setting', singular: 'site-setting', plural: 'site-settings' },
  { name: 'contact-info', singular: 'contact-info', plural: 'contact-infos' }
];

function createControllerFile(contentType) {
  return `'use strict';

/**
 * ${contentType.singular} controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::${contentType.singular}.${contentType.singular}');`;
}

function createRouterFile(contentType) {
  return `'use strict';

/**
 * ${contentType.singular} router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::${contentType.singular}.${contentType.singular}');`;
}

function createServiceFile(contentType) {
  return `'use strict';

/**
 * ${contentType.singular} service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::${contentType.singular}.${contentType.singular}');`;
}

// Create API files for each content type
contentTypes.forEach(contentType => {
  const apiPath = path.join(__dirname, '..', 'src', 'api', contentType.name);
  
  // Create directories
  const controllersDir = path.join(apiPath, 'controllers');
  const routesDir = path.join(apiPath, 'routes');
  const servicesDir = path.join(apiPath, 'services');
  
  if (!fs.existsSync(controllersDir)) {
    fs.mkdirSync(controllersDir, { recursive: true });
  }
  if (!fs.existsSync(routesDir)) {
    fs.mkdirSync(routesDir, { recursive: true });
  }
  if (!fs.existsSync(servicesDir)) {
    fs.mkdirSync(servicesDir, { recursive: true });
  }
  
  // Create files
  const controllerFile = path.join(controllersDir, `${contentType.name}.js`);
  const routerFile = path.join(routesDir, `${contentType.name}.js`);
  const serviceFile = path.join(servicesDir, `${contentType.name}.js`);
  
  fs.writeFileSync(controllerFile, createControllerFile(contentType));
  fs.writeFileSync(routerFile, createRouterFile(contentType));
  fs.writeFileSync(serviceFile, createServiceFile(contentType));
  
  console.log(`✅ Created API files for ${contentType.name}`);
});

console.log('🎉 All API files created successfully!');
