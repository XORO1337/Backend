/**
 * Phone Registration Test Script
 * Mockup data for testing phone number registration functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Mockup test data for phone registration
const testUsers = {
  // Valid test cases
  validCustomer: {
    name: 'John Customer',
    phone: '+919876543210',
    password: 'SecurePass123!',
    role: 'customer'
  },
  
  validArtisan: {
    name: 'Jane Artisan',
    phone: '+919876543211',
    password: 'ArtisanPass456!',
    role: 'artisan'
  },
  
  validDistributor: {
    name: 'Mike Distributor',
    phone: '+919876543212',
    password: 'DistributorPass789!',
    role: 'distributor'
  },
  
  validAdmin: {
    name: 'Admin User',
    phone: '+919876543213',
    password: 'AdminPass000!',
    role: 'admin'
  },

  // Test with different phone formats
  internationalFormat: {
    name: 'International User',
    phone: '+919876543214',
    password: 'IntlPass123!',
    role: 'customer'
  },

  indianFormat: {
    name: 'Indian User',
    phone: '+918765432100',
    password: 'IndianPass123!',
    role: 'customer'
  },

  // Edge cases
  minimalData: {
    name: 'Min User',
    phone: '+919876543215',
    password: 'MinPass123!'
    // role not provided - should default to 'customer'
  },

  longName: {
    name: 'Very Long Name That Might Test Character Limits',
    phone: '+919876543216',
    password: 'LongNamePass123!',
    role: 'customer'
  },

  // Invalid test cases (for negative testing)
  invalidPhone: {
    name: 'Invalid Phone User',
    phone: '9876543210', // Missing country code
    password: 'InvalidPass123!',
    role: 'customer'
  },

  shortPassword: {
    name: 'Short Pass User',
    phone: '+919876543217',
    password: '123', // Too short
    role: 'customer'
  },

  missingName: {
    phone: '+919876543218',
    password: 'NoNamePass123!',
    role: 'customer'
  },

  invalidRole: {
    name: 'Invalid Role User',
    phone: '+919876543219',
    password: 'InvalidRolePass123!',
    role: 'invalid_role'
  }
};

// OTP test data
const otpTestData = {
  validOTP: '123456',
  invalidOTP: '000000',
  expiredOTP: '999999'
};

/**
 * Test phone registration functionality
 */
async function testPhoneRegistration(userData, testName) {
  try {
    console.log(`\n🧪 Testing: ${testName}`);
    console.log('Data:', JSON.stringify(userData, null, 2));

    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    
    console.log('✅ Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return {
      success: true,
      data: response.data,
      userId: response.data.data?.userId
    };

  } catch (error) {
    console.log('❌ Registration failed');
    console.log('Error:', error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

/**
 * Test OTP sending
 */
async function testSendOTP(phone, testName) {
  try {
    console.log(`\n📱 Testing OTP Send: ${testName}`);
    console.log('Phone:', phone);

    const response = await axios.post(`${BASE_URL}/auth/send-otp`, { phone });
    
    console.log('✅ OTP sent successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return { success: true, data: response.data };

  } catch (error) {
    console.log('❌ OTP sending failed');
    console.log('Error:', error.response?.data || error.message);
    
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Test OTP verification
 */
async function testVerifyOTP(phone, otp, testName) {
  try {
    console.log(`\n🔐 Testing OTP Verify: ${testName}`);
    console.log('Phone:', phone, 'OTP:', otp);

    const response = await axios.post(`${BASE_URL}/auth/verify-otp`, { phone, otp });
    
    console.log('✅ OTP verified successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return { success: true, data: response.data };

  } catch (error) {
    console.log('❌ OTP verification failed');
    console.log('Error:', error.response?.data || error.message);
    
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Test phone login
 */
async function testPhoneLogin(phone, password, testName) {
  try {
    console.log(`\n🔑 Testing Login: ${testName}`);
    console.log('Phone:', phone);

    const response = await axios.post(`${BASE_URL}/auth/login`, { phone, password });
    
    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return { 
      success: true, 
      data: response.data,
      token: response.data.data?.accessToken 
    };

  } catch (error) {
    console.log('❌ Login failed');
    console.log('Error:', error.response?.data || error.message);
    
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Run all valid registration tests
 */
async function runValidTests() {
  console.log('🚀 Running Valid Phone Registration Tests...\n');
  
  const results = [];
  
  // Test valid registrations
  for (const [key, userData] of Object.entries(testUsers)) {
    if (!key.includes('invalid') && !key.includes('missing') && !key.includes('short')) {
      const result = await testPhoneRegistration(userData, key);
      results.push({ test: key, result });
      
      // If registration successful, test OTP flow
      if (result.success) {
        await testSendOTP(userData.phone, `${key} - OTP Send`);
        await testVerifyOTP(userData.phone, otpTestData.validOTP, `${key} - OTP Verify`);
        await testPhoneLogin(userData.phone, userData.password, `${key} - Login`);
      }
      
      // Add delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Run invalid registration tests
 */
async function runInvalidTests() {
  console.log('\n🚨 Running Invalid Phone Registration Tests...\n');
  
  const results = [];
  
  // Test invalid registrations
  for (const [key, userData] of Object.entries(testUsers)) {
    if (key.includes('invalid') || key.includes('missing') || key.includes('short')) {
      const result = await testPhoneRegistration(userData, key);
      results.push({ test: key, result });
      
      // Add delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Test duplicate registration
 */
async function testDuplicateRegistration() {
  console.log('\n🔄 Testing Duplicate Registration...\n');
  
  const userData = testUsers.validCustomer;
  
  // First registration
  await testPhoneRegistration(userData, 'First Registration');
  
  // Second registration with same phone (should fail)
  await testPhoneRegistration(userData, 'Duplicate Registration');
}

/**
 * Generate random test user
 */
function generateRandomUser() {
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return {
    name: `Random User`,
    phone: `+9187654${randomNum}`,
    password: `RandomPass${randomNum}!`,
    role: ['customer', 'artisan', 'distributor'][Math.floor(Math.random() * 3)]
  };
}

/**
 * Test with random data
 */
async function testRandomUsers(count = 3) {
  console.log(`\n🎲 Testing with ${count} Random Users...\n`);
  
  for (let i = 0; i < count; i++) {
    const randomUser = generateRandomUser();
    await testPhoneRegistration(randomUser, `Random User ${i + 1}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('📱 Phone Registration Test Suite');
  console.log('================================\n');
  
  try {
    // Check if server is running
    console.log('Checking server status...');
    await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running\n');
    
    // Run test suites
    await runValidTests();
    await runInvalidTests();
    await testDuplicateRegistration();
    await testRandomUsers();
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Server not running or tests failed:', error.message);
    console.log('\nPlease ensure the server is running on port 3000');
  }
}

/**
 * Quick test function
 */
async function quickTest() {
  console.log('🚀 Quick Phone Registration Test\n');
  
  const testUser = generateRandomUser();
  console.log('Generated test user:', testUser);
  
  const result = await testPhoneRegistration(testUser, 'Quick Test');
  
  if (result.success) {
    console.log('\n📱 Testing OTP flow...');
    await testSendOTP(testUser.phone, 'Quick OTP Send');
    await testVerifyOTP(testUser.phone, otpTestData.validOTP, 'Quick OTP Verify');
    await testPhoneLogin(testUser.phone, testUser.password, 'Quick Login');
  }
}

// Export functions and data for use in other files
module.exports = {
  testUsers,
  otpTestData,
  testPhoneRegistration,
  testSendOTP,
  testVerifyOTP,
  testPhoneLogin,
  runAllTests,
  quickTest,
  generateRandomUser
};

// If running directly
if (require.main === module) {
  const testType = process.argv[2];
  
  switch (testType) {
    case 'quick':
      quickTest();
      break;
    case 'valid':
      runValidTests();
      break;
    case 'invalid':
      runInvalidTests();
      break;
    case 'random':
      testRandomUsers(5);
      break;
    default:
      runAllTests();
  }
}
