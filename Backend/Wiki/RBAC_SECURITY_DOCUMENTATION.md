# Enhanced Role-Based Access Control (RBAC) Security System

## Overview

This enhanced security system provides comprehensive protection against unauthorized access and malicious requests while maintaining a smooth user experience. The system implements role-based permissions, resource ownership validation, malicious request detection, and comprehensive audit logging.

## Key Features

### 🛡️ Enhanced Authentication & Authorization
- **JWT Token Validation**: Secure token-based authentication
- **Role-Based Permissions**: Granular permissions per user role
- **Resource Ownership Validation**: Users can only access their own resources
- **Cross-User Access Prevention**: Blocks attempts to access other users' data

### 🔍 Malicious Request Detection
- **SQL Injection Protection**: Detects and blocks SQL injection attempts
- **NoSQL Injection Protection**: Prevents MongoDB injection attacks
- **Path Traversal Detection**: Blocks directory traversal attempts
- **XSS Prevention**: Detects cross-site scripting patterns
- **Admin Endpoint Protection**: Prevents unauthorized admin access

### 📊 Security Monitoring & Logging
- **Comprehensive Audit Trails**: Logs all sensitive operations
- **Suspicious Activity Detection**: Monitors and alerts on suspicious patterns
- **Security Violation Logging**: Detailed logging of security incidents
- **Real-time Threat Monitoring**: Continuous monitoring for threats

## Role-Based Permissions

### Customer Role
```javascript
Permissions:
- Read: Own profile, public artisan/distributor profiles, products
- Create: Orders, addresses
- Update: Own profile, own addresses
- Delete: Own addresses

Restrictions:
- Must have complete address before placing orders
- Cannot access admin or seller features
```

### Artisan Role
```javascript
Permissions:
- Read: Own profile, public profiles, products, own orders
- Create: Own artisan profile, products (requires identity verification)
- Update: Own profile, own products, bank details (requires identity verification)
- Delete: Own products

Restrictions:
- Must verify identity before selling products
- Cannot access other artisans' private data
- Cannot modify other users' resources
```

### Distributor Role
```javascript
Permissions:
- Read: Own profile, public profiles, products, own orders, own inventory
- Create: Own distributor profile, inventory (requires identity verification)
- Update: Own profile, own inventory
- Delete: Own inventory items

Restrictions:
- Must verify identity before managing inventory
- Cannot access other distributors' private data
- Cannot modify other users' resources
```

### Admin Role
```javascript
Permissions:
- Full access to all resources and operations
- Can review identity verifications
- Can manually verify users
- Can access all user data and analytics

Special Features:
- Bypass ownership validation
- Access admin-only endpoints
- Higher rate limits
- Full audit trail access
```

## API Endpoint Security

### Protected Endpoints Example

#### Artisan Profile Management
```javascript
// Create artisan profile
POST /api/artisans
Middleware: [authenticateToken, authorizeRoles('artisan'), detectMaliciousRequests, 
            requirePermission('create', 'artisan'), securityAuditLogger]

// Update artisan profile  
PUT /api/artisans/:id
Middleware: [authenticateToken, authorizeRoles('artisan'), detectMaliciousRequests,
            validateResourceOwnership('artisan'), requirePermission('update', 'artisan'),
            requireIdentityVerification, securityAuditLogger]

// Update bank details (sensitive operation)
PATCH /api/artisans/:id/bank-details
Middleware: [authenticateToken, authorizeRoles('artisan'), detectMaliciousRequests,
            validateResourceOwnership('artisan'), requirePermission('update', 'artisan'),
            requireIdentityVerification, securityAuditLogger]
```

#### User Management
```javascript
// Get user profile (own only)
GET /api/users/:id
Middleware: [authenticateToken, detectMaliciousRequests, validateResourceOwnership('user'),
            requirePermission('read', 'user'), securityAuditLogger]

// Update user profile (own only)
PUT /api/users/:id
Middleware: [authenticateToken, detectMaliciousRequests, validateResourceOwnership('user'),
            requirePermission('update', 'user'), securityAuditLogger]

// Admin: Get all users
GET /api/users
Middleware: [authenticateToken, authorizeRoles('admin'), detectMaliciousRequests,
            requirePermission('read', 'user'), securityAuditLogger]
```

## Security Middleware Components

### 1. Resource Ownership Validation
```javascript
validateResourceOwnership('artisan')
```
- Validates that the user owns the resource they're trying to access
- Prevents cross-user access attempts
- Admin users bypass this validation
- Logs unauthorized access attempts

### 2. Permission-Based Access Control
```javascript
requirePermission('update', 'artisan')
```
- Checks if user role has specific permission for the action
- Validates against the security configuration
- Supports granular permissions (read:own, read:all, etc.)

### 3. Malicious Request Detection
```javascript
detectMaliciousRequests
```
- Scans for SQL/NoSQL injection patterns
- Detects path traversal attempts
- Identifies XSS patterns
- Monitors for suspicious access patterns
- Blocks severe security violations

### 4. Cross-User Access Prevention
```javascript
preventCrossUserAccess
```
- Ensures users can only access their own user ID
- Validates URL parameters and request body
- Admin users exempt from this check

### 5. Security Audit Logging
```javascript
securityAuditLogger('update', 'artisan')
```
- Logs all sensitive operations
- Includes user ID, role, action, and resource
- Adds audit trail headers to responses
- Enables security monitoring and compliance

## Example Security Scenarios

### Scenario 1: Artisan Trying to Update Another Artisan's Profile
```javascript
Request: PUT /api/artisans/64abc123/profile
User: Artisan (ID: 64def456)

Security Response:
1. authenticateToken - ✅ Valid token
2. authorizeRoles('artisan') - ✅ User is artisan
3. detectMaliciousRequests - ✅ No malicious patterns
4. validateResourceOwnership('artisan') - ❌ BLOCKED
   
Response: 403 Forbidden
{
  "success": false,
  "message": "Access denied. You can only access your own artisan resources.",
  "code": "RESOURCE_ACCESS_DENIED"
}

Logged: ⚠️ Unauthorized access attempt: User 64def456 (artisan) tried to access artisan 64abc123
```

### Scenario 2: Customer Trying to Access Admin Endpoint
```javascript
Request: GET /api/auth/admin/verifications/pending
User: Customer (ID: 64ghi789)

Security Response:
1. authenticateToken - ✅ Valid token
2. authorizeRoles('admin') - ❌ BLOCKED

Response: 403 Forbidden
{
  "success": false,
  "message": "Access denied. Required roles: admin"
}

Logged: 🚨 Suspicious request: UNAUTHORIZED_ADMIN_ACCESS from user 64ghi789
```

### Scenario 3: SQL Injection Attempt
```javascript
Request: GET /api/users/search?q='; DROP TABLE users; --
User: Any authenticated user

Security Response:
1. authenticateToken - ✅ Valid token
2. detectMaliciousRequests - ❌ BLOCKED (SQL_INJECTION pattern detected)

Response: 400 Bad Request
{
  "success": false,
  "message": "Request blocked due to security concerns",
  "code": "SECURITY_VIOLATION"
}

Logged: 🚨 Suspicious request detected: SQL_INJECTION pattern from user
```

## Security Configuration

The security system is highly configurable through `/config/security.js`:

### Rate Limiting
```javascript
rateLimits: {
  customer: { windowMs: 15 * 60 * 1000, max: 100 },
  artisan: { windowMs: 15 * 60 * 1000, max: 200 },
  distributor: { windowMs: 15 * 60 * 1000, max: 200 },
  admin: { windowMs: 15 * 60 * 1000, max: 1000 }
}
```

### Security Patterns
```javascript
securityPatterns: {
  sqlInjection: ['DROP TABLE', 'UNION SELECT', "'OR 1=1", '; DELETE FROM'],
  nosqlInjection: ['$where', '$regex', '$ne', '$gt'],
  pathTraversal: ['../', '..\\', '%2e%2e%2f'],
  xssPatterns: ['<script', 'javascript:', 'onerror=']
}
```

## Implementation Guide

### 1. Apply to New Routes
```javascript
const { 
  authenticateToken, 
  authorizeRoles,
  validateResourceOwnership,
  requirePermission,
  detectMaliciousRequests,
  securityAuditLogger
} = require('../middleware/auth');

router.put('/api/resource/:id', 
  authenticateToken,                          // 1. Authenticate user
  authorizeRoles('artisan', 'admin'),        // 2. Check role
  detectMaliciousRequests,                   // 3. Security scan
  validateResourceOwnership('resource'),      // 4. Ownership check
  requirePermission('update', 'resource'),   // 5. Permission check
  securityAuditLogger('update', 'resource'), // 6. Audit log
  controllerFunction                         // 7. Execute
);
```

### 2. Configure Permissions
Update `/config/security.js` to add new resources or modify permissions:

```javascript
permissions: {
  newResource: {
    customer: ['read:public'],
    artisan: ['read:own', 'create:own', 'update:own'],
    admin: ['read:all', 'create:all', 'update:all', 'delete:all']
  }
}
```

## Monitoring and Alerts

### Security Logs
All security events are logged with structured information:
```javascript
🔐 Security Audit: artisan 64def456 performed update on artisan 64abc123
⚠️ Unauthorized access attempt: User 64def456 (artisan) tried to access artisan 64abc123
🚨 Suspicious request detected: SQL_INJECTION pattern from user 64ghi789
```

### Audit Trail Headers
Responses include audit trail information:
```javascript
X-Audit-Trail: update-artisan-1641234567890
```

## Best Practices

### 1. Always Use Multiple Middleware Layers
- Authentication first
- Role validation second  
- Security scanning third
- Resource ownership fourth
- Permission checking fifth
- Audit logging last

### 2. Keep Security Configuration Updated
- Regularly review and update security patterns
- Monitor logs for new attack patterns
- Update rate limits based on usage patterns

### 3. Test Security Scenarios
- Test cross-user access attempts
- Verify malicious request detection
- Ensure proper error responses
- Validate audit logging

### 4. Monitor Security Metrics
- Track failed authentication attempts
- Monitor suspicious activity patterns
- Review audit logs regularly
- Set up alerting for security violations

This enhanced RBAC system provides enterprise-grade security while maintaining excellent performance and user experience.
