const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('phone')
    .matches(/^[+]?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number (format: +918851929990 or 918851929990)')
    .trim(),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
  body('role')
    .isIn(['customer', 'artisan', 'distributor'])
    .withMessage('Role must be customer, artisan, or distributor'),
    
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('phone')
    .optional()
    .matches(/^[+]?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number')
    .trim(),
    
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  // Custom validation to ensure either phone or email is provided
  body().custom((value, { req }) => {
    if (!req.body.phone && !req.body.email) {
      throw new Error('Either phone number or email is required');
    }
    return true;
  }),
    
  handleValidationErrors
];

// OTP validation
const validateOTP = [
  body('phone')
    .matches(/^[+]?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number')
    .trim(),
    
  body('otp')
    .isLength({ min: 4, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 4-6 digit number'),
    
  handleValidationErrors
];

// Phone validation only (for send-otp and resend-otp)
const validatePhoneOnly = [
  body('phone')
    .matches(/^[+]?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number')
    .trim(),
    
  handleValidationErrors
];

// Address validation
const validateAddress = [
  body('houseNo')
    .trim()
    .notEmpty()
    .withMessage('House number is required')
    .isLength({ max: 20 })
    .withMessage('House number must not exceed 20 characters'),
    
  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street is required')
    .isLength({ max: 100 })
    .withMessage('Street must not exceed 100 characters'),
    
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 50 })
    .withMessage('City must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('City can only contain letters and spaces'),
    
  body('district')
    .trim()
    .notEmpty()
    .withMessage('District is required')
    .isLength({ max: 50 })
    .withMessage('District must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('District can only contain letters and spaces'),
    
  body('pinCode')
    .matches(/^\d{6}$/)
    .withMessage('Pin code must be a 6-digit number'),
    
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean value'),
    
  handleValidationErrors
];

// Identity verification document validation
const validateIdentityDocument = [
  body('type')
    .isIn(['aadhaar', 'license', 'pan'])
    .withMessage('Document type must be aadhaar, license, or pan'),
    
  handleValidationErrors
];

// Aadhaar number validation
const validateAadhaarNumber = [
  body('aadhaarNumber')
    .notEmpty()
    .withMessage('Aadhaar number is required')
    .matches(/^\d{4}\s?\d{4}\s?\d{4}$/)
    .withMessage('Aadhaar number must be 12 digits (format: XXXX XXXX XXXX or XXXXXXXXXXXX)'),
    
  handleValidationErrors
];

// Aadhaar OTP validation
const validateAadhaarOTP = [
  body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
    
  handleValidationErrors
];

// Admin manual verification validation
const validateManualVerification = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID format'),
    
  body('verified')
    .isBoolean()
    .withMessage('Verified status must be true or false'),
    
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
    
  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('phone')
    .optional()
    .matches(/^[+]?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number')
    .trim(),
    
  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
    
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
    
  handleValidationErrors
];

// ID parameter validation
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
    
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
    
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateOTP,
  validatePhoneOnly,
  validateAddress,
  validateIdentityDocument,
  validateAadhaarNumber,
  validateAadhaarOTP,
  validateManualVerification,
  validateProfileUpdate,
  validatePasswordChange,
  validateObjectId,
  validateSearch,
  handleValidationErrors
};
