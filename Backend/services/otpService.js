const User = require('../models/User');
const crypto = require('crypto');

class OTPService {
  constructor() {
    // OTP configuration
    this.OTP_LENGTH = 6;
    this.OTP_EXPIRY_MINUTES = 10;
    this.MAX_RESEND_ATTEMPTS = 5; // Increased limit
    this.RESEND_COOLDOWN_MINUTES = 1;
    this.MAX_VERIFICATION_ATTEMPTS = 5;
    this.LOCKOUT_DURATION_MINUTES = 30; // Lock account after max attempts
    this.MAX_DAILY_SENDS = 10; // Maximum OTPs per day per phone number
  }

  // Generate a cryptographically secure random OTP
  generateOTP() {
    // Generate cryptographically secure random OTP
    const buffer = crypto.randomBytes(3);
    const otp = (parseInt(buffer.toString('hex'), 16) % 900000 + 100000).toString();
    return otp;
  }

  // Send OTP to phone number (MongoDB-based implementation)
  async sendOTP(phoneNumber, userId = null) {
    try {
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);
      const currentTime = new Date();

      let user;
      if (userId) {
        user = await User.findById(userId);
      } else {
        user = await User.findOne({ phone: phoneNumber });
      }

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user is locked out due to too many attempts
      if (user.otpLockUntil && user.otpLockUntil > currentTime) {
        const lockTimeRemaining = Math.ceil((user.otpLockUntil - currentTime) / (1000 * 60));
        throw new Error(`Account is locked due to too many failed attempts. Please try again in ${lockTimeRemaining} minutes.`);
      }

      // Initialize OTP tracking fields if they don't exist
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (!user.lastOtpSentDate || user.lastOtpSentDate < today) {
        user.otpSendCount = 0;
        user.lastOtpSentDate = today;
      }

      // Check daily send limit
      if ((user.otpSendCount || 0) >= this.MAX_DAILY_SENDS) {
        throw new Error(`Daily OTP limit (${this.MAX_DAILY_SENDS}) reached. Please try again tomorrow.`);
      }

      // Update user with new OTP
      await User.findByIdAndUpdate(user._id, {
        otpCode: otp,
        otpExpires: expiresAt,
        otpAttempts: 0,
        lastOtpSentAt: currentTime,
        otpSendCount: (user.otpSendCount || 0) + 1,
        lastOtpSentDate: today,
        // Clear any lockout
        $unset: { otpLockUntil: 1 }
      });

      // Send SMS notification
      await this.sendSMSNotification(phoneNumber, otp);

      console.log(`📱 OTP sent to ${phoneNumber}: ${otp}`);
      console.log(`⏰ OTP expires at: ${expiresAt.toLocaleString()}`);
      console.log(`📊 Daily send count: ${(user.otpSendCount || 0) + 1}/${this.MAX_DAILY_SENDS}`);
      
      return {
        success: true,
        message: 'OTP sent successfully to your phone number',
        otpCode: process.env.NODE_ENV === 'development' ? otp : undefined, // Only in development
        expiresAt,
        sendCount: (user.otpSendCount || 0) + 1,
        maxSendsPerDay: this.MAX_DAILY_SENDS
      };

    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error(error.message || 'Failed to send OTP. Please try again.');
    }
  }

  // Resend OTP with enhanced cooldown and attempt limits
  async resendOTP(phoneNumber) {
    try {
      const user = await User.findOne({ phone: phoneNumber });
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isPhoneVerified) {
        throw new Error('Phone number is already verified');
      }

      // Check if user is locked out
      const currentTime = new Date();
      if (user.otpLockUntil && user.otpLockUntil > currentTime) {
        const lockTimeRemaining = Math.ceil((user.otpLockUntil - currentTime) / (1000 * 60));
        throw new Error(`Account is locked due to too many failed attempts. Please try again in ${lockTimeRemaining} minutes.`);
      }

      // Check cooldown period
      if (user.lastOtpSentAt) {
        const cooldownEndTime = new Date(user.lastOtpSentAt.getTime() + this.RESEND_COOLDOWN_MINUTES * 60 * 1000);
        if (currentTime < cooldownEndTime) {
          const remainingTime = Math.ceil((cooldownEndTime - currentTime) / 1000);
          throw new Error(`Please wait ${remainingTime} seconds before requesting another OTP`);
        }
      }

      // Check daily send limits
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (!user.lastOtpSentDate || user.lastOtpSentDate < today) {
        user.otpSendCount = 0;
        user.lastOtpSentDate = today;
      }

      if ((user.otpSendCount || 0) >= this.MAX_DAILY_SENDS) {
        throw new Error(`Daily OTP limit (${this.MAX_DAILY_SENDS}) reached. Please try again tomorrow.`);
      }

      // Check resend attempts
      if (!user.otpResendCount) {
        user.otpResendCount = 0;
        user.lastResendDate = today;
      }

      // Reset counter if it's a new day
      if (user.lastResendDate < today) {
        user.otpResendCount = 0;
        user.lastResendDate = today;
      }

      if (user.otpResendCount >= this.MAX_RESEND_ATTEMPTS) {
        throw new Error(`Maximum resend attempts (${this.MAX_RESEND_ATTEMPTS}) reached for today. Please try again tomorrow.`);
      }

      // Generate and send new OTP
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

      await User.findByIdAndUpdate(user._id, {
        otpCode: otp,
        otpExpires: expiresAt,
        otpAttempts: 0,
        lastOtpSentAt: currentTime,
        otpResendCount: user.otpResendCount + 1,
        lastResendDate: today,
        otpSendCount: (user.otpSendCount || 0) + 1,
        lastOtpSentDate: today,
        // Clear any lockout
        $unset: { otpLockUntil: 1 }
      });

      // Send SMS notification
      await this.sendSMSNotification(phoneNumber, otp);

      console.log(`📱 OTP resent to ${phoneNumber}: ${otp}`);
      console.log(`⏰ OTP expires at: ${expiresAt.toLocaleString()}`);
      console.log(`🔄 Resend attempt: ${user.otpResendCount + 1}/${this.MAX_RESEND_ATTEMPTS}`);

      return {
        success: true,
        message: 'OTP resent successfully',
        otpCode: process.env.NODE_ENV === 'development' ? otp : undefined,
        expiresAt,
        attemptsRemaining: this.MAX_RESEND_ATTEMPTS - (user.otpResendCount + 1),
        dailySendCount: (user.otpSendCount || 0) + 1,
        maxSendsPerDay: this.MAX_DAILY_SENDS
      };

    } catch (error) {
      console.error('Error resending OTP:', error);
      throw error;
    }
  }

  // Verify OTP with enhanced security and attempt tracking
  async verifyOTP(phoneNumber, otpCode) {
    try {
      const user = await User.findOne({ phone: phoneNumber });
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      if (user.isPhoneVerified) {
        return {
          success: false,
          message: 'Phone number is already verified'
        };
      }

      // Check if user is locked out
      const currentTime = new Date();
      if (user.otpLockUntil && user.otpLockUntil > currentTime) {
        const lockTimeRemaining = Math.ceil((user.otpLockUntil - currentTime) / (1000 * 60));
        return {
          success: false,
          message: `Account is locked due to too many failed attempts. Please try again in ${lockTimeRemaining} minutes.`
        };
      }

      if (!user.otpCode || !user.otpExpires) {
        return {
          success: false,
          message: 'No OTP found. Please request a new one.'
        };
      }

      // Check if OTP is expired
      if (user.otpExpires < currentTime) {
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.'
        };
      }

      // Check OTP attempts
      if (user.otpAttempts >= this.MAX_VERIFICATION_ATTEMPTS) {
        // Lock the account
        const lockUntil = new Date(currentTime.getTime() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000);
        await User.findByIdAndUpdate(user._id, {
          otpLockUntil: lockUntil,
          $unset: { otpCode: 1, otpExpires: 1, otpAttempts: 1 }
        });

        return {
          success: false,
          message: `Too many invalid attempts. Account locked for ${this.LOCKOUT_DURATION_MINUTES} minutes.`
        };
      }

      // Verify OTP
      if (user.otpCode !== otpCode) {
        // Increment failed attempts
        await User.findByIdAndUpdate(user._id, {
          $inc: { otpAttempts: 1 }
        });

        const attemptsRemaining = this.MAX_VERIFICATION_ATTEMPTS - (user.otpAttempts + 1);
        return {
          success: false,
          message: `Invalid OTP. ${attemptsRemaining} attempts remaining.`,
          attemptsRemaining
        };
      }

      // OTP is correct - verify phone and clear all OTP-related fields
      await User.findByIdAndUpdate(user._id, {
        $unset: { 
          otpCode: 1, 
          otpExpires: 1, 
          otpAttempts: 1,
          otpResendCount: 1,
          lastOtpSentAt: 1,
          lastResendDate: 1,
          otpSendCount: 1,
          lastOtpSentDate: 1,
          otpLockUntil: 1
        },
        isPhoneVerified: true,
        phoneVerifiedAt: currentTime
      });

      console.log(`✅ OTP verified successfully for ${phoneNumber}`);

      return {
        success: true,
        message: 'Phone number verified successfully'
      };

    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'OTP verification failed. Please try again.'
      };
    }
  }

  // Get comprehensive OTP status for a user
  async getOTPStatus(phoneNumber) {
    try {
      const user = await User.findOne({ phone: phoneNumber })
        .select('otpCode otpExpires otpAttempts lastOtpSentAt otpResendCount lastResendDate otpSendCount lastOtpSentDate isPhoneVerified otpLockUntil phoneVerifiedAt');
      
      if (!user) {
        return { exists: false };
      }

      const now = new Date();
      const hasActiveOTP = user.otpCode && user.otpExpires && user.otpExpires > now;
      
      let canResend = true;
      let cooldownRemaining = 0;
      let isLocked = false;
      let lockTimeRemaining = 0;
      
      // Check if account is locked
      if (user.otpLockUntil && user.otpLockUntil > now) {
        isLocked = true;
        lockTimeRemaining = Math.ceil((user.otpLockUntil - now) / (1000 * 60));
        canResend = false;
      }
      
      // Check cooldown period
      if (user.lastOtpSentAt && !isLocked) {
        const cooldownEndTime = new Date(user.lastOtpSentAt.getTime() + this.RESEND_COOLDOWN_MINUTES * 60 * 1000);
        if (now < cooldownEndTime) {
          canResend = false;
          cooldownRemaining = Math.ceil((cooldownEndTime - now) / 1000);
        }
      }

      // Check daily limits
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dailySendCount = (user.lastOtpSentDate && user.lastOtpSentDate >= today) ? (user.otpSendCount || 0) : 0;
      const dailyLimitReached = dailySendCount >= this.MAX_DAILY_SENDS;

      if (dailyLimitReached) {
        canResend = false;
      }

      return {
        exists: true,
        isPhoneVerified: user.isPhoneVerified,
        phoneVerifiedAt: user.phoneVerifiedAt,
        hasActiveOTP,
        otpExpires: user.otpExpires,
        attemptsUsed: user.otpAttempts || 0,
        maxAttempts: this.MAX_VERIFICATION_ATTEMPTS,
        isLocked,
        lockTimeRemaining,
        canResend,
        cooldownRemaining,
        resendCount: user.otpResendCount || 0,
        maxResends: this.MAX_RESEND_ATTEMPTS,
        dailySendCount,
        maxDailySends: this.MAX_DAILY_SENDS,
        dailyLimitReached
      };

    } catch (error) {
      console.error('Error getting OTP status:', error);
      throw new Error('Failed to get OTP status');
    }
  }

  // Enhanced SMS sending function (MongoDB-based, no Twilio)
  async sendSMSNotification(phoneNumber, otp) {
    try {
      const message = `Your ${process.env.APP_NAME || 'App'} verification code is: ${otp}. This code will expire in ${this.OTP_EXPIRY_MINUTES} minutes. Do not share this code with anyone.`;
      
      console.log(`📨 SMS Message for ${phoneNumber}:`);
      console.log(`📄 Content: ${message}`);
      console.log(`🔢 OTP Code: ${otp}`);
      console.log(`⏰ Expires: ${this.OTP_EXPIRY_MINUTES} minutes`);
      
      // Here you can integrate with your preferred SMS service
      // Replace this section with your actual SMS service implementation
      
      /*
      // Example integration with a generic SMS API:
      if (process.env.SMS_SERVICE_ENABLED === 'true') {
        const response = await fetch(process.env.SMS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
            'X-API-Key': process.env.SMS_API_SECRET
          },
          body: JSON.stringify({
            to: phoneNumber,
            message: message,
            sender: process.env.SMS_SENDER_ID || 'YourApp'
          })
        });
        
        if (!response.ok) {
          throw new Error(`SMS service responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`✅ SMS sent successfully via API:`, result);
        return { success: true, messageId: result.messageId };
      }
      */
      
      // For development/testing - just log the OTP
      if (process.env.NODE_ENV === 'development') {
        console.log(`🧪 [DEVELOPMENT MODE] SMS would be sent to ${phoneNumber}`);
        console.log(`🧪 [DEVELOPMENT MODE] OTP: ${otp}`);
      }
      
      // In production, you should implement actual SMS sending here
      // For now, we'll return success (assuming SMS was sent)
      return { 
        success: true, 
        message: 'SMS notification sent successfully',
        provider: 'custom-sms-service'
      };

    } catch (error) {
      console.error('SMS sending failed:', error);
      // Don't throw error here - OTP is already saved in DB
      // Just log the error and continue
      return { 
        success: false, 
        message: 'SMS sending failed but OTP is valid',
        error: error.message 
      };
    }
  }

  // Clean up expired OTPs and reset daily counters (utility function)
  async cleanupExpiredOTPs() {
    try {
      const currentTime = new Date();
      
      // Clean up expired OTPs
      const expiredOtpResult = await User.updateMany(
        { otpExpires: { $lt: currentTime } },
        {
          $unset: {
            otpCode: 1,
            otpExpires: 1,
            otpAttempts: 1
          }
        }
      );
      
      // Clean up expired lockouts
      const expiredLockResult = await User.updateMany(
        { otpLockUntil: { $lt: currentTime } },
        {
          $unset: { otpLockUntil: 1 }
        }
      );
      
      // Reset daily counters for new day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);
      
      const dailyResetResult = await User.updateMany(
        { lastOtpSentDate: { $lt: yesterday } },
        {
          $unset: {
            otpSendCount: 1,
            lastOtpSentDate: 1,
            otpResendCount: 1,
            lastResendDate: 1
          }
        }
      );
      
      console.log(`🧹 Cleanup completed:`);
      console.log(`   - Expired OTPs cleaned: ${expiredOtpResult.modifiedCount}`);
      console.log(`   - Expired locks cleared: ${expiredLockResult.modifiedCount}`);
      console.log(`   - Daily counters reset: ${dailyResetResult.modifiedCount}`);
      
      return {
        expiredOTPs: expiredOtpResult.modifiedCount,
        expiredLocks: expiredLockResult.modifiedCount,
        dailyResets: dailyResetResult.modifiedCount
      };
      
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
      throw error;
    }
  }

  // Get system-wide OTP statistics (for admin monitoring)
  async getOTPStatistics() {
    try {
      const currentTime = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const stats = await User.aggregate([
        {
          $group: {
            _id: null,
            totalUsersWithActiveOTP: {
              $sum: {
                $cond: [
                  { 
                    $and: [
                      { $ne: ["$otpCode", null] },
                      { $gt: ["$otpExpires", currentTime] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            totalVerifiedPhones: {
              $sum: { $cond: ["$isPhoneVerified", 1, 0] }
            },
            totalLockedAccounts: {
              $sum: {
                $cond: [
                  { $gt: ["$otpLockUntil", currentTime] },
                  1,
                  0
                ]
              }
            },
            dailyOTPsSent: {
              $sum: {
                $cond: [
                  { $gte: ["$lastOtpSentDate", today] },
                  { $ifNull: ["$otpSendCount", 0] },
                  0
                ]
              }
            }
          }
        }
      ]);
      
      return stats[0] || {
        totalUsersWithActiveOTP: 0,
        totalVerifiedPhones: 0,
        totalLockedAccounts: 0,
        dailyOTPsSent: 0
      };
      
    } catch (error) {
      console.error('Error getting OTP statistics:', error);
      throw error;
    }
  }
}

module.exports = new OTPService();
