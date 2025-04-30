// client/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      setLoading(true);
      if (token) {
        setAuthToken(token);
        const res = await axios.get('/api/auth/me');
        setUser(res.data.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthToken(null);
      setError(err.response?.data?.error || 'Error loading user');
    }
    setLoading(false);
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/register', userData);
      setToken(res.data.token);
      await loadUser();
      toast.success('Registration successful!');
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error registering user');
      toast.error(err.response?.data?.error || 'Error registering user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      await loadUser();
      toast.success('Login successful!');
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
      toast.error(err.response?.data?.error || 'Invalid credentials');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthToken(null);
      toast.success('Logged out successfully');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.put('/api/auth/updatedetails', userData);
      setUser(res.data.data);
      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating profile');
      toast.error(err.response?.data?.error || 'Error updating profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      await axios.put('/api/auth/updatepassword', passwordData);
      toast.success('Password updated successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating password');
      toast.error(err.response?.data?.error || 'Error updating password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/forgotpassword', { email });
      toast.success(res.data.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error processing request');
      toast.error(err.response?.data?.error || 'Error processing request');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (password, resetToken) => {
    try {
      setLoading(true);
      await axios.put(`/api/auth/resetpassword/${resetToken}`, { password });
      toast.success('Password has been reset, you can now login');
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error resetting password');
      toast.error(err.response?.data?.error || 'Error resetting password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if token is expired
  const isTokenExpired = () => {
    if (!token) return true;
    
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        // Token is expired
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Token decode error', err);
      return true;
    }
  };

  // Effect to load user when token changes
  useEffect(() => {
    if (token && !isTokenExpired()) {
      loadUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
