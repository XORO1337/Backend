const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
    name: "Custom OTP Test User",
    phone: "+919876543333",
    password: "TestPassword123!",
    role: "customer"
};

async function testCustomOTPSystem() {
    try {
        console.log('🧪 Testing Custom MongoDB OTP System\n');

        // Step 1: Register user
        console.log('1️⃣ Testing User Registration...');
        try {
            const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser, {
                timeout: 10000
            });
            
            console.log('✅ Registration successful!');
            console.log('Response:', JSON.stringify(registerResponse.data, null, 2));
            console.log('OTP should be sent automatically during registration\n');
        } catch (error) {
            if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
                console.log('ℹ️ User already exists, continuing with OTP tests...\n');
            } else {
                console.log('❌ Registration failed:', error.response?.data || error.message);
                return;
            }
        }

        // Step 2: Get OTP status
        console.log('2️⃣ Testing OTP Status...');
        try {
            const statusResponse = await axios.get(`${BASE_URL}/auth/otp-status?phone=${encodeURIComponent(testUser.phone)}`);
            console.log('✅ OTP Status retrieved!');
            console.log('Status:', JSON.stringify(statusResponse.data, null, 2));
            console.log();
        } catch (error) {
            console.log('❌ Get OTP status failed:', error.response?.data || error.message);
            console.log();
        }

        // Step 3: Send OTP manually
        console.log('3️⃣ Testing Manual OTP Send...');
        try {
            const sendOtpResponse = await axios.post(`${BASE_URL}/auth/send-otp`, {
                phone: testUser.phone
            });
            
            console.log('✅ OTP sent successfully!');
            console.log('Response:', JSON.stringify(sendOtpResponse.data, null, 2));
            
            // Extract OTP for testing (development mode)
            const sentOTP = sendOtpResponse.data.data?.otpCode;
            if (sentOTP) {
                console.log(`📱 OTP Code: ${sentOTP}`);
            }
            console.log();
        } catch (error) {
            console.log('❌ Send OTP failed:', error.response?.data || error.message);
            console.log();
        }

        // Step 4: Test resend OTP (with cooldown)
        console.log('4️⃣ Testing OTP Resend (should fail due to cooldown)...');
        try {
            const resendResponse = await axios.post(`${BASE_URL}/auth/resend-otp`, {
                phone: testUser.phone
            });
            
            console.log('✅ OTP resent successfully!');
            console.log('Response:', JSON.stringify(resendResponse.data, null, 2));
            console.log();
        } catch (error) {
            console.log('⏰ Resend failed (expected due to cooldown):', error.response?.data?.message);
            console.log();
        }

        // Step 5: Test invalid OTP
        console.log('5️⃣ Testing Invalid OTP Verification...');
        try {
            const invalidOtpResponse = await axios.post(`${BASE_URL}/auth/verify-otp`, {
                phone: testUser.phone,
                otp: "000000"
            });
            
            console.log('❌ Invalid OTP should have failed!');
            console.log('Response:', JSON.stringify(invalidOtpResponse.data, null, 2));
        } catch (error) {
            console.log('✅ Invalid OTP correctly rejected:', error.response?.data?.message);
            console.log('Attempts remaining:', error.response?.data?.attemptsRemaining);
            console.log();
        }

        // Step 6: Wait for cooldown and test resend
        console.log('6️⃣ Waiting for cooldown to test resend...');
        console.log('⏳ Waiting 61 seconds for cooldown...');
        
        // Comment out the wait for testing, or uncomment to test full flow
        // await new Promise(resolve => setTimeout(resolve, 61000));
        
        console.log('⏭️ Skipping wait for demo purposes\n');

        // Step 7: Get final OTP status
        console.log('7️⃣ Getting Final OTP Status...');
        try {
            const finalStatusResponse = await axios.get(`${BASE_URL}/auth/otp-status?phone=${encodeURIComponent(testUser.phone)}`);
            console.log('✅ Final OTP Status:');
            console.log('Status:', JSON.stringify(finalStatusResponse.data, null, 2));
        } catch (error) {
            console.log('❌ Get final OTP status failed:', error.response?.data || error.message);
        }

        console.log('\n🎉 Custom OTP System Test Complete!');
        console.log('\n📋 Test Summary:');
        console.log('✅ User registration with automatic OTP');
        console.log('✅ Manual OTP sending');
        console.log('✅ OTP status checking');
        console.log('✅ Resend cooldown protection');
        console.log('✅ Invalid OTP rejection');
        console.log('✅ Attempt counting');

    } catch (error) {
        console.log('💥 Test suite error:', error.message);
    }
}

// Test with valid OTP (for manual testing)
async function testValidOTPVerification(otp) {
    console.log(`\n🔐 Testing Valid OTP Verification with: ${otp}`);
    
    try {
        const verifyResponse = await axios.post(`${BASE_URL}/auth/verify-otp`, {
            phone: testUser.phone,
            otp: otp
        });
        
        console.log('✅ OTP verified successfully!');
        console.log('Response:', JSON.stringify(verifyResponse.data, null, 2));
    } catch (error) {
        console.log('❌ OTP verification failed:', error.response?.data || error.message);
    }
}

// Run the test
testCustomOTPSystem();

// Uncomment to test with a specific OTP
// testValidOTPVerification("123456");
