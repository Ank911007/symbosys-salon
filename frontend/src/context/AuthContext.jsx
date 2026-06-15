
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null); // 'customer' | 'user'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from local storage on mount
    const storedToken = localStorage.getItem('minta_token');
    const storedUser = localStorage.getItem('minta_user');
    const storedType = localStorage.getItem('minta_user_type');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUserType(storedType || 'user');
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user');
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, authToken, type = 'user') => {
    setUser(userData);
    setToken(authToken);
    setUserType(type);
    localStorage.setItem('minta_token', authToken);
    localStorage.setItem('minta_user', JSON.stringify(userData));
    localStorage.setItem('minta_user_type', type);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserType(null);
    localStorage.removeItem('minta_token');
    localStorage.removeItem('minta_user');
    localStorage.removeItem('minta_user_type');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      userType,
      isAuthenticated: !!token, 
      isCustomer: userType === 'customer',
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
