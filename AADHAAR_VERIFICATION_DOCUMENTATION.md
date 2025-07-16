# Aadhaar Verification System Documentation

## Overview

The identity verification system has been updated to use **Aadhaar Number Verification via API** instead of document uploads. This provides a more secure, automated, and user-friendly verification process.

## Features

### ✅ **Key Improvements**
- **No Document Uploads**: Users only need to enter their 12-digit Aadhaar number
- **API-Based Verification**: Real-time verification through official Aadhaar API
- **OTP Verification**: OTP sent to Aadhaar-registered mobile number
- **Automatic Data Extraction**: Name, DOB, gender, and address retrieved automatically
- **Enhanced Security**: Aadhaar numbers are hashed and stored securely
- **Rate Limiting**: Protection against verification abuse
- **Backward Compatibility**: Legacy document verification still supported

## How It Works

### 1. **Initiate Verification**
```
User enters 12-digit Aadhaar number → API validates format → OTP sent to registered mobile
```

### 2. **OTP Verification**
```
User enters OTP → API verifies → Aadhaar data retrieved → User verification completed
```

### 3. **Data Storage**
```
Aadhaar number hashed → Personal data stored → Masked number displayed → Full verification status updated
```

## API Endpoints

### Initiate Aadhaar Verification
**Endpoint:** `POST /api/auth/verification/aadhaar/initiate`

**Authentication:** Required (artisan or distributor role)

**Request Body:**
```json
{
  "aadhaarNumber": "1234 5678 9012"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your Aadhaar registered mobile number",
  "data": {
    "transactionId": "txn_1234567890",
    "maskedAadhaar": "XXXX XXXX 9012"
  }
}
```

---

### Verify Aadhaar OTP
**Endpoint:** `POST /api/auth/verification/aadhaar/verify`

**Authentication:** Required (artisan or distributor role)

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Aadhaar verification completed successfully",
  "data": {
    "isIdentityVerified": true,
    "verifiedAt": "2025-07-10T10:30:00.000Z",
    "aadhaarData": {
      "name": "John Doe",
      "dateOfBirth": "01/01/1990",
      "gender": "M",
      "address": {
        "house": "123",
        "street": "MG Road",
        "location": "Sector 1",
        "vtc": "Mumbai",
        "district": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001"
      }
    }
  }
}
```

---

### Get Verification Status
**Endpoint:** `GET /api/auth/verification/status`

**Authentication:** Required

**Response for Aadhaar-verified user:**
```json
{
  "success": true,
  "message": "Verification status retrieved successfully",
  "data": {
    "requiresVerification": true,
    "isVerified": true,
    "verificationType": "aadhaar",
    "status": "verified",
    "maskedAadhaar": "XXXX XXXX 9012",
    "verifiedAt": "2025-07-10T10:30:00.000Z",
    "canSellProducts": true,
    "verificationAttempts": 1,
    "aadhaarData": {
      "name": "John Doe",
      "dateOfBirth": "01/01/1990",
      "gender": "M"
    }
  }
}
```

## Security Features

### 1. **Aadhaar Number Protection**
- **Hashing**: Aadhaar numbers are never stored in plain text
- **Salt**: Additional salt used for hashing to prevent rainbow table attacks
- **Masking**: Only last 4 digits shown to users
- **Encryption**: All API communications encrypted

### 2. **Rate Limiting**
- **3 attempts per hour**: Prevents verification abuse
- **Transaction tracking**: Each verification attempt tracked
- **Cooldown period**: 1-hour lockout after failed attempts

### 3. **Duplicate Prevention**
- **Unique constraint**: Each Aadhaar can only verify one account
- **Cross-checking**: Prevents multiple accounts with same Aadhaar
- **Hash comparison**: Secure duplicate detection

### 4. **Data Privacy**
- **Minimal storage**: Only necessary data stored
- **Secure transmission**: HTTPS/TLS encryption
- **Access control**: Admin-only access to sensitive data

## Database Schema Changes

### Updated User Model
```javascript
{
  // ...existing fields...
  
  aadhaarVerification: {
    aadhaarHash: String,           // SHA256 hash of Aadhaar + salt
    maskedAadhaar: String,         // "XXXX XXXX 1234"
    verificationStatus: String,    // "pending", "verified", "failed"
    verifiedAt: Date,
    aadhaarData: {
      name: String,
      dateOfBirth: String,
      gender: String,
      address: {
        house: String,
        street: String,
        location: String,
        vtc: String,
        district: String,
        state: String,
        pincode: String
      }
    },
    transactionId: String,         // Temporary for OTP verification
    verificationAttempts: Number,
    lastAttemptAt: Date
  }
}
```

## Environment Configuration

### Required Environment Variables
```env
# Aadhaar Verification API Configuration
AADHAAR_API_BASE_URL=https://api.aadhaarapi.com/v1
AADHAAR_API_KEY=your_aadhaar_api_key_here
AADHAAR_CLIENT_ID=your_aadhaar_client_id_here
AADHAAR_CLIENT_SECRET=your_aadhaar_client_secret_here
AADHAAR_HASH_SALT=your_aadhaar_hash_salt_make_it_very_long_and_random
```

### Development Mode
- **Mock API**: When API credentials not configured, system uses mock responses
- **Test OTP**: Use `123456` as OTP in development mode
- **Sample Data**: Mock Aadhaar data returned for testing

## Admin Features

### Manual Verification
**Endpoint:** `PATCH /api/auth/admin/verifications/{userId}/manual-verify`

**For cases where Aadhaar API fails or special circumstances:**

**Request Body:**
```json
{
  "verified": true,
  "notes": "Verified through alternative documents due to API issues"
}
```

### Pending Verifications
**Endpoint:** `GET /api/auth/admin/verifications/pending`

**Returns users who need manual review:**
- Failed Aadhaar verifications
- Multiple failed attempts
- Legacy document verifications

## Error Handling

### Common Error Scenarios

**1. Invalid Aadhaar Format**
```json
{
  "success": false,
  "message": "Aadhaar number must be 12 digits"
}
```

**2. Rate Limit Exceeded**
```json
{
  "success": false,
  "message": "Too many verification attempts. Please try again after 1 hour."
}
```

**3. Duplicate Aadhaar**
```json
{
  "success": false,
  "message": "This Aadhaar number is already verified with another account"
}
```

**4. API Service Error**
```json
{
  "success": false,
  "message": "Aadhaar verification service unavailable. Please try again later."
}
```

**5. Invalid OTP**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

## Integration with Aadhaar API Providers

### Supported Providers
1. **AadhaarAPI.com**
2. **Signzy**
3. **IDfy**
4. **KYC Hub**

### API Configuration Example
```javascript
// Service configuration
const aadhaarService = {
  baseUrl: 'https://api.aadhaarapi.com/v1',
  endpoints: {
    sendOtp: '/send-otp',
    verifyOtp: '/verify-otp'
  },
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
};
```

## Testing

### Manual Testing
```bash
# 1. Initiate verification
curl -X POST http://localhost:3000/api/auth/verification/aadhaar/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"aadhaarNumber": "1234 5678 9012"}'

# 2. Verify OTP (use 123456 in development)
curl -X POST http://localhost:3000/api/auth/verification/aadhaar/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"otp": "123456"}'

# 3. Check status
curl -X GET http://localhost:3000/api/auth/verification/status \
  -H "Authorization: Bearer <access_token>"
```

### Development Testing
```javascript
// In development mode, these work:
const testAadhaar = "1234 5678 9012"; // Any valid format
const testOtp = "123456";             // Fixed OTP for testing
```

## Migration from Document Upload

### Backward Compatibility
- **Legacy support**: Existing document verifications still valid
- **Gradual migration**: Users can choose verification method
- **Admin override**: Manual verification for edge cases

### Migration Steps
1. **Existing verified users**: No action needed
2. **Pending documents**: Admin can approve or ask for Aadhaar verification
3. **New users**: Only Aadhaar verification available

## Benefits

### For Users
- **Faster verification**: Complete in 2-3 minutes
- **No document scanning**: Just enter Aadhaar number
- **Real-time status**: Instant verification results
- **Secure process**: No sensitive documents uploaded

### For Admins
- **Reduced workload**: Automated verification process
- **Better security**: API-based verification more reliable
- **Audit trail**: Complete verification history
- **Fraud prevention**: Duplicate detection and rate limiting

### For Business
- **Higher conversion**: Simplified verification process
- **Reduced costs**: No manual document review
- **Compliance**: UIDAI-compliant verification
- **Scalability**: Automated process handles volume

## Compliance & Legal

### UIDAI Compliance
- **Authorized usage**: Only for KYC verification
- **Data minimization**: Store only required fields
- **Consent management**: User consent before verification
- **Audit requirements**: Maintain verification logs

### Privacy Protection
- **Data encryption**: All data encrypted at rest and transit
- **Access control**: Role-based access to Aadhaar data
- **Retention policy**: Data retention as per regulations
- **Right to deletion**: Support for data deletion requests

This new Aadhaar verification system provides a modern, secure, and user-friendly identity verification process that significantly improves the user experience while maintaining the highest security standards.
