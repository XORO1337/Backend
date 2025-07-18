import React, { useState } from 'react';
import { ChefHat, Package, Leaf, Eye, EyeOff, Phone, Lock, Users, Heart, Sprout, ShoppingCart, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('artisan');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
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
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login({
        phone: `+91${formData.phone}`, // Add +91 prefix for backend
        password: formData.password
      });
      
      if (result.success) {
        // Redirect based on user role
        const userRole = result.data.user.role;
        if (userRole === 'artisan') {
          navigate('/artisan-dashboard');
        } else if (userRole === 'distributor') {
          navigate('/distributor-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin(selectedRole);
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-2xl"></div>
      
      <div className="text-center mb-5 relative z-10">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h2>
        <p className="text-gray-600 text-sm flex items-center justify-center space-x-1">
          <Users className="w-3.5 h-3.5 text-emerald-500" />
          <span>Continue your journey</span>
          <Leaf className="w-3.5 h-3.5 text-teal-500" />
        </p>
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto pr-1">
        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          <div>
            <div className="relative mb-3">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm font-medium">
                +91
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="9876543210"
                className="w-full pl-16 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all duration-200"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/90 text-sm"
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
          </div>

          <div>
           <label className="block text-xs font-medium text-gray-700 mb-2">
  <div className="flex items-center space-x-1">
    <Users className="w-3 h-3 text-emerald-600" />
    <span>I am a:</span>
  </div>
</label>


            <div className="grid grid-cols-3 gap-2">
              {/* Artisian Button */}
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                  rememberMe 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {rememberMe && <Check className="w-2.5 h-2.5 text-white absolute top-0.5 left-0.5" />}
                </div>
              </div>
              <span className="ml-2 text-gray-600 text-xs">Remember me</span>
            </label>
            <button type="button" className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">
              Forgot password?
            </button>
          </div>
        </form>
      </div>

      <div className="relative z-10 mt-4 space-y-3">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span>Continue Journey</span>
                <Leaf className="w-4 h-4" />
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
            onClick={handleGoogleLogin}
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
            Ready to join our community?
            <button
              type="button"
              onClick={onToggleMode}
              className="ml-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
