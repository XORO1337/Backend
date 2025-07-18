const axios = require('axios');

async function testRegistrationWithOTP() {
    const testData = {
        name: "OTP Test User Two",
        phone: "+919876543298", // Another new unique number
        password: "TestPass123!",
        role: "customer"
    };

    try {
        console.log('Testing registration with OTP...');
        console.log('Data:', JSON.stringify(testData, null, 2));
        
        const response = await axios.post('http://localhost:3000/api/auth/register', testData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });
        
        console.log('\n✅ Registration Response:');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        
        // Check if OTP was mentioned in response
        if (response.data.message && response.data.message.includes('verify')) {
            console.log('\n📱 OTP should have been sent to phone number:', testData.phone);
            console.log('Check server logs for OTP details');
        }
        
    } catch (error) {
        console.log('\n❌ Registration failed');
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error Response:', JSON.stringify(error.response.data, null, 2));
            
            // Check if it's a validation error specifically about phone
            if (error.response.data.message && error.response.data.message.includes('phone')) {
                console.log('\n🔍 Phone validation error detected!');
                console.log('This suggests the validation middleware is rejecting the phone format');
            }
        } else {
            console.log('Network/Connection Error:', error.message);
        }
    }
}

testRegistrationWithOTP();
