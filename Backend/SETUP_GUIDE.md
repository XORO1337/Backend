# Setup Guide - Artisan Management System Backend

## Prerequisites

Before setting up the application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying from the template:
```bash
cp env.template .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/artisan_management

# JWT Configuration (Generate secure random strings)
JWT_ACCESS_SECRET=your_super_secure_jwt_access_secret_key_at_least_64_characters_long
JWT_REFRESH_SECRET=your_super_secure_jwt_refresh_secret_key_at_least_64_characters_long
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_from_console
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_console
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Client Configuration
CLIENT_URL=http://localhost:3000

# Twilio Configuration (for OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SERVICE_SID=your_twilio_verify_service_sid

# Security Configuration
BCRYPT_SALT_ROUNDS=12

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
OTP_RATE_LIMIT_MAX_REQUESTS=3

# Session Configuration
SESSION_SECRET=your_session_secret_key_make_it_very_long_and_random
COOKIE_SECURE=false
```

### 4. Database Setup

Ensure MongoDB is running on your system:

**For Ubuntu/Debian:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

**For macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**For Windows:**
Start MongoDB service from Services or use:
```bash
net start MongoDB
```

### 5. Create Required Directories
```bash
mkdir -p uploads/verification-documents
chmod 755 uploads
chmod 755 uploads/verification-documents
```

## Third-Party Service Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
7. Copy Client ID and Client Secret to your `.env` file

### Twilio Setup (for OTP)

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get Account SID and Auth Token from dashboard
3. Create a Verify Service:
   - Go to Verify → Services
   - Create a new service
   - Copy the Service SID
4. Add credentials to your `.env` file

**Note:** For development without Twilio, the system will use mock OTP (123456) when Twilio credentials are not provided.

### Aadhaar API Setup (for Identity Verification)

The system now uses Aadhaar API for identity verification instead of document uploads.

#### Option 1: AadhaarAPI.com
1. Sign up at [AadhaarAPI.com](https://aadhaarapi.com/)
2. Get API credentials from dashboard
3. Add to your `.env` file:
```env
AADHAAR_API_BASE_URL=https://api.aadhaarapi.com/v1
AADHAAR_API_KEY=your_api_key_here
AADHAAR_CLIENT_ID=your_client_id_here
AADHAAR_CLIENT_SECRET=your_client_secret_here
```

#### Option 2: Other Providers
- **Signzy**: Enterprise-grade Aadhaar verification
- **IDfy**: Comprehensive KYC solutions
- **KYC Hub**: Identity verification platform

#### Development Mode
**For development without API credentials:**
```env
# Leave Aadhaar API fields empty or comment them out
# AADHAAR_API_KEY=
# AADHAAR_CLIENT_ID=
# AADHAAR_CLIENT_SECRET=
```

The system will automatically use mock responses:
- Any valid 12-digit Aadhaar number accepted
- OTP: Use `123456` for successful verification
- Mock user data returned for testing

**Important:** Add a strong salt for Aadhaar hashing:
```env
AADHAAR_HASH_SALT=your_aadhaar_hash_salt_make_it_very_long_and_random_minimum_32_characters
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This uses nodemon for auto-reloading during development.

### Production Mode
```bash
npm start
```

### Using VS Code Task
You can also use the configured VS Code task:
```bash
# Use VS Code Command Palette (Ctrl+Shift+P)
# Run: "Tasks: Run Task" → "Start Backend Server"
```

## Verification

### 1. Check Server Status
Visit: `http://localhost:3000/api/health`

Expected response:
```json
{
  "success": true,
  "message": "Backend API is running successfully",
  "timestamp": "2023-09-04T10:30:00.000Z",
  "version": "2.0.0"
}
```

### 2. Check Database Connection
The server logs should show:
```
✅ Connected to MongoDB successfully
🚀 Server is running on port 3000
📱 API available at: http://localhost:3000
🔍 Health check: http://localhost:3000/api/health
```

### 3. Test API Endpoints
```bash
# Test user registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+919876543210",
    "password": "TestPass123!",
    "role": "customer"
  }'
```

## Development Workflow

### 1. Code Structure
```
Backend/
├── app.js                 # Main application file
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables
├── config/
│   └── passport.js       # Passport configuration
├── controllers/          # Business logic
├── middleware/           # Auth, validation, rate limiting
├── models/              # Database schemas
├── routes/              # API routes
├── services/            # External services (OTP, etc.)
└── uploads/             # File uploads
```

### 2. Adding New Features

**For new authentication methods:**
1. Add route in `routes/Auth_route.js`
2. Implement controller in `controllers/Auth_controller.js`
3. Add validation in `middleware/validation.js`
4. Test the endpoint

**For new user roles:**
1. Update `models/User.js` role enum
2. Add role-specific routes
3. Update authorization middleware
4. Test role permissions

### 3. Testing

**Manual Testing:**
```bash
# Test all authentication flows
npm run test-auth  # (if test script exists)

# Test with Postman collection
# Import the API documentation examples
```

**Database Testing:**
```bash
# Connect to MongoDB
mongo artisan_management

# View collections
show collections

# View users
db.users.find().pretty()

# Clean test data
db.users.deleteMany({"name": /test/i})
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` file to version control
- Use strong, unique secrets for JWT tokens
- Rotate secrets regularly in production

### 2. Database Security
```bash
# Create MongoDB user for the application
mongo admin
db.createUser({
  user: "artisan_app",
  pwd: "secure_password",
  roles: ["readWrite"]
})

# Update MONGO_URI in .env
MONGO_URI=mongodb://artisan_app:secure_password@localhost:27017/artisan_management
```

### 3. File Upload Security
- Verify file types and sizes
- Scan for malware in production
- Use cloud storage (AWS S3) for production

### 4. Rate Limiting
- Monitor API usage
- Adjust limits based on traffic patterns
- Implement user-specific rate limiting if needed

## Production Deployment

### 1. Environment Setup
```env
NODE_ENV=production
PORT=443
MONGO_URI=mongodb://username:password@production-mongo-host:27017/artisan_management
JWT_ACCESS_SECRET=production_jwt_access_secret
JWT_REFRESH_SECRET=production_jwt_refresh_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
CLIENT_URL=https://yourdomain.com
COOKIE_SECURE=true
```

### 2. Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start app.js --name "artisan-backend"
pm2 startup
pm2 save
```

### 3. Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running and accessible.

**2. JWT Token Errors**
```
Error: jwt malformed
```
**Solution:** Check JWT secret configuration in `.env`.

**3. Google OAuth Errors**
```
Error: invalid_client
```
**Solution:** Verify Google OAuth credentials and callback URLs.

**4. File Upload Errors**
```
Error: ENOENT: no such file or directory
```
**Solution:** Ensure upload directories exist and have proper permissions.

**5. Rate Limit Errors**
```
Error: Too many requests
```
**Solution:** Wait for rate limit window to reset or adjust limits.

### Debug Mode
```bash
DEBUG=* npm run dev
```

### Log Files
```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log
```

## API Testing Tools

### Postman Collection
Import the API documentation examples into Postman for easy testing.

### curl Examples
```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"+919876543210","password":"TestPass123!","role":"customer"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919876543210","password":"TestPass123!"}'
```

### Thunder Client (VS Code Extension)
Create requests directly in VS Code using the Thunder Client extension.

## Support

For issues and questions:
1. Check the logs for error details
2. Verify environment configuration
3. Ensure all dependencies are installed
4. Check MongoDB connection
5. Verify third-party service configurations

## Next Steps

After successful setup:
1. Test all authentication flows
2. Configure production environment
3. Set up monitoring and logging
4. Implement backup strategies
5. Configure SSL certificates
6. Set up CI/CD pipeline

The authentication and authorization system is now ready for use with comprehensive security features, role-based access control, and identity verification capabilities.
