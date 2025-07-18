import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, tokenUtils } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = tokenUtils.getToken();
        if (token) {
          const response = await authAPI.getProfile();
          if (response.success) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            tokenUtils.removeToken();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        tokenUtils.removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        tokenUtils.saveToken(response.data.accessToken);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        // Don't auto-login after registration, user needs to verify phone
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const googleLogin = (role = 'customer') => {
    authAPI.googleLogin(role);
  };

  // Complete Google profile
  const completeGoogleProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authAPI.completeGoogleProfile(profileData);
      
      if (response.success) {
        tokenUtils.saveToken(response.data.accessToken);
        // Refresh user profile
        const profileResponse = await authAPI.getProfile();
        if (profileResponse.success) {
          setUser(profileResponse.data);
          setIsAuthenticated(true);
        }
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Complete Google profile failed:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (logoutAll = false) => {
    try {
      if (logoutAll) {
        await authAPI.logoutAll();
      } else {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      tokenUtils.removeToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Send OTP function
  const sendOTP = async (phone) => {
    try {
      const response = await authAPI.sendOTP(phone);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error('Send OTP failed:', error);
      return { success: false, message: error.message };
    }
  };

  // Verify OTP function
  const verifyOTP = async (phone, otp) => {
    try {
      const response = await authAPI.verifyOTP(phone, otp);
      
      if (response.success) {
        // Refresh user profile to get updated verification status
        const profileResponse = await authAPI.getProfile();
        if (profileResponse.success) {
          setUser(profileResponse.data);
        }
      }
      
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error('Verify OTP failed:', error);
      return { success: false, message: error.message };
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error('Change password failed:', error);
      return { success: false, message: error.message };
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setUser(response.data);
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Refresh profile failed:', error);
    }
    return { success: false };
  };

  // Token refresh (automatic)
  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      if (response.success) {
        tokenUtils.saveToken(response.data.accessToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
    return false;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    googleLogin,
    completeGoogleProfile,
    logout,
    sendOTP,
    verifyOTP,
    changePassword,
    refreshProfile,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
