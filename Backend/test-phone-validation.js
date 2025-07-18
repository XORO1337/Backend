// Test phone number validation
const mongoose = require('mongoose');

// Test the exact same regex from User model
const phoneRegex = /^[+]?[\d\s-]{10,15}$/;

const testNumbers = [
  '8851929990',
  '+918851929990', 
  '+91 8851929990',
  '91-8851-929990',
  '9876543210',
  '+919876543210'
];

console.log('Testing User Model Regex:');
testNumbers.forEach(phone => {
  console.log(`${phone}: ${phoneRegex.test(phone)}`);
});

// Create a test user object to see mongoose validation
const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    match: [/^[+]?[\d\s-]{10,15}$/, 'Please enter a valid phone number']
  }
});

const User = mongoose.model('TestUser', userSchema);

console.log('\nTesting Mongoose Validation:');
testNumbers.forEach(phone => {
  try {
    const user = new User({ phone });
    const error = user.validateSync();
    console.log(`${phone}: ${error ? 'INVALID - ' + error.errors.phone?.message : 'VALID'}`);
  } catch (err) {
    console.log(`${phone}: ERROR - ${err.message}`);
  }
});
