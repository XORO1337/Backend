// Direct test of the User model validation
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function testUserValidation() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Test data
    const testUser = {
      name: "Ansh",
      phone: "+918851929990",
      password: "SecurePass123!",
      role: "customer"
    };

    console.log('Testing user creation with:', testUser);

    // Create user instance
    const user = new User(testUser);
    
    console.log('User instance created, running validation...');
    
    // Validate
    await user.validate();
    console.log('✅ Validation passed!');
    
    // Try to save
    await user.save();
    console.log('✅ User saved successfully!');
    
    // Clean up
    await User.deleteOne({ _id: user._id });
    console.log('✅ Test user cleaned up');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`  ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testUserValidation();
