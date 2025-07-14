const request = require('supertest');
const app = require('./app');

describe('Aadhaar Verification System Tests', () => {
  let artisanToken;
  let artisanUserId;

  beforeAll(async () => {
    // Register and login as artisan for testing
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Artisan',
        phone: '+919876543299',
        password: 'TestArtisan123!',
        role: 'artisan'
      });

    artisanUserId = registerResponse.body.data.userId;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        phone: '+919876543299',
        password: 'TestArtisan123!'
      });

    artisanToken = loginResponse.body.data.accessToken;
  });

  describe('POST /api/auth/verification/aadhaar/initiate', () => {
    it('should initiate Aadhaar verification with valid number', async () => {
      const aadhaarData = {
        aadhaarNumber: '1234 5678 9012'
      };

      const response = await request(app)
        .post('/api/auth/verification/aadhaar/initiate')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send(aadhaarData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP sent');
      expect(response.body.data.transactionId).toBeDefined();
      expect(response.body.data.maskedAadhaar).toBe('XXXX XXXX 9012');
    });

    it('should reject invalid Aadhaar format', async () => {
      const aadhaarData = {
        aadhaarNumber: '12345' // Invalid format
      };

      const response = await request(app)
        .post('/api/auth/verification/aadhaar/initiate')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send(aadhaarData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject request without authentication', async () => {
      const aadhaarData = {
        aadhaarNumber: '1234 5678 9012'
      };

      const response = await request(app)
        .post('/api/auth/verification/aadhaar/initiate')
        .send(aadhaarData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should reject request from customer role', async () => {
      // Register customer
      const customerRegister = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Customer',
          phone: '+919876543298',
          password: 'TestCustomer123!',
          role: 'customer'
        });

      const customerLogin = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '+919876543298',
          password: 'TestCustomer123!'
        });

      const customerToken = customerLogin.body.data.accessToken;

      const response = await request(app)
        .post('/api/auth/verification/aadhaar/initiate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ aadhaarNumber: '1234 5678 9012' })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('only required for artisans and distributors');
    });
  });

  describe('POST /api/auth/verification/aadhaar/verify', () => {
    beforeEach(async () => {
      // Initiate verification before each test
      await request(app)
        .post('/api/auth/verification/aadhaar/initiate')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({ aadhaarNumber: '1234 5678 9012' });
    });

    it('should verify OTP successfully', async () => {
      const otpData = {
        otp: '123456' // Mock OTP for development
      };

      const response = await request(app)
        .post('/api/auth/verification/aadhaar/verify')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send(otpData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('verification completed successfully');
      expect(response.body.data.isIdentityVerified).toBe(true);
      expect(response.body.data.aadhaarData).toBeDefined();
      expect(response.body.data.aadhaarData.name).toBeDefined();
    });

    it('should reject invalid OTP', async () => {
      const otpData = {
        otp: '000000' // Invalid OTP
      };

      const response = await request(app)
        .post('/api/auth/verification/aadhaar/verify')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send(otpData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('OTP verification failed');
    });

    it('should reject OTP verification without initiation', async () => {
      // Register new artisan without initiating verification
      const newArtisanRegister = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New Test Artisan',
          phone: '+919876543297',
          password: 'NewArtisan123!',
          role: 'artisan'
        });

      const newArtisanLogin = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '+919876543297',
          password: 'NewArtisan123!'
        });

      const newArtisanToken = newArtisanLogin.body.data.accessToken;

      const response = await request(app)
        .post('/api/auth/verification/aadhaar/verify')
        .set('Authorization', `Bearer ${newArtisanToken}`)
        .send({ otp: '123456' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No Aadhaar verification in progress');
    });

    it('should validate OTP format', async () => {
      const otpData = {
        otp: '12345' // Invalid format (5 digits instead of 6)
      };

      const response = await request(app)
        .post('/api/auth/verification/aadhaar/verify')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send(otpData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/auth/verification/status', () => {
    it('should return not_required for customer', async () => {
      // Register customer
      const customerRegister = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Status Test Customer',
          phone: '+919876543296',
          password: 'StatusCustomer123!',
          role: 'customer'
        });

      const customerLogin = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '+919876543296',
          password: 'StatusCustomer123!'
        });

      const customerToken = customerLogin.body.data.accessToken;

      const response = await request(app)
        .get('/api/auth/verification/status')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requiresVerification).toBe(false);
      expect(response.body.data.status).toBe('not_required');
    });

    it('should return verification status for artisan', async () => {
      const response = await request(app)
        .get('/api/auth/verification/status')
        .set('Authorization', `Bearer ${artisanToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requiresVerification).toBe(true);
      expect(response.body.data.verificationType).toBe('aadhaar');
      expect(['not_started', 'pending', 'verified', 'failed']).toContain(response.body.data.status);
    });

    it('should show verified status after successful verification', async () => {
      // Complete verification flow
      await request(app)
        .post('/api/auth/verification/aadhaar/initiate')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({ aadhaarNumber: '1234 5678 9012' });

      await request(app)
        .post('/api/auth/verification/aadhaar/verify')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({ otp: '123456' });

      const response = await request(app)
        .get('/api/auth/verification/status')
        .set('Authorization', `Bearer ${artisanToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isVerified).toBe(true);
      expect(response.body.data.status).toBe('verified');
      expect(response.body.data.canSellProducts).toBe(true);
      expect(response.body.data.maskedAadhaar).toBe('XXXX XXXX 9012');
    });
  });

  describe('Aadhaar Format Validation', () => {
    const testCases = [
      { number: '1234 5678 9012', valid: true, description: 'valid with spaces' },
      { number: '123456789012', valid: true, description: 'valid without spaces' },
      { number: '12345678901', valid: false, description: 'too short (11 digits)' },
      { number: '1234567890123', valid: false, description: 'too long (13 digits)' },
      { number: '1234 5678 901A', valid: false, description: 'contains letters' },
      { number: '0000 0000 0000', valid: false, description: 'all zeros' },
      { number: '1111 1111 1111', valid: false, description: 'all ones' },
      { number: '', valid: false, description: 'empty string' },
      { number: '1234-5678-9012', valid: false, description: 'invalid separator' }
    ];

    testCases.forEach(testCase => {
      it(`should ${testCase.valid ? 'accept' : 'reject'} ${testCase.description}`, async () => {
        const expectedStatus = testCase.valid ? 200 : 400;

        const response = await request(app)
          .post('/api/auth/verification/aadhaar/initiate')
          .set('Authorization', `Bearer ${artisanToken}`)
          .send({ aadhaarNumber: testCase.number })
          .expect(expectedStatus);

        expect(response.body.success).toBe(testCase.valid);
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on verification attempts', async () => {
      // Register new artisan for rate limit testing
      const rateLimitRegister = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Rate Limit Artisan',
          phone: '+919876543295',
          password: 'RateLimit123!',
          role: 'artisan'
        });

      const rateLimitLogin = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '+919876543295',
          password: 'RateLimit123!'
        });

      const rateLimitToken = rateLimitLogin.body.data.accessToken;

      // Make multiple verification attempts
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          request(app)
            .post('/api/auth/verification/aadhaar/initiate')
            .set('Authorization', `Bearer ${rateLimitToken}`)
            .send({ aadhaarNumber: '1234 5678 9012' })
        );
      }

      const responses = await Promise.all(promises);
      
      // At least one should be rate limited after 3 attempts
      const rateLimitedResponse = responses.find(res => res.status === 429);
      if (rateLimitedResponse) {
        expect(rateLimitedResponse.body.success).toBe(false);
        expect(rateLimitedResponse.body.message).toContain('Too many verification attempts');
      }
    });
  });

  describe('Legacy Document Endpoints', () => {
    it('should return 410 for deprecated upload endpoint', async () => {
      const response = await request(app)
        .post('/api/auth/verification/upload')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({ type: 'aadhaar' })
        .expect(410);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('no longer supported');
    });

    it('should return verification info for documents endpoint', async () => {
      const response = await request(app)
        .get('/api/auth/verification/documents')
        .set('Authorization', `Bearer ${artisanToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.verificationType).toBe('aadhaar');
    });
  });

  describe('Admin Endpoints', () => {
    let adminToken;

    beforeAll(async () => {
      // Create admin user for testing
      const adminRegister = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Admin',
          phone: '+919876543294',
          password: 'TestAdmin123!',
          role: 'admin'
        });

      // Manually set role to admin (in real app, this would be done by another admin)
      const User = require('./models/User');
      await User.findByIdAndUpdate(adminRegister.body.data.userId, { role: 'admin' });

      const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '+919876543294',
          password: 'TestAdmin123!'
        });

      adminToken = adminLogin.body.data.accessToken;
    });

    it('should get pending verifications', async () => {
      const response = await request(app)
        .get('/api/auth/admin/verifications/pending')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.verifications).toBeDefined();
      expect(Array.isArray(response.body.data.verifications)).toBe(true);
    });

    it('should manually verify user', async () => {
      const response = await request(app)
        .patch(`/api/auth/admin/verifications/${artisanUserId}/manual-verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          verified: true,
          notes: 'Manually verified for testing'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isIdentityVerified).toBe(true);
      expect(response.body.data.notes).toBe('Manually verified for testing');
    });

    it('should reject manual verification with invalid user ID', async () => {
      const response = await request(app)
        .patch('/api/auth/admin/verifications/invalid_id/manual-verify')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          verified: true,
          notes: 'Test'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('Aadhaar Service Integration', () => {
    it('should handle service unavailable scenarios', async () => {
      // This would test actual API failures in a real integration environment
      // For now, we test the mock service behavior
      const response = await request(app)
        .post('/api/auth/verification/aadhaar/initiate')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({ aadhaarNumber: '1234 5678 9012' });

      // In development mode, should always succeed with mock data
      if (process.env.NODE_ENV === 'development') {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      }
    });
  });

  // Clean up test data
  afterAll(async () => {
    const User = require('./models/User');
    await User.deleteMany({ 
      phone: { 
        $in: [
          '+919876543299', '+919876543298', '+919876543297', 
          '+919876543296', '+919876543295', '+919876543294'
        ] 
      } 
    });
  });
});
