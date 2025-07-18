const axios = require('axios');

async function testPhoneRegistration() {
    const testData = {
        name: "Test User",
        phone: "+919876543210",
        password: "TestPassword123!",
        role: "customer"
    };

    try {
        console.log('Testing phone registration...');
        console.log('Data:', JSON.stringify(testData, null, 2));
        
        const response = await axios.post('http://localhost:3000/api/auth/register', testData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
        });
        
        console.log('✅ Registration successful!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Registration failed');
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error Response:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.log('Network Error:', error.message);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testPhoneRegistration();
