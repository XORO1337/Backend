# API Documentation - Authentication & Authorization Endpoints

## Base URL
```
http://localhost:3000/api
```

## Authentication Headers
For protected endpoints, include the JWT access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### Register with Phone Number
Create a new user account using phone number and password.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+919876543210",
  "password": "StrongPass123!",
  "role": "customer"
}
```

**Validation Rules:**
- `name`: 2-50 characters, letters and spaces only
- `phone`: Valid Indian mobile number
- `password`: Min 8 chars, must include uppercase, lowercase, number, special char
- `role`: One of "customer", "artisan", "distributor"

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your phone number.",
  "data": {
    "userId": "64f5a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "phone": "+919876543210",
    "role": "customer",
    "isPhoneVerified": false
  }
}
```

---

### Login with Phone/Email
Authenticate user with phone number or email and password.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "phone": "+919876543210",
  "password": "StrongPass123!"
}
```

OR

```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+919876543210",
      "role": "customer",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "isIdentityVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** Refresh token is set as HTTP-only cookie automatically.

---

### Google OAuth Login
Initiate Google OAuth authentication flow.

**Endpoint:** `GET /auth/google`

**Response:** Redirects to Google OAuth consent screen.

**Callback:** `GET /auth/google/callback`
- Handles OAuth callback
- Sets refresh token as HTTP-only cookie
- Redirects to appropriate dashboard based on user role

---

### Send OTP
Send OTP to user's phone number for verification.

**Endpoint:** `POST /auth/send-otp`

**Rate Limit:** 3 requests per 15 minutes

**Request Body:**
```json
{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### Verify OTP
Verify the OTP sent to user's phone number.

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Phone number verified successfully"
}
```

---

### Refresh Access Token
Get a new access token using the refresh token.

**Endpoint:** `POST /auth/refresh-token`

**Authentication:** Requires refresh token in HTTP-only cookie

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get User Profile
Get current authenticated user's profile.

**Endpoint:** `GET /auth/profile`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+919876543210",
    "role": "customer",
    "addresses": [...],
    "isEmailVerified": true,
    "isPhoneVerified": true,
    "isIdentityVerified": false,
    "verificationDocuments": [...],
    "createdAt": "2023-09-04T10:30:00.000Z"
  }
}
```

---

### Change Password
Change user's password.

**Endpoint:** `POST /auth/change-password`

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456@",
  "confirmPassword": "NewPassword456@"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully. Please log in again."
}
```

**Note:** This endpoint clears all refresh tokens, requiring user to log in again.

---

### Logout
Logout from current device.

**Endpoint:** `POST /auth/logout`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Logout All Devices
Logout from all devices.

**Endpoint:** `POST /auth/logout-all`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Logged out from all devices successfully"
}
```

---

## 🏠 Address Management Endpoints

### Add Address
Add a new delivery address for the user.

**Endpoint:** `POST /auth/addresses`

**Authentication:** Required

**Request Body:**
```json
{
  "houseNo": "123",
  "street": "MG Road",
  "city": "Mumbai",
  "district": "Mumbai",
  "pinCode": "400001",
  "isDefault": true
}
```

**Validation Rules:**
- `houseNo`: Required, max 20 characters
- `street`: Required, max 100 characters
- `city`: Required, max 50 characters, letters and spaces only
- `district`: Required, max 50 characters, letters and spaces only
- `pinCode`: Required, exactly 6 digits
- `isDefault`: Optional boolean

**Response:**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
    "houseNo": "123",
    "street": "MG Road",
    "city": "Mumbai",
    "district": "Mumbai",
    "pinCode": "400001",
    "isDefault": true
  }
}
```

---

### Get All Addresses
Get all addresses for the authenticated user.

**Endpoint:** `GET /auth/addresses`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
      "houseNo": "123",
      "street": "MG Road",
      "city": "Mumbai",
      "district": "Mumbai",
      "pinCode": "400001",
      "isDefault": true
    }
  ]
}
```

---

### Get Default Address
Get the default address for the authenticated user.

**Endpoint:** `GET /auth/addresses/default`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Default address retrieved successfully",
  "data": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
    "houseNo": "123",
    "street": "MG Road",
    "city": "Mumbai",
    "district": "Mumbai",
    "pinCode": "400001",
    "isDefault": true
  }
}
```

---

### Get Address by ID
Get a specific address by its ID.

**Endpoint:** `GET /auth/addresses/:addressId`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Address retrieved successfully",
  "data": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
    "houseNo": "123",
    "street": "MG Road",
    "city": "Mumbai",
    "district": "Mumbai",
    "pinCode": "400001",
    "isDefault": true
  }
}
```

---

### Update Address
Update an existing address.

**Endpoint:** `PUT /auth/addresses/:addressId`

**Authentication:** Required

**Request Body:** Same as Add Address

**Response:**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
    "houseNo": "456",
    "street": "Brigade Road",
    "city": "Mumbai",
    "district": "Mumbai",
    "pinCode": "400001",
    "isDefault": true
  }
}
```

---

### Delete Address
Delete an address.

**Endpoint:** `DELETE /auth/addresses/:addressId`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

### Set Default Address
Set an address as the default.

**Endpoint:** `PATCH /auth/addresses/:addressId/set-default`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Default address updated successfully",
  "data": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
    "houseNo": "123",
    "street": "MG Road",
    "city": "Mumbai",
    "district": "Mumbai",
    "pinCode": "400001",
    "isDefault": true
  }
}
```

---

## 📋 Identity Verification Endpoints (Updated)

### Initiate Aadhaar Verification
Start the Aadhaar verification process by entering the 12-digit Aadhaar number.

**Endpoint:** `POST /auth/verification/aadhaar/initiate`

**Authentication:** Required (artisan or distributor role)

**Request Body:**
```json
{
  "aadhaarNumber": "1234 5678 9012"
}
```

**Validation Rules:**
- `aadhaarNumber`: Must be 12 digits, can include spaces (format: XXXX XXXX XXXX or XXXXXXXXXXXX)
- Verhoeff checksum validation applied
- Rate limiting: 3 attempts per hour

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

**Error Responses:**
- **400**: Invalid Aadhaar format or checksum
- **429**: Too many verification attempts
- **400**: Aadhaar already verified with another account

---

### Verify Aadhaar OTP
Complete the verification by entering the OTP received on Aadhaar-registered mobile.

**Endpoint:** `POST /auth/verification/aadhaar/verify`

**Authentication:** Required (artisan or distributor role)

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Validation Rules:**
- `otp`: Must be exactly 6 digits
- Must have active verification session

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

**Error Responses:**
- **400**: Invalid or expired OTP
- **400**: No verification session in progress
- **500**: Aadhaar service unavailable

---

### Get Verification Status (Updated)
Get comprehensive verification status including Aadhaar verification details.

**Endpoint:** `GET /auth/verification/status`

**Authentication:** Required

**Response for customers:**
```json
{
  "success": true,
  "message": "Verification status retrieved successfully",
  "data": {
    "requiresVerification": false,
    "isVerified": true,
    "status": "not_required"
  }
}
```

**Response for artisans/distributors (Aadhaar verified):**
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
    "lastAttemptAt": "2025-07-10T10:00:00.000Z",
    "aadhaarData": {
      "name": "John Doe",
      "dateOfBirth": "01/01/1990",
      "gender": "M"
    }
  }
}
```

**Response for unverified users:**
```json
{
  "success": true,
  "message": "Verification status retrieved successfully",
  "data": {
    "requiresVerification": true,
    "isVerified": false,
    "verificationType": "aadhaar",
    "status": "not_started",
    "canSellProducts": false
  }
}
```

---

### Legacy Document Endpoints (Deprecated)

#### Upload Verification Document
**Endpoint:** `POST /auth/verification/upload`

**Status:** `410 Gone`

**Response:**
```json
{
  "success": false,
  "message": "Document upload is no longer supported. Please use Aadhaar verification instead."
}
```

#### Get Verification Documents
**Endpoint:** `GET /auth/verification/documents`

**Authentication:** Required (artisan or distributor role)

**Response:**
```json
{
  "success": true,
  "message": "Verification information retrieved successfully",
  "data": {
    "verificationType": "aadhaar",
    "isIdentityVerified": true,
    "aadhaarVerification": {
      "status": "verified",
      "maskedAadhaar": "XXXX XXXX 9012",
      "verifiedAt": "2025-07-10T10:30:00.000Z"
    }
  }
}
```

---

## 👨‍💼 Admin Verification Endpoints (Updated)

### Get Pending Verifications
Get users who need manual verification review.

**Endpoint:** `GET /auth/admin/verifications/pending`

**Authentication:** Required (admin role)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Pending verifications retrieved successfully",
  "data": {
    "verifications": [
      {
        "userId": "64f5a1b2c3d4e5f6a7b8c9d0",
        "userName": "John Doe",
        "userEmail": "john@example.com",
        "userPhone": "+919876543210",
        "userRole": "artisan",
        "aadhaarVerification": {
          "status": "failed",
          "maskedAadhaar": "XXXX XXXX 9012",
          "attempts": 3,
          "lastAttempt": "2025-07-10T10:30:00.000Z"
        },
        "legacyDocuments": 0,
        "needsReview": true
      }
    ],
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1
  }
}
```

---

### Manual User Verification
Manually verify users when Aadhaar verification fails or for special cases.

**Endpoint:** `PATCH /auth/admin/verifications/:userId/manual-verify`

**Authentication:** Required (admin role)

**Request Body:**
```json
{
  "verified": true,
  "notes": "Verified through alternative documents due to API issues"
}
```

**Validation:**
- `verified`: Boolean (required)
- `notes`: String, max 500 characters (optional)

**Response:**
```json
{
  "success": true,
  "message": "User verified successfully",
  "data": {
    "userId": "64f5a1b2c3d4e5f6a7b8c9d0",
    "isIdentityVerified": true,
    "verifiedAt": "2025-07-10T10:30:00.000Z",
    "notes": "Verified through alternative documents due to API issues"
  }
}
```

---

### Legacy Admin Endpoints (Deprecated)

#### Review Document
**Endpoint:** `PATCH /auth/admin/verifications/:userId/:documentId`

**Status:** `410 Gone`

**Response:**
```json
{
  "success": false,
  "message": "Document review is no longer supported. Users should use Aadhaar verification."
}
```

#### Download Document
**Endpoint:** `GET /auth/admin/verifications/:userId/:documentId/download`

**Status:** `410 Gone`

**Response:**
```json
{
  "success": false,
  "message": "Document download is no longer available. System now uses Aadhaar verification."
}
```

---

## 🔍 Public Search Endpoints

### Search Users
Search for users by name, email, or phone (public endpoint with optional authentication).

**Endpoint:** `GET /users/search`

**Authentication:** Optional

**Query Parameters:**
- `q`: Search term (required)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "message": "Users found",
  "data": {
    "users": [
      {
        "id": "64f5a1b2c3d4e5f6a7b8c9d0",
        "name": "John Doe",
        "role": "artisan",
        "isIdentityVerified": true
      }
    ],
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1
  }
}
```

---

### Search Artisans by Skills
Search for artisans by their skills.

**Endpoint:** `GET /artisans/search/skills`

**Authentication:** Optional

**Query Parameters:**
- `skills`: Comma-separated list of skills (required)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Example:** `/artisans/search/skills?skills=pottery,weaving&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "message": "Artisans found by skills",
  "data": {
    "artisans": [
      {
        "id": "64f5a1b2c3d4e5f6a7b8c9d0",
        "userId": {
          "name": "Jane Smith",
          "isIdentityVerified": true
        },
        "skills": ["pottery", "ceramics"],
        "description": "Expert potter with 10 years experience"
      }
    ],
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1
  }
}
```

---

### Search Artisans by Region
Search for artisans by geographical region.

**Endpoint:** `GET /artisans/search/region`

**Authentication:** Optional

**Query Parameters:**
- `region`: Region name (required)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Artisans found by region",
  "data": {
    "artisans": [
      {
        "id": "64f5a1b2c3d4e5f6a7b8c9d0",
        "userId": {
          "name": "Jane Smith",
          "isIdentityVerified": true
        },
        "location": "Mumbai, Maharashtra",
        "skills": ["pottery", "ceramics"]
      }
    ],
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1
  }
}
```

---

## 🚫 Error Responses

### Common Error Status Codes

- **400 Bad Request**: Validation errors, malformed request
- **401 Unauthorized**: Authentication required, invalid token
- **403 Forbidden**: Access denied, insufficient permissions
- **404 Not Found**: Resource not found
- **423 Locked**: Account temporarily locked
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "success": false,
  "message": "Detailed error message",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Rate Limiting Headers

When rate limits are exceeded, the following headers are included:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1693825200
Retry-After: 900
```

---

## 💡 Usage Examples

### Complete User Registration Flow

1. **Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+919876543210",
    "password": "StrongPass123!",
    "role": "customer"
  }'
```

2. **Send OTP for Verification**
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210"
  }'
```

3. **Verify OTP**
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "otp": "123456"
  }'
```

4. **Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "password": "StrongPass123!"
  }'
```

### Adding and Managing Addresses

1. **Add Address**
```bash
curl -X POST http://localhost:3000/api/auth/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "houseNo": "123",
    "street": "MG Road",
    "city": "Mumbai",
    "district": "Mumbai",
    "pinCode": "400001",
    "isDefault": true
  }'
```

2. **Get All Addresses**
```bash
curl -X GET http://localhost:3000/api/auth/addresses \
  -H "Authorization: Bearer <access_token>"
```

### Identity Verification for Artisans

1. **Upload Document**
```bash
curl -X POST http://localhost:3000/api/auth/verification/upload \
  -H "Authorization: Bearer <access_token>" \
  -F "type=aadhaar" \
  -F "document=@/path/to/aadhaar.jpg"
```

2. **Check Verification Status**
```bash
curl -X GET http://localhost:3000/api/auth/verification/status \
  -H "Authorization: Bearer <access_token>"
```

This comprehensive API documentation covers all authentication, authorization, address management, and identity verification endpoints in your marketplace application.
