import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { getToken, getStoredUser, removeToken } from '../utils/token';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true);
  const [textSize, setTextSize] = useState(() => localStorage.getItem('mediexplain_text_size') || 'normal');

  useEffect(() => {
    const initAuth = async () => {
      const currentToken = getToken();
      if (currentToken) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          console.warn('Session expired or invalid token');
          removeToken();
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize);
    localStorage.setItem('mediexplain_text_size', textSize);
  }, [textSize]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        textSize,
        setTextSize,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
