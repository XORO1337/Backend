import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'artisan' | 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('artisan_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      // Simulate API call - replace with your actual authentication logic
      if (email && password && role === 'artisan') {
        const userData: User = {
          id: '1',
          name: email.split('@')[0], // Use email prefix as name for demo
          email,
          role: 'artisan'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('artisan_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    try {
      // Simulate API call - replace with your actual registration logic
      if (name && email && password && role === 'artisan') {
        const userData: User = {
          id: Date.now().toString(),
          name,
          email,
          role: 'artisan'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('artisan_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('artisan_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};