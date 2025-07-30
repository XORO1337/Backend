# Authentication and Authorization System Documentation

## Overview

This marketplace application implements a comprehensive authentication and authorization system supporting:
- JWT-based authentication with refresh tokens
- Google OAuth 2.0 integration
- Phone number-based registration with OTP verification
- Role-based access control (RBAC)
- Identity verification for sellers
- Address management for buyers
- Security features including rate limiting and account lockout

## Authentication Methods

### 1. Phone Number-Based Authentication

#### Registration (Sign-Up)
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+919876543210",
  "password": "Password123!",
  "role": "customer" // or "artisan" or "distributor"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

#### Login (Sign-In)
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "phone": "+919876543210", // or "email": "user@example.com"
  "password": "Password123!"
}
```

### 2. Google OAuth 2.0

#### Initiate Google Login
**Endpoint:** `GET /api/auth/google`
- Redirects to Google OAuth consent screen

#### Google Callback
**Endpoint:** `GET /api/auth/google/callback`
- Handles OAuth callback and redirects based on user role

### 3. OTP Verification

#### Send OTP
**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**
```json
{
  "phone": "+919876543210"
}
```

#### Verify OTP
**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

## Authorization & Role-Based Access Control

### User Roles

1. **Customer (Buyer)**
   - Can browse marketplace without signing in
   - Must sign in to place orders or view profiles
   - Must provide complete address before ordering
   - Cannot access dashboards

2. **Artisan**
   - Redirected to dashboard after login
   - Must verify identity before selling products
   - Can manage products and orders
   - Can view other users' profiles when signed in

3. **Distributor**
   - Redirected to dashboard after login
   - Must verify identity before selling products
   - Can manage inventory and orders
   - Can view other users' profiles when signed in

4. **Admin**
   - Full system access
   - Can review identity verifications
   - Can manage all users and content

### Access Patterns

#### Public Access (No Authentication Required)
- Browse marketplace and search products
- Search for users (artisans/distributors) by name
- View public profiles of artisans and distributors
- Health check endpoint

#### Authenticated Access Required
- Place orders (customers)
- View detailed user profiles
- Access role-specific dashboards
- Manage personal profile and addresses

#### Identity Verification Required (Artisans & Distributors)
- List and sell products
- Access full dashboard functionality
- Update bank details
- Manage inventory

## Address Management for Customers

### Complete Address Requirements
Before placing orders, customers must provide:

- **House No.** (mandatory): Apartment or house number
- **Street** (mandatory): Street name or landmark
- **City** (mandatory): City name
- **District** (mandatory): District name
- **PinCode** (mandatory): 6-digit postal code

### Address Management Endpoints

#### Add Address
**Endpoint:** `POST /api/auth/addresses`

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

#### Get All Addresses
**Endpoint:** `GET /api/auth/addresses`

#### Get Default Address
**Endpoint:** `GET /api/auth/addresses/default`

#### Update Address
**Endpoint:** `PUT /api/auth/addresses/:addressId`

#### Delete Address
**Endpoint:** `DELETE /api/auth/addresses/:addressId`

#### Set Default Address
**Endpoint:** `PATCH /api/auth/addresses/:addressId/set-default`

## Identity Verification System

### Required for Artisans and Distributors

#### Acceptable Documents
- Aadhaar Card
- Driver's License
- PAN Card

#### Upload Document
**Endpoint:** `POST /api/auth/verification/upload`

**Request:** Multipart form data
- `type`: Document type (aadhaar/license/pan)
- `document`: File (JPEG, PNG, PDF up to 5MB)

#### Get Verification Status
**Endpoint:** `GET /api/auth/verification/status`

#### Get Verification Documents
**Endpoint:** `GET /api/auth/verification/documents`

### Admin Review Process

#### Get Pending Verifications
**Endpoint:** `GET /api/auth/admin/verifications/pending`

#### Review Document
**Endpoint:** `PATCH /api/auth/admin/verifications/:userId/:documentId`

**Request Body:**
```json
{
  "status": "approved", // or "rejected"
  "reviewNotes": "Document verified successfully"
}
```

## JWT Token Management

### Token Types
- **Access Token**: Short-lived (1 hour), used for API requests
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie

### Token Endpoints

#### Refresh Token
**Endpoint:** `POST /api/auth/refresh-token`
- Uses refresh token from HTTP-only cookie
- Returns new access token

#### Logout
**Endpoint:** `POST /api/auth/logout`
- Removes current refresh token

#### Logout All Devices
**Endpoint:** `POST /api/auth/logout-all`
- Removes all refresh tokens

## Security Features

### Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- OTP: 3 requests per 15 minutes

### Account Security
- Account lockout after 5 failed login attempts
- 2-hour lockout period
- Password hashing with bcrypt (12 rounds)
- Login attempt tracking

### Input Validation
- Express-validator for all inputs
- Phone number format validation
- Email format validation
- Address field validation
- File upload restrictions

### HTTP Security
- Helmet.js security headers
- CORS configuration
- Secure cookie settings
- HTTPS enforcement in production

## Search Functionality

### Public Search (No Authentication Required)

#### Search Users
**Endpoint:** `GET /api/users/search?q=searchTerm&page=1&limit=10`

#### Search Artisans by Skills
**Endpoint:** `GET /api/artisans/search/skills?skills=pottery,weaving&page=1&limit=10`

#### Search Artisans by Region
**Endpoint:** `GET /api/artisans/search/region?region=mumbai&page=1&limit=10`

### Authenticated Search
When authenticated, users get access to detailed profile information and can view private details.

## Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/artisan_management

# JWT Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Twilio (OTP)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid

# Client URL
CLIENT_URL=http://localhost:3000
```

## Error Handling

The system provides comprehensive error handling with appropriate HTTP status codes:

- `400`: Validation errors, bad requests
- `401`: Authentication required, invalid tokens
- `403`: Authorization denied, insufficient permissions
- `404`: Resource not found
- `423`: Account locked
- `429`: Rate limit exceeded
- `500`: Internal server errors

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## User Dashboard Redirection

After successful authentication:

- **Customers**: Redirected to marketplace homepage
- **Artisans/Distributors**: Redirected to role-specific dashboard
- **Admin**: Redirected to admin dashboard

Unverified artisans and distributors can access their dashboard but cannot perform selling operations until identity verification is complete.

## GDPR/Privacy Compliance

- User consent for data collection
- Secure document storage
- Data deletion capabilities (admin function)
- Minimal data collection principle
- Secure token storage in HTTP-only cookies

This authentication system provides enterprise-grade security while maintaining excellent user experience across all user types in the marketplace.
