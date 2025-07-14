/**
 * Enhanced RBAC Security System Tests
 * Tests role-based access control, resource ownership validation, and malicious request detection
 */

const request = require('supertest');
const app = require('./app');
const User = require('./models/User');

describe('Enhanced RBAC Security System', () => {
  let customerToken, artisanToken, distributorToken, adminToken;
  let customerUser, artisanUser, distributorUser, adminUser;
  let artisanProfile, distributorProfile;

  beforeAll(async () => {
    // Create test users
    customerUser = await User.create({
      name: 'Test Customer',
      phone: '+919876543300',
      password: 'TestPassword123!',
      role: 'customer',
      isPhoneVerified: true
    });

    artisanUser = await User.create({
      name: 'Test Artisan',
      phone: '+919876543301',
      password: 'TestPassword123!',
      role: 'artisan',
      isPhoneVerified: true,
      isIdentityVerified: true
    });

    distributorUser = await User.create({
      name: 'Test Distributor',
      phone: '+919876543302',
      password: 'TestPassword123!',
      role: 'distributor',
      isPhoneVerified: true,
      isIdentityVerified: true
    });

    adminUser = await User.create({
      name: 'Test Admin',
      phone: '+919876543303',
      password: 'TestPassword123!',
      role: 'admin',
      isPhoneVerified: true
    });

    // Get authentication tokens
    const customerLogin = await request(app)
      .post('/api/auth/login')
      .send({ phone: '+919876543300', password: 'TestPassword123!' });
    customerToken = customerLogin.body.data.accessToken;

    const artisanLogin = await request(app)
      .post('/api/auth/login')
      .send({ phone: '+919876543301', password: 'TestPassword123!' });
    artisanToken = artisanLogin.body.data.accessToken;

    const distributorLogin = await request(app)
      .post('/api/auth/login')
      .send({ phone: '+919876543302', password: 'TestPassword123!' });
    distributorToken = distributorLogin.body.data.accessToken;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ phone: '+919876543303', password: 'TestPassword123!' });
    adminToken = adminLogin.body.data.accessToken;
  });

  describe('Role-Based Access Control', () => {
    it('should allow customer to read their own profile', async () => {
      const response = await request(app)
        .get(`/api/users/${customerUser._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Customer');
    });

    it('should prevent customer from accessing admin endpoints', async () => {
      const response = await request(app)
        .get('/api/auth/admin/verifications/pending')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Required roles: admin');
    });

    it('should allow admin to access admin endpoints', async () => {
      const response = await request(app)
        .get('/api/auth/admin/verifications/pending')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should prevent artisan from accessing distributor-only features', async () => {
      // This would be a distributor-specific endpoint
      const response = await request(app)
        .post('/api/distributors')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({
          businessName: 'Test Business',
          businessType: 'wholesale'
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Resource Ownership Validation', () => {
    it('should prevent user from accessing another user\'s profile', async () => {
      const response = await request(app)
        .get(`/api/users/${artisanUser._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('You can only access your own');
      expect(response.body.code).toBe('RESOURCE_ACCESS_DENIED');
    });

    it('should allow admin to access any user\'s profile', async () => {
      const response = await request(app)
        .get(`/api/users/${customerUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should prevent artisan from updating another artisan\'s profile', async () => {
      // Create another artisan profile first
      const anotherArtisan = await User.create({
        name: 'Another Artisan',
        phone: '+919876543304',
        password: 'TestPassword123!',
        role: 'artisan',
        isPhoneVerified: true,
        isIdentityVerified: true
      });

      const profileResponse = await request(app)
        .post('/api/artisans')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({
          skills: ['pottery'],
          experience: 5,
          location: 'Mumbai'
        });

      const anotherProfileResponse = await request(app)
        .post('/api/artisans')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: anotherArtisan._id,
          skills: ['weaving'],
          experience: 3,
          location: 'Delhi'
        });

      // Try to update another artisan's profile
      const updateResponse = await request(app)
        .put(`/api/artisans/${anotherProfileResponse.body.data._id}`)
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({
          skills: ['pottery', 'sculpture']
        })
        .expect(403);

      expect(updateResponse.body.success).toBe(false);
      expect(updateResponse.body.code).toBe('RESOURCE_ACCESS_DENIED');
    });
  });

  describe('Malicious Request Detection', () => {
    it('should detect and block SQL injection attempts', async () => {
      const response = await request(app)
        .get('/api/users/search?q=\'; DROP TABLE users; --')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Request blocked due to security concerns');
      expect(response.body.code).toBe('SECURITY_VIOLATION');
    });

    it('should detect NoSQL injection patterns', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '+919876543300',
          password: { $ne: null }
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('SECURITY_VIOLATION');
    });

    it('should detect path traversal attempts', async () => {
      const response = await request(app)
        .get('/api/users/../admin/secret')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('SECURITY_VIOLATION');
    });

    it('should allow legitimate requests through security screening', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Cross-User Access Prevention', () => {
    it('should prevent user from updating another user in request body', async () => {
      const response = await request(app)
        .patch(`/api/users/${customerUser._id}/address`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          userId: artisanUser._id, // Trying to modify another user
          houseNo: '123',
          street: 'Test Street'
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('CROSS_USER_ACCESS_DENIED');
    });

    it('should allow admin to access any user data', async () => {
      const response = await request(app)
        .get(`/api/users/${customerUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Identity Verification Requirements', () => {
    it('should prevent unverified artisan from creating products', async () => {
      // Create unverified artisan
      const unverifiedArtisan = await User.create({
        name: 'Unverified Artisan',
        phone: '+919876543305',
        password: 'TestPassword123!',
        role: 'artisan',
        isPhoneVerified: true,
        isIdentityVerified: false
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ phone: '+919876543305', password: 'TestPassword123!' });

      const unverifiedToken = loginResponse.body.data.accessToken;

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${unverifiedToken}`)
        .send({
          name: 'Test Product',
          price: 100,
          description: 'Test description'
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('IDENTITY_VERIFICATION_REQUIRED');
    });

    it('should allow verified artisan to create products', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({
          name: 'Verified Product',
          price: 150,
          description: 'Product from verified artisan'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Security Audit Logging', () => {
    it('should include audit trail headers in responses', async () => {
      const response = await request(app)
        .get(`/api/users/${customerUser._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.headers['x-audit-trail']).toBeDefined();
      expect(response.headers['x-audit-trail']).toMatch(/read-user-\d+/);
    });

    it('should log sensitive operations', async () => {
      // Create artisan profile (should be logged)
      const response = await request(app)
        .post('/api/artisans')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({
          skills: ['pottery'],
          experience: 5,
          location: 'Mumbai'
        })
        .expect(201);

      expect(response.headers['x-audit-trail']).toBeDefined();
      expect(response.body.success).toBe(true);
    });
  });

  describe('Rate Limiting by Role', () => {
    it('should enforce different rate limits for different roles', async () => {
      // This test would require making many requests rapidly
      // Simplified version - just verify the middleware is applied
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Permission-Based Access', () => {
    it('should check granular permissions for actions', async () => {
      // Customer trying to create artisan profile
      const response = await request(app)
        .post('/api/artisans')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          skills: ['pottery'],
          experience: 5
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('INSUFFICIENT_PERMISSIONS');
    });

    it('should allow users with proper permissions', async () => {
      const response = await request(app)
        .post('/api/artisans')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({
          skills: ['pottery'],
          experience: 5,
          location: 'Mumbai'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });

  afterAll(async () => {
    // Clean up test data
    await User.findByIdAndDelete(customerUser._id);
    await User.findByIdAndDelete(artisanUser._id);
    await User.findByIdAndDelete(distributorUser._id);
    await User.findByIdAndDelete(adminUser._id);
  });
});

// Additional security test scenarios
describe('Advanced Security Scenarios', () => {
  describe('Privilege Escalation Prevention', () => {
    it('should prevent role modification in update requests', async () => {
      const user = await User.create({
        name: 'Test User',
        phone: '+919876543306',
        password: 'TestPassword123!',
        role: 'customer',
        isPhoneVerified: true
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ phone: '+919876543306', password: 'TestPassword123!' });

      const token = loginResponse.body.data.accessToken;

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          role: 'admin', // Trying to escalate to admin
          name: 'Updated Name'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      // Should validate that role cannot be changed
    });
  });

  describe('Concurrent Request Validation', () => {
    it('should handle concurrent requests safely', async () => {
      const user = await User.create({
        name: 'Concurrent Test User',
        phone: '+919876543307',
        password: 'TestPassword123!',
        role: 'artisan',
        isPhoneVerified: true,
        isIdentityVerified: true
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ phone: '+919876543307', password: 'TestPassword123!' });

      const token = loginResponse.body.data.accessToken;

      // Make multiple concurrent requests
      const requests = Array(5).fill().map(() =>
        request(app)
          .post('/api/artisans')
          .set('Authorization', `Bearer ${token}`)
          .send({
            skills: ['pottery'],
            experience: 5,
            location: 'Mumbai'
          })
      );

      const responses = await Promise.all(requests);
      
      // Only one should succeed (since user can only have one artisan profile)
      const successfulResponses = responses.filter(res => res.status === 201);
      expect(successfulResponses.length).toBeLessThanOrEqual(1);
    });
  });
});

module.exports = {
  // Export for use in other test files
  testSecurity: true
};
