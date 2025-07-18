const axios = require('axios');

async function testEnhancedOTPFunctionality() {
    const BASE_URL = 'http://localhost:3000/api/auth';
    const testPhone = '+919876543210';

    console.log('🧪 Testing Enhanced MongoDB-based OTP System');
    console.log('=' .repeat(60));

    try {
        // 1. First, check OTP status
        console.log('\n1️⃣ Checking initial OTP status...');
        try {
            const statusResponse = await axios.get(`${BASE_URL}/otp-status?phone=${encodeURIComponent(testPhone)}`);
            console.log('✅ OTP Status:', JSON.stringify(statusResponse.data, null, 2));
        } catch (error) {
            console.log('ℹ️ Initial status check (expected if user not found):', error.response?.data?.message);
        }

        // 2. Send OTP
        console.log('\n2️⃣ Sending OTP...');
        try {
            const sendResponse = await axios.post(`${BASE_URL}/send-otp`, {
                phone: testPhone
            });
            console.log('✅ Send OTP Response:', JSON.stringify(sendResponse.data, null, 2));
        } catch (error) {
            console.log('❌ Send OTP Error:', error.response?.data || error.message);
        }

        // 3. Wait a moment then check status again
        console.log('\n3️⃣ Checking OTP status after sending...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            const statusResponse = await axios.get(`${BASE_URL}/otp-status?phone=${encodeURIComponent(testPhone)}`);
            console.log('✅ OTP Status after send:', JSON.stringify(statusResponse.data, null, 2));
        } catch (error) {
            console.log('❌ Status Error:', error.response?.data || error.message);
        }

        // 4. Test resend functionality
        console.log('\n4️⃣ Testing resend OTP (should respect cooldown)...');
        try {
            const resendResponse = await axios.post(`${BASE_URL}/resend-otp`, {
                phone: testPhone
            });
            console.log('✅ Resend OTP Response:', JSON.stringify(resendResponse.data, null, 2));
        } catch (error) {
            console.log('⚠️ Resend Error (expected due to cooldown):', error.response?.data || error.message);
        }

        // 5. Wait for cooldown to pass then try resend again
        console.log('\n5️⃣ Waiting for cooldown period to pass...');
        await new Promise(resolve => setTimeout(resolve, 65000)); // Wait 65 seconds

        try {
            const resendResponse = await axios.post(`${BASE_URL}/resend-otp`, {
                phone: testPhone
            });
            console.log('✅ Resend OTP after cooldown:', JSON.stringify(resendResponse.data, null, 2));
        } catch (error) {
            console.log('❌ Resend Error:', error.response?.data || error.message);
        }

        // 6. Test OTP verification with wrong OTP
        console.log('\n6️⃣ Testing OTP verification with wrong code...');
        try {
            const verifyResponse = await axios.post(`${BASE_URL}/verify-otp`, {
                phone: testPhone,
                otp: '000000'
            });
            console.log('✅ Verify Response:', JSON.stringify(verifyResponse.data, null, 2));
        } catch (error) {
            console.log('⚠️ Verify Error (expected for wrong OTP):', error.response?.data || error.message);
        }

        // 7. Final status check
        console.log('\n7️⃣ Final OTP status check...');
        try {
            const statusResponse = await axios.get(`${BASE_URL}/otp-status?phone=${encodeURIComponent(testPhone)}`);
            console.log('✅ Final OTP Status:', JSON.stringify(statusResponse.data, null, 2));
        } catch (error) {
            console.log('❌ Final Status Error:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🧪 Enhanced OTP Test Completed');
}

// Note: This test requires the user to exist first
console.log('⚠️ Note: Make sure to register a user with phone +919876543210 first');
console.log('⚠️ Or modify the testPhone variable to use an existing user\'s phone number');

testEnhancedOTPFunctionality();
