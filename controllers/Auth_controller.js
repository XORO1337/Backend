const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const otpService = require('../services/otpService');
const passport = require('../config/passport');
const ArtisanService = require('../services/Artisan_serv');
const DistributorService = require('../services/Distributor_serv');

class AuthController {
  // Register with phone number
  static async registerWithPhone(req, res) {
    try {
      const { name, phone, password, role, ...profileData } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this phone number already exists'
        });
      }

      // Create user
      const user = new User({
        name,
        phone,
        password,
        role: role || 'customer',
        authProvider: 'local'
      });

      await user.save();

      let profileResponse = null;

      // Create role-specific profile if user is artisan or distributor
      try {
        if (role === 'artisan') {
          // Create artisan profile with user reference
          const artisanProfileData = {
            userId: user._id,
            bio: profileData.bio || '',
            region: profileData.region || '',
            skills: profileData.skills || [],
            bankDetails: profileData.bankDetails || {}
          };
          
          profileResponse = await ArtisanService.createArtisanProfile(artisanProfileData);
          console.log('✅ Artisan profile created successfully:', profileResponse._id);
          
        } else if (role === 'distributor') {
          // Create distributor profile with user reference
          const distributorProfileData = {
            userId: user._id,
            businessName: profileData.businessName || '',
            licenseNumber: profileData.licenseNumber || '',
            distributionAreas: profileData.distributionAreas || []
          };
          
          profileResponse = await DistributorService.createDistributorProfile(distributorProfileData);
          console.log('✅ Distributor profile created successfully:', profileResponse._id);
        }
      } catch (profileError) {
        console.error('Profile creation failed:', profileError);
        // If profile creation fails, we should clean up the user record
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          success: false,
          message: `Failed to create ${role} profile: ${profileError.message}`
        });
      }

      // Send OTP for phone verification
      try {
        await otpService.sendOTP(phone);
      } catch (otpError) {
        console.error('OTP sending failed:', otpError);
        // Continue with registration even if OTP fails
      }

      // Prepare response data
      const responseData = {
        userId: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified
      };

      // Add profile information to response if created
      if (profileResponse) {
        responseData.profileId = profileResponse._id;
        responseData.profileCreated = true;
      }

      res.status(201).json({
        success: true,
        message: `${role === 'customer' ? 'User' : role.charAt(0).toUpperCase() + role.slice(1)} registered successfully. Please verify your phone number.`,
        data: responseData
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  // Login with phone number or email
  static async login(req, res) {
    try {
      const { phone, email, password } = req.body;

      // Find user by phone or email
      const query = phone ? { phone } : { email };
      const user = await User.findOne(query);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await user.incLoginAttempts();
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }

      // Generate tokens
      const accessToken = generateAccessToken({ userId: user._id, role: user.role });
      const refreshToken = generateRefreshToken({ userId: user._id });

      // Store refresh token
      user.refreshTokens.push({ token: refreshToken });
      user.lastLogin = new Date();
      await user.save();

      // Set HTTP-only cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict'
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            isIdentityVerified: user.isIdentityVerified
          },
          accessToken
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }

  // Google OAuth login initiation
  static initiateGoogleAuth(req, res, next) {
    // Store role in session if provided
    const { role } = req.query;
    console.log('🚀 Initiating Google OAuth with role:', role);
    
    if (role && ['artisan', 'distributor', 'customer'].includes(role)) {
      req.session.pendingRole = role;
      console.log('🏷️ Stored pending role in session:', req.session.pendingRole);
    }
    
    console.log('📝 Current session:', req.session);
    
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })(req, res, next);
  }

  // Google OAuth callback
  static async handleGoogleCallback(req, res, next) {
    passport.authenticate('google', { session: false }, async (err, user, info) => {
      console.log('🔍 Google OAuth callback initiated');
      console.log('📝 Session data:', req.session);
      console.log('👤 User from passport:', user ? 'Found' : 'Not found');
      console.log('❌ Error from passport:', err);
      
      if (err) {
        console.error('🚨 OAuth authentication error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed&details=${encodeURIComponent(err.message)}`);
      }

      if (!user) {
        console.error('🚨 OAuth denied or user not found');
        return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_denied`);
      }

      try {
        console.log('🔄 Processing OAuth callback for user:', user.email);
        
        // Check if this is a new user and if role was specified
        const pendingRole = req.session?.pendingRole;
        let profileResponse = null;
        
        console.log('🏷️ Pending role from session:', pendingRole);
        console.log('🆕 Is new user:', !!user._isNewUser);

        // If user is new and has a role other than customer, create role-specific profile
        if (user._isNewUser && pendingRole && ['artisan', 'distributor'].includes(pendingRole)) {
          console.log(`📋 Creating ${pendingRole} profile for new Google user`);
          
          // Update user role
          user.role = pendingRole;
          await user.save();
          console.log('✅ User role updated to:', user.role);

          // Create role-specific profile
          try {
            if (pendingRole === 'artisan') {
              const artisanProfileData = {
                userId: user._id,
                bio: '',
                region: '',
                skills: [],
                bankDetails: {}
              };
              
              profileResponse = await ArtisanService.createArtisanProfile(artisanProfileData);
              console.log('✅ Artisan profile created for Google OAuth user:', profileResponse._id);
              
            } else if (pendingRole === 'distributor') {
              const distributorProfileData = {
                userId: user._id,
                businessName: user.name + ' Business', // Default business name
                licenseNumber: '',
                distributionAreas: []
              };
              
              profileResponse = await DistributorService.createDistributorProfile(distributorProfileData);
              console.log('✅ Distributor profile created for Google OAuth user:', profileResponse._id);
            }
          } catch (profileError) {
            console.error('❌ Profile creation failed for Google OAuth:', profileError);
            // Continue with auth even if profile creation fails
          }
        }

        // Clear pending role from session
        if (req.session?.pendingRole) {
          console.log('🧹 Clearing pending role from session');
          delete req.session.pendingRole;
        }

        // Generate tokens
        const accessToken = generateAccessToken({ userId: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ userId: user._id });

        // Store refresh token
        user.refreshTokens.push({ token: refreshToken });
        await user.save();

        // Set HTTP-only cookie for refresh token
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: 'strict'
        });

        // Redirect based on role
        let redirectUrl = `${process.env.CLIENT_URL}/`;
        if (user.role === 'artisan' || user.role === 'distributor') {
          redirectUrl = `${process.env.CLIENT_URL}/dashboard${profileResponse ? '?profile_created=true' : ''}`;
        }
        
        console.log('🚀 Redirecting to:', redirectUrl);
        res.redirect(`${redirectUrl}?token=${accessToken}`);

      } catch (error) {
        console.error('🚨 Google OAuth callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed&details=${encodeURIComponent(error.message)}`);
      }
    })(req, res, next);
  }

  // Complete profile setup for Google OAuth users
  static async completeGoogleProfile(req, res) {
    try {
      const { role, profileData } = req.body;
      const userId = req.user.userId;

      // Verify user exists and is authenticated via Google
      const user = await User.findById(userId);
      if (!user || user.authProvider !== 'google') {
        return res.status(404).json({
          success: false,
          message: 'User not found or not a Google OAuth user'
        });
      }

      // Update user role if it's being changed from customer
      if (role && ['artisan', 'distributor'].includes(role) && user.role === 'customer') {
        user.role = role;
        await user.save();

        let profileResponse = null;

        // Create role-specific profile
        try {
          if (role === 'artisan') {
            const artisanProfileData = {
              userId: user._id,
              bio: profileData?.bio || '',
              region: profileData?.region || '',
              skills: profileData?.skills || [],
              bankDetails: profileData?.bankDetails || {}
            };
            
            profileResponse = await ArtisanService.createArtisanProfile(artisanProfileData);
            console.log('✅ Artisan profile created for Google user:', profileResponse._id);
            
          } else if (role === 'distributor') {
            const distributorProfileData = {
              userId: user._id,
              businessName: profileData?.businessName || user.name + ' Business',
              licenseNumber: profileData?.licenseNumber || '',
              distributionAreas: profileData?.distributionAreas || []
            };
            
            profileResponse = await DistributorService.createDistributorProfile(distributorProfileData);
            console.log('✅ Distributor profile created for Google user:', profileResponse._id);
          }
        } catch (profileError) {
          console.error('Profile creation failed:', profileError);
          return res.status(400).json({
            success: false,
            message: `Failed to create ${role} profile: ${profileError.message}`
          });
        }

        // Generate new tokens with updated role
        const accessToken = generateAccessToken({ userId: user._id, role: user.role });

        const responseData = {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileId: profileResponse?._id,
          profileCreated: !!profileResponse
        };

        res.json({
          success: true,
          message: `${role.charAt(0).toUpperCase() + role.slice(1)} profile created successfully`,
          data: responseData,
          accessToken
        });

      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid role or user already has a non-customer role'
        });
      }

    } catch (error) {
      console.error('Complete Google profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete profile setup'
      });
    }
  }

  // Send OTP for phone verification
  static async sendOTP(req, res) {
    try {
      const { phone } = req.body;

      // Check if user exists
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.isPhoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is already verified'
        });
      }

      await otpService.sendOTP(phone);

      res.json({
        success: true,
        message: 'OTP sent successfully'
      });

    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }
  }

  // Verify OTP
  static async verifyOTP(req, res) {
    try {
      const { phone, otp } = req.body;

      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.isPhoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is already verified'
        });
      }

      const verification = await otpService.verifyOTP(phone, otp);

      if (verification.success) {
        user.isPhoneVerified = true;
        await user.save();

        res.json({
          success: true,
          message: 'Phone number verified successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'OTP verification failed'
      });
    }
  }

  // Refresh access token
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token not provided'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Find user and check if refresh token exists
      const user = await User.findById(decoded.userId);
      if (!user || !user.refreshTokens.find(token => token.token === refreshToken)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Generate new access token
      const newAccessToken = generateAccessToken({ userId: user._id, role: user.role });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken
        }
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  // Logout
  static async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const userId = req.user?.id;

      if (userId && refreshToken) {
        // Remove refresh token from database
        await User.findByIdAndUpdate(userId, {
          $pull: { refreshTokens: { token: refreshToken } }
        });
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Logout from all devices
  static async logoutAll(req, res) {
    try {
      const userId = req.user.id;

      // Clear all refresh tokens
      await User.findByIdAndUpdate(userId, {
        refreshTokens: []
      });

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logged out from all devices successfully'
      });

    } catch (error) {
      console.error('Logout all error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const user = req.user;

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isIdentityVerified: user.isIdentityVerified,
          verificationDocuments: user.verificationDocuments,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile'
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      
      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Clear all refresh tokens to force re-login
      user.refreshTokens = [];
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully. Please log in again.'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }

  
}

module.exports = AuthController;
