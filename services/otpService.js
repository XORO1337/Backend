const twilio = require('twilio');

class OTPService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  }

  // Generate and send OTP
  async sendOTP(phoneNumber) {
    try {
      // For development, you can use a mock implementation
      if (process.env.NODE_ENV === 'development' && !process.env.TWILIO_ACCOUNT_SID) {
        console.log(`Mock OTP for ${phoneNumber}: 123456`);
        return {
          success: true,
          sid: 'mock_sid_' + Date.now()
        };
      }

      const verification = await this.client.verify.v2
        .services(this.serviceSid)
        .verifications
        .create({
          to: phoneNumber,
          channel: 'sms'
        });

      return {
        success: true,
        sid: verification.sid
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP. Please try again.');
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber, otpCode) {
    try {
      // For development, accept 123456 as valid OTP
      if (process.env.NODE_ENV === 'development' && !process.env.TWILIO_ACCOUNT_SID) {
        console.log(`Mock OTP verification for ${phoneNumber}: ${otpCode}`);
        return {
          success: otpCode === '123456',
          status: otpCode === '123456' ? 'approved' : 'pending'
        };
      }

      const verificationCheck = await this.client.verify.v2
        .services(this.serviceSid)
        .verificationChecks
        .create({
          to: phoneNumber,
          code: otpCode
        });

      return {
        success: verificationCheck.status === 'approved',
        status: verificationCheck.status
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        status: 'failed'
      };
    }
  }

  // Generate simple OTP for fallback
  generateSimpleOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store OTP in database (fallback method)
  async storeOTP(userId, otpCode) {
    const User = require('../models/User');
    
    try {
      await User.findByIdAndUpdate(userId, {
        otpCode: otpCode,
        otpExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      });
      
      return true;
    } catch (error) {
      console.error('Error storing OTP:', error);
      return false;
    }
  }

  // Verify stored OTP
  async verifyStoredOTP(userId, otpCode) {
    const User = require('../models/User');
    
    try {
      const user = await User.findById(userId);
      
      if (!user || !user.otpCode || !user.otpExpires) {
        return false;
      }
      
      if (user.otpExpires < new Date()) {
        return false;
      }
      
      if (user.otpCode !== otpCode) {
        return false;
      }
      
      // Clear OTP after successful verification
      await User.findByIdAndUpdate(userId, {
        $unset: { otpCode: 1, otpExpires: 1 },
        isPhoneVerified: true
      });
      
      return true;
    } catch (error) {
      console.error('Error verifying stored OTP:', error);
      return false;
    }
  }
}

module.exports = new OTPService();
