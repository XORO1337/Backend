const twilio = require('twilio');

class OTPService {
  constructor() {
    // Only initialize Twilio client if credentials are provided
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      this.serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    } else {
      this.client = null;
      this.serviceSid = null;
      console.log('🔧 OTP Service initialized in mock mode (no Twilio credentials)');
    }
  }

  // Generate and send OTP
  async sendOTP(phoneNumber) {
    try {
      // Use mock implementation when no Twilio credentials available
      if (!this.client || !this.serviceSid) {
        console.log(`📱 Mock OTP for ${phoneNumber}: 123456`);
        return {
          success: true,
          sid: 'mock_sid_' + Date.now()
        };
      }

      // Use Twilio for production
      const verification = await this.client.verify.v2
        .services(this.serviceSid)
        .verifications
        .create({
          to: phoneNumber,
          channel: 'sms'
        });

      console.log(`📱 OTP sent via Twilio to ${phoneNumber}`);
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
      // Use mock verification when no Twilio credentials available
      if (!this.client || !this.serviceSid) {
        console.log(`📱 Mock OTP verification for ${phoneNumber}: ${otpCode}`);
        return {
          success: otpCode === '123456',
          status: otpCode === '123456' ? 'approved' : 'pending'
        };
      }

      // Use Twilio for production verification
      const verificationCheck = await this.client.verify.v2
        .services(this.serviceSid)
        .verificationChecks
        .create({
          to: phoneNumber,
          code: otpCode
        });

      console.log(`📱 OTP verified via Twilio for ${phoneNumber}: ${verificationCheck.status}`);
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
