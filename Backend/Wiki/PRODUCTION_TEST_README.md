# Production OTP Testing Guide

## Overview
This guide explains how to run production-grade OTP verification tests using real Twilio SMS services.

## Prerequisites

### 1. Environment Setup
Create a `.env` file with the following Twilio credentials:
```env
# Twilio Configuration (Required for Production Testing)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid

# Database
MONGODB_URI=your_mongodb_atlas_uri

# Server Configuration
NODE_ENV=production
PORT=3000
JWT_SECRET=your_jwt_secret
```

### 2. Phone Number Requirements
- Use a real phone number that can receive SMS
- Number must be in E.164 format (e.g., +919876543210)
- For Twilio trial accounts, the number must be verified in your Twilio console

### 3. Twilio Account Setup
- Active Twilio account with SMS capabilities
- Sufficient account balance (for non-trial accounts)
- Verify Service configured in Twilio Console

## Running Production Tests

### Method 1: Environment Variable
```bash
# Set the test phone number and run
TEST_PHONE_NUMBER=+919876543210 node test-otp-verification.js
```

### Method 2: Export Environment Variable
```bash
# Export the variable in your shell
export TEST_PHONE_NUMBER="+919876543210"
export API_BASE_URL="http://localhost:3000/api"

# Run the tests
node test-otp-verification.js
```

### Method 3: Custom API Endpoint
```bash
# Test against a different server
TEST_PHONE_NUMBER=+919876543210 API_BASE_URL=https://your-api.com/api node test-otp-verification.js
```

## Test Scenarios

The production test script covers:

1. **Server Health Check** - Verifies API server is responding
2. **User Registration** - Creates a new user with the test phone number
3. **Real OTP Sending** - Sends actual SMS via Twilio to your phone
4. **Interactive OTP Verification** - Prompts you to enter the received OTP
5. **User Login** - Tests login after phone verification
6. **Error Handling** - Tests invalid OTP rejection
7. **Edge Cases** - Duplicate registration, non-existent users
8. **Input Validation** - Tests various invalid input scenarios

## Interactive Features

### OTP Input
When the test sends a real OTP, you'll see:
```
📱 Check your phone +919876543210 for the OTP
Enter the OTP you received: _
```

### Retry Mechanism
If OTP verification fails, you can retry:
```
❌ OTP verification failed
Would you like to try again? (y/n): _
```

### Safety Confirmation
Before starting production tests:
```
📋 Production Test Instructions:
   1. Ensure Twilio credentials are configured in .env
   2. Use a real phone number that can receive SMS
   3. Have your phone ready to receive the OTP
   4. This will send real SMS messages to the provided number

Do you want to proceed with production testing? (y/n): _
```

## Expected Output

### Successful Test Run
```
🧪 Starting Production OTP and Phone Verification Tests
============================================================
✅ Environment validation passed
   Testing with phone: +919876543210
   API endpoint: http://localhost:3000/api

📡 Testing server health...
✅ Server is healthy

👤 Testing user registration with phone...
✅ User registration successful

📱 Testing OTP sending...
✅ OTP sent successfully
   📱 Check your phone +919876543210 for the OTP
Enter the OTP you received: 123456

🔐 Testing OTP verification...
✅ OTP verification successful

🔑 Testing user login after phone verification...
✅ User login successful

📋 Production Test Summary
============================================================
🎉 All production tests passed! (9/9) - 100.0%
```

## Troubleshooting

### Common Issues

#### 1. Missing Environment Variables
```
❌ Error: TEST_PHONE_NUMBER environment variable is required for production testing
   Usage: TEST_PHONE_NUMBER=+919876543210 node test-otp-verification.js
```
**Solution**: Provide the phone number as an environment variable

#### 2. Invalid Phone Format
```
❌ Error: Phone number must be in E.164 format (e.g., +919876543210)
```
**Solution**: Ensure phone number starts with country code (+91 for India)

#### 3. Twilio Trial Account Restrictions
```
❌ OTP sending failed
   Error: The number +919876543210 is unverified
```
**Solution**: Verify the phone number in your Twilio Console for trial accounts

#### 4. Insufficient Twilio Balance
```
❌ OTP sending failed
   Error: Insufficient funds
```
**Solution**: Add credits to your Twilio account

#### 5. Rate Limiting
```
⏳ Rate limited, retrying in 2000ms...
```
**Solution**: The script automatically handles rate limiting with exponential backoff

### Debug Mode
To see detailed request/response information, you can modify the script to log more details:

```javascript
// Add this to makeRequest function for debugging
console.log('Request:', config);
console.log('Response:', response.data);
```

## Security Considerations

1. **Never commit real Twilio credentials** to version control
2. **Use environment variables** for sensitive configuration
3. **Test with verified phone numbers** in trial accounts
4. **Monitor Twilio usage** to avoid unexpected charges
5. **Implement proper cleanup** to remove test users after testing

## Cost Considerations

- Each OTP SMS costs money on Twilio (varies by region)
- Production testing will send real SMS messages
- Monitor your Twilio usage dashboard
- Consider using Twilio trial credits for testing

## Integration with CI/CD

For automated testing in CI/CD pipelines, consider:

1. Using mock services for automated tests
2. Running production tests only on staging environments
3. Using verified phone numbers for consistent testing
4. Implementing test data cleanup procedures

## Support

If you encounter issues:

1. Check Twilio Console for SMS delivery logs
2. Review server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Ensure MongoDB connection is stable
5. Check network connectivity to Twilio services
