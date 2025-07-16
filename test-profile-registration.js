#!/usr/bin/env node

/**
 * Profile Registration Test Script
 * 
 * This script tests the enhanced registration functionality that creates
 * user profiles in their respective collections (Artisan/Distributor).
 */

const axios = require('axios');
const colors = require('colors');

const BASE_URL = 'http://localhost:3000/api';

// Test configuration
const testConfig = {
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Test data
const testUsers = {
  customer: {
    name: 'Test Customer',
    phone: '+919876543210',
    password: 'TestPass123!',
    role: 'customer'
  },
  artisan: {
    name: 'Test Artisan',
    phone: '+919876543211',
    password: 'TestPass123!',
    role: 'artisan',
    bio: 'Experienced artisan specializing in traditional crafts',
    region: 'Maharashtra',
    skills: ['pottery', 'woodworking', 'textile']
  },
  distributor: {
    name: 'Test Distributor',
    phone: '+919876543212',
    password: 'TestPass123!',
    role: 'distributor',
    businessName: 'Test Distribution Co.',
    licenseNumber: 'LIC123456',
    distributionAreas: ['Mumbai', 'Pune', 'Nashik']
  }
};

// Helper function to make HTTP requests
async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${testConfig.baseURL}${endpoint}`,
      headers: testConfig.headers,
      timeout: testConfig.timeout
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

// Test server health
async function testServerHealth() {
  console.log('\n📡 Testing server health...'.cyan);
  
  const result = await makeRequest('GET', '/health');
  
  if (result.success) {
    console.log('✅ Server is healthy'.green);
    return true;
  } else {
    console.log('❌ Server health check failed'.red);
    console.log(`   Error: ${JSON.stringify(result.error)}`.gray);
    return false;
  }
}

// Test user registration with profile creation
async function testRegistration(userType, userData) {
  console.log(`\n👤 Testing ${userType} registration...`.cyan);
  
  const result = await makeRequest('POST', '/auth/register', userData);
  
  if (result.success) {
    console.log(`✅ ${userType} registration successful`.green);
    console.log(`   User ID: ${result.data.data.userId}`.gray);
    console.log(`   Name: ${result.data.data.name}`.gray);
    console.log(`   Phone: ${result.data.data.phone}`.gray);
    console.log(`   Role: ${result.data.data.role}`.gray);
    
    if (result.data.data.profileId) {
      console.log(`   Profile ID: ${result.data.data.profileId}`.gray);
      console.log(`   Profile Created: ${result.data.data.profileCreated}`.gray);
    }
    
    return result.data.data;
  } else {
    console.log(`❌ ${userType} registration failed`.red);
    console.log(`   Error: ${JSON.stringify(result.error)}`.gray);
    return null;
  }
}

// Test fetching profiles
async function testProfileRetrieval(userType, userId) {
  console.log(`\n🔍 Testing ${userType} profile retrieval...`.cyan);
  
  let endpoint;
  if (userType === 'artisan') {
    endpoint = `/artisans/user/${userId}`;
  } else if (userType === 'distributor') {
    endpoint = `/distributors/user/${userId}`;
  } else {
    console.log('   ⏭️ Skipping profile retrieval for customer'.yellow);
    return true;
  }
  
  const result = await makeRequest('GET', endpoint);
  
  if (result.success) {
    console.log(`✅ ${userType} profile retrieved successfully`.green);
    console.log(`   Profile data: ${JSON.stringify(result.data.data, null, 2)}`.gray);
    return true;
  } else {
    console.log(`❌ ${userType} profile retrieval failed`.red);
    console.log(`   Error: ${JSON.stringify(result.error)}`.gray);
    return false;
  }
}

// Clean up test data (delete created users)
async function cleanupTestData(userIds) {
  console.log('\n🧹 Cleaning up test data...'.cyan);
  
  for (const userId of userIds) {
    if (userId) {
      try {
        // Note: This would require admin authentication in production
        // For testing purposes, we'll just log the cleanup attempt
        console.log(`   Would delete user: ${userId}`.gray);
      } catch (error) {
        console.log(`   Failed to delete user ${userId}: ${error.message}`.yellow);
      }
    }
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Profile Registration Tests'.bold.cyan);
  console.log('====================================='.cyan);
  
  // Test server health first
  const isHealthy = await testServerHealth();
  if (!isHealthy) {
    console.log('\n❌ Server is not healthy. Exiting tests.'.red);
    process.exit(1);
  }
  
  const createdUserIds = [];
  
  try {
    // Test each user type
    for (const [userType, userData] of Object.entries(testUsers)) {
      const result = await testRegistration(userType, userData);
      
      if (result) {
        createdUserIds.push(result.userId);
        
        // Test profile retrieval for artisan and distributor
        if (userType !== 'customer') {
          await testProfileRetrieval(userType, result.userId);
        }
      }
      
      // Add a small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 All registration tests completed!'.bold.green);
    console.log(`   Created ${createdUserIds.length} test users`.gray);
    
  } catch (error) {
    console.log('\n💥 Test execution failed:'.red);
    console.log(`   ${error.message}`.gray);
  } finally {
    // Cleanup
    await cleanupTestData(createdUserIds);
    console.log('\n👋 Test session completed.'.bold.cyan);
  }
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testRegistration, testProfileRetrieval };
