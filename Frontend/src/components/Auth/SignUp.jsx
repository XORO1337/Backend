import React, { useState } from 'react';
import {
  ChefHat, Package, Leaf, Eye, EyeOff,
  Phone, Lock, User, Users, Heart, Sprout, ShoppingCart,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SignUp = ({ onToggleMode }) => {
  const navigate = useNavigate();
  const { register, sendOTP, verifyOTP, googleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('artisan');
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // For phone field, only allow digits and limit to 10 characters
    if (name === 'phone') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear errors when user starts typing
    if (error) setError('');
    if (otpError) setOtpError('');

    // Auto-send OTP when phone number is 10 digits
    if (name === 'phone' && processedValue.length === 10 && !otpSent) {
      handleSendOTP(processedValue);
    }
  };

  const handleSendOTP = async (phoneNumber) => {
    try {
      setIsLoading(true);
      setOtpError('');
      
      // Add +91 prefix for backend
      const formattedPhone = `+91${phoneNumber || formData.phone}`;
      const result = await sendOTP(formattedPhone);
      
      if (result.success) {
        setOtpSent(true);
      } else {
        setOtpError(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      setOtpError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);
      setOtpError('');

      // Add +91 prefix for backend
      const formattedPhone = `+91${formData.phone}`;
      const result = await verifyOTP(formattedPhone, formData.otp);
      
      if (result.success) {
        setIsPhoneVerified(true);
        setOtpError('');
      } else {
        setOtpError(result.message || 'Invalid OTP');
      }
    } catch (error) {
      setOtpError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Basic validation for all fields
    const { name, phone, otp, password, confirmPassword } = formData;
    if (!name || !phone.match(/^[0-9]{10}$/) || !otp.match(/^[0-9]{6}$/) || !password || !confirmPassword) {
      setError('Please fill all fields correctly.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isPhoneVerified) {
      setError('Please verify your phone number first.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const userData = {
        name,
        phone: `+91${phone}`, // Add +91 prefix for backend
        password,
        role: selectedRole
      };

      const result = await register(userData);
      
      if (result.success) {
        // Registration successful, redirect to login
        alert('Registration successful! Please login to continue.');
        onToggleMode();
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    googleLogin(selectedRole);
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-2xl"></div>

      <div className="text-center mb-5 relative z-10">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Join Our Community</h2>
        <p className="text-gray-600 text-sm flex items-center justify-center space-x-1">
          <Sprout className="w-3.5 h-3.5 text-emerald-500" />
          <span>Start making an impact</span>
          <Heart className="w-3.5 h-3.5 text-teal-500" />
        </p>
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto pr-1">
        <form className="space-y-3.5 relative z-10" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white/90 text-sm"
              placeholder="Full name"
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="relative mb-3">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm font-medium">
              +91
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-16 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white/90 text-sm"
              placeholder="9876543210"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
            {formData.phone.length === 10 && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-4 h-4 animate-scale-check" />
            )}
          </div>
          {/* OTP */}
          <div className="relative">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white/90 text-sm"
                  placeholder="Enter OTP"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
                {isPhoneVerified && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-4 h-4 animate-scale-check" />
                )}
              </div>
              {otpSent && !isPhoneVerified && (
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || formData.otp.length !== 6}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${isLoading 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : formData.otp.length === 6
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              )}
            </div>
            {otpError && (
              <p className="text-red-500 text-xs mt-1">{otpError}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white/90 text-sm"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white/90 text-sm"
              placeholder="Confirm password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Role Selector */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Users className="w-3 h-3 text-emerald-600" />
              <span>I am a:</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
              onClick={() => setSelectedRole('artisan')}
              className={`p-2.5 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedRole === 'artisan'
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white/70 hover:bg-white/90'
              }`}
              >
                <ChefHat className="w-4 h-4 mx-auto mb-1" />
                <div className="text-xs font-medium">Artisan</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('distributor')}
                className={`p-2.5 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedRole === 'distributor'
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white/70 hover:bg-white/90'
                }`}
              >
                <Package className="w-4 h-4 mx-auto mb-1" />
                <div className="text-xs font-medium">Distributor</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`p-2.5 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedRole === 'customer'
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white/70 hover:bg-white/90'
                }`}
              >
                <ShoppingCart className="w-4 h-4 mx-auto mb-1" />
                <div className="text-xs font-medium">Customer</div>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="relative z-10 mt-4 space-y-3">
        <button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          disabled={isLoading}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group text-sm ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
          }`}
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <Sprout className="w-4 h-4" />
                <span>Join Community</span>
                <Heart className="w-4 h-4" />
              </>
            )}
          </span>
          {!isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          )}
        </button>

        <div className="text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Already part of our community?
            <button
              type="button"
              onClick={onToggleMode}
              className="ml-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
