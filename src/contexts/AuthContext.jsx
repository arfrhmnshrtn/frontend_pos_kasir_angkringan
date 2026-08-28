import React, { createContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  const initAuth = useCallback(() => {
    try {
      const token = storage.getAccessToken();
      const savedUser = storage.getUser();
      const savedRole = storage.getRole();
      const savedPermissions = storage.getPermissions();

      if (token && savedUser) {
        setUser(savedUser);
        setRole(savedRole);
        setPermissions(savedPermissions || []);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setRole(null);
        setPermissions([]);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error initializing auth context:', err);
      storage.clearAuthData();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Login handler
  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials);
      
      // Support backend data structure format
      const data = res?.data || res;
      const accessToken = data.accessToken || data.token;
      const refreshToken = data.refreshToken;
      const userData = data.user || data.userData;
      const userRole = data.role || userData?.role || credentials.role;
      const userPermissions = data.permissions || userData?.permissions || [];

      if (!accessToken) {
        throw new Error(res?.message || 'Login gagal, token tidak ditemukan');
      }

      // Save to localStorage
      storage.setAuthData({
        accessToken,
        refreshToken,
        user: userData,
        role: userRole,
        permissions: userPermissions,
      });

      // Update state
      setUser(userData);
      setRole(userRole);
      setPermissions(userPermissions);
      setIsAuthenticated(true);

      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: userData,
          role: userRole,
          permissions: userPermissions,
        },
        message: res?.message || 'Login berhasil',
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Login gagal. Periksa PIN atau kredensial Anda.',
        errors: error?.errors || null,
      };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error API:', err);
    } finally {
      storage.clearAuthData();
      setUser(null);
      setRole(null);
      setPermissions([]);
      setIsAuthenticated(false);
    }
  };

  // Refresh token handler
  const refresh = async () => {
    try {
      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');

      const res = await authService.refresh(refreshToken);
      const data = res?.data || res;
      const newAccessToken = data.accessToken || data.token;

      if (newAccessToken) {
        storage.setAccessToken(newAccessToken);
        if (data.refreshToken) {
          storage.setRefreshToken(data.refreshToken);
        }
        return { success: true };
      }
      throw new Error('Refresh failed');
    } catch (error) {
      logout();
      return { success: false, message: error?.message };
    }
  };

  // Change PIN handler
  const changePin = async (data) => {
    try {
      let res;
      const userRoleStr = typeof role === 'string' ? role.toUpperCase() : role?.name?.toUpperCase() || '';
      
      if (userRoleStr === 'OWNER') {
        res = await userService.changeProfilePin({
          oldPin: data.currentPin,
          newPin: data.newPin
        });
      } else {
        res = await authService.changePin(data);
      }
      
      return {
        success: true,
        message: res?.message || 'PIN berhasil diubah',
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Gagal mengubah PIN',
        errors: error?.errors || null,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        permissions,
        isAuthenticated,
        loading,
        login,
        logout,
        refresh,
        changePin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
