const request = require('supertest');
const app = require('./app');

describe('Authentication System Tests', () => {
  
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        phone: '+919876543210',
        password: 'TestPass123!',
        role: 'customer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.phone).toBe(userData.phone);
      expect(response.body.data.role).toBe(userData.role);
      expect(response.body.data.isPhoneVerified).toBe(false);
    });

    it('should reject registration with weak password', async () => {
      const userData = {
        name: 'Test User',
        phone: '+919876543211',
        password: 'weak',
        role: 'customer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject registration with invalid phone number', async () => {
      const userData = {
        name: 'Test User',
        phone: 'invalid-phone',
        password: 'TestPass123!',
        role: 'customer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a test user before each login test
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          phone: '+919876543212',
          password: 'LoginTest123!',
          role: 'customer'
        });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        phone: '+919876543212',
        password: 'LoginTest123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.phone).toBe(loginData.phone);
    });

    it('should reject login with invalid credentials', async () => {
      const loginData = {
        phone: '+919876543212',
        password: 'WrongPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Backend API is running successfully');
      expect(response.body.version).toBeDefined();
    });
  });

  describe('Address Management', () => {
    let accessToken;
    let userId;

    beforeEach(async () => {
      // Register and login to get access token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Address Test User',
          phone: '+919876543213',
          password: 'AddressTest123!',
          role: 'customer'
        });

      userId = registerResponse.body.data.userId;

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '+919876543213',
          password: 'AddressTest123!'
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it('should add a new address', async () => {
      const addressData = {
        houseNo: '123',
        street: 'MG Road',
        city: 'Mumbai',
        district: 'Mumbai',
        pinCode: '400001',
        isDefault: true
      };

      const response = await request(app)
        .post('/api/auth/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(addressData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.houseNo).toBe(addressData.houseNo);
      expect(response.body.data.street).toBe(addressData.street);
      expect(response.body.data.city).toBe(addressData.city);
      expect(response.body.data.isDefault).toBe(true);
    });

    it('should get all addresses', async () => {
      // First add an address
      await request(app)
        .post('/api/auth/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          houseNo: '123',
          street: 'MG Road',
          city: 'Mumbai',
          district: 'Mumbai',
          pinCode: '400001'
        });

      const response = await request(app)
        .get('/api/auth/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should reject address with invalid pincode', async () => {
      const addressData = {
        houseNo: '123',
        street: 'MG Road',
        city: 'Mumbai',
        district: 'Mumbai',
        pinCode: 'invalid',
        isDefault: true
      };

      const response = await request(app)
        .post('/api/auth/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(addressData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('Search Functionality', () => {
    it('should search users without authentication', async () => {
      const response = await request(app)
        .get('/api/users/search?q=test&page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.users).toBeDefined();
      expect(Array.isArray(response.body.data.users)).toBe(true);
    });

    it('should search artisans by skills', async () => {
      const response = await request(app)
        .get('/api/artisans/search/skills?skills=pottery,weaving&page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on auth endpoints', async () => {
      const loginData = {
        phone: '+919876543999',
        password: 'WrongPassword123!'
      };

      // Make multiple rapid requests to trigger rate limit
      const requests = Array(10).fill().map(() => 
        request(app)
          .post('/api/auth/login')
          .send(loginData)
      );

      const responses = await Promise.all(requests);
      
      // At least one should be rate limited
      const rateLimitedResponse = responses.find(res => res.status === 429);
      expect(rateLimitedResponse).toBeDefined();
    });
  });

  describe('Authorization Middleware', () => {
    it('should require authentication for protected routes', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should allow access with valid token', async () => {
      // Register and login first
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Auth Test User',
          phone: '+919876543214',
          password: 'AuthTest123!',
          role: 'customer'
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '+919876543214',
          password: 'AuthTest123!'
        });

      const accessToken = loginResponse.body.data.accessToken;

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });
});

// Helper function to clean up test data
afterAll(async () => {
  // Clean up test users from database
  const User = require('./models/User');
  await User.deleteMany({ phone: { $regex: /\+9198765432/ } });
});
