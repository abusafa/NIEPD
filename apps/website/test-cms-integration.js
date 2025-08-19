#!/usr/bin/env node

/**
 * Test script to verify CMS integration with Website
 * Run this after both CMS and Website servers are running
 */

const axios = require('axios');

const CMS_URL = 'http://localhost:3001/api';
const WEBSITE_URL = 'http://localhost:3000';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testCMSEndpoints() {
  console.log('🔍 Testing CMS API Endpoints...\n');
  
  const endpoints = [
    { name: 'Events', path: '/events', expectedFields: ['data', 'total', 'totalPages'] },
    { name: 'Programs', path: '/programs', expectedFields: ['data', 'total', 'totalPages'] },
    { name: 'News', path: '/news', expectedFields: ['data', 'total', 'totalPages'] },
    { name: 'FAQ', path: '/faq', expectedFields: ['data', 'total', 'totalPages'] },
    { name: 'Partners', path: '/partners', expectedFields: ['data', 'total', 'totalPages'] },
    { name: 'Contact Info', path: '/contact-info', expectedFields: ['data'] },
    { name: 'Organizational Structure', path: '/organizational-structure', expectedFields: ['data', 'total', 'totalPages'] },
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const response = await axios.get(`${CMS_URL}${endpoint.path}?limit=5`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      const { status, data } = response;
      const hasExpectedFields = endpoint.expectedFields.every(field => field in data);
      
      if (status === 200 && hasExpectedFields) {
        console.log(`✅ ${endpoint.name}: OK (${data.data?.length || 0} items)`);
        results.push({ endpoint: endpoint.name, status: 'SUCCESS', count: data.data?.length || 0 });
      } else {
        console.log(`❌ ${endpoint.name}: Invalid response format`);
        console.log(`   Expected fields: ${endpoint.expectedFields.join(', ')}`);
        console.log(`   Got fields: ${Object.keys(data).join(', ')}`);
        results.push({ endpoint: endpoint.name, status: 'INVALID_FORMAT' });
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.response?.status || 'CONNECTION_ERROR'} - ${error.message}`);
      results.push({ endpoint: endpoint.name, status: 'ERROR', error: error.message });
    }
    
    await delay(500); // Be nice to the server
  }
  
  return results;
}

async function testWebsiteDataFlow() {
  console.log('\n📱 Testing Website Data Flow...\n');
  
  try {
    console.log('Checking if website is accessible...');
    const response = await axios.get(WEBSITE_URL, {
      timeout: 10000,
      headers: {
        'Accept': 'text/html',
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Website is accessible');
      return true;
    } else {
      console.log(`❌ Website returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Website not accessible: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting CMS-Website Integration Test\n');
  console.log('Prerequisites:');
  console.log('- CMS running on http://localhost:3001');
  console.log('- Website running on http://localhost:3000');
  console.log('- Database seeded with test data\n');
  
  const cmsResults = await testCMSEndpoints();
  const websiteResult = await testWebsiteDataFlow();
  
  console.log('\n📊 Test Summary:');
  console.log('=================');
  
  const successCount = cmsResults.filter(r => r.status === 'SUCCESS').length;
  const totalEndpoints = cmsResults.length;
  
  console.log(`CMS API Endpoints: ${successCount}/${totalEndpoints} working`);
  console.log(`Website Access: ${websiteResult ? '✅ Working' : '❌ Failed'}`);
  
  if (successCount === totalEndpoints && websiteResult) {
    console.log('\n🎉 Integration test PASSED! The CMS and Website are properly integrated.');
    console.log('\nNext steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Verify that data from CMS appears on the website');
    console.log('3. Test different pages (Events, Programs, News, etc.)');
  } else {
    console.log('\n❌ Integration test FAILED. Please check the issues above.');
    
    if (cmsResults.some(r => r.status === 'CONNECTION_ERROR' || r.error?.includes('ECONNREFUSED'))) {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Make sure CMS server is running: cd apps/cms && npm run dev');
      console.log('2. Make sure Website server is running: cd apps/website && npm run dev');
      console.log('3. Check if ports 3001 (CMS) and 3000 (Website) are available');
    }
  }
  
  console.log('\n📝 Detailed Results:');
  cmsResults.forEach(result => {
    console.log(`- ${result.endpoint}: ${result.status}${result.count !== undefined ? ` (${result.count} items)` : ''}`);
  });
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testCMSEndpoints, testWebsiteDataFlow, runTests };
