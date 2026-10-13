import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, RoleType } from '../types';
import { DEMO_USERS } from '../data/demoData';
import { getDeviceDetails } from '../utils/device';

export interface ActiveDevice {
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrentDevice?: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  isDeviceLimitExceeded?: boolean;
  activeDevices?: ActiveDevice[];
}

interface AuthContextType {
  currentUser: User | null;
  currentRole: RoleType;
  isAuthenticated: boolean;
  token: string | null;
  currentDeviceId: string;
  currentDeviceName: string;
  activeDevices: ActiveDevice[];
  sessionRevokedNotice: string | null;
  clearSessionNotice: () => void;
  login: (
    email: string, 
    password?: string, 
    forceTerminateOlderDevice?: boolean, 
    terminateDeviceId?: string
  ) => Promise<LoginResult>;
  logout: () => void;
  terminateSession: () => Promise<void>;
  terminateDevice: (targetDeviceId: string) => Promise<{ success: boolean; message?: string }>;
  refreshActiveDevices: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  switchPersona: (roleKey: string) => void;
}

const API_BASE = '/api/v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceId: currentDeviceId, deviceName: currentDeviceName } = getDeviceDetails();

  // Distinct device session state - defaults to null so each device on the Wi-Fi logs in independently
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('meil_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('meil_auth_token');
  });

  const [activeDevices, setActiveDevices] = useState<ActiveDevice[]>([]);
  const [sessionRevokedNotice, setSessionRevokedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('meil_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('meil_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('meil_auth_token', token);
    } else {
      localStorage.removeItem('meil_auth_token');
    }
  }, [token]);

  const clearSessionNotice = () => setSessionRevokedNotice(null);

  const refreshActiveDevices = useCallback(async () => {
    if (!currentUser?.email) return;
    try {
      const res = await fetch(
        `${API_BASE}/auth/active-devices?email=${encodeURIComponent(currentUser.email)}&deviceId=${encodeURIComponent(currentDeviceId)}`
      );
      if (res.ok) {
        const data = await res.json();
        setActiveDevices(data.activeDevices || []);
      }
    } catch (e) {
      console.warn('Could not fetch active devices:', e);
    }
  }, [currentUser?.email, currentDeviceId]);

  // Periodic session heartbeat (checks if this device session was revoked/evicted by another device)
  useEffect(() => {
    if (!currentUser?.email || !token || token === 'sx_local_demo_token') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/auth/validate-session?email=${encodeURIComponent(currentUser.email)}&token=${encodeURIComponent(token)}&deviceId=${encodeURIComponent(currentDeviceId)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.valid === false && data.reason === 'DEVICE_SESSION_TERMINATED') {
            // Only evicted if explicitly terminated by an administrator or concurrent limit
            setSessionRevokedNotice('Your session was terminated because this account was logged out from another device.');
            logout();
          }
        }
      } catch (err) {
        // Offline or server restarted
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [currentUser?.email, token, currentDeviceId]);

  const login = async (
    email: string, 
    password: string = 'Meil@2026',
    forceTerminateOlderDevice: boolean = false,
    terminateDeviceId?: string
  ): Promise<LoginResult> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          password,
          deviceId: currentDeviceId,
          deviceName: currentDeviceName,
          forceTerminateOlderDevice,
          terminateDeviceId
        }),
      });

      const data = await res.json();

      if (res.status === 403 && data.code === 'DEVICE_LIMIT_EXCEEDED') {
        return {
          success: false,
          isDeviceLimitExceeded: true,
          activeDevices: data.activeDevices || [],
          error: data.message,
        };
      }

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || data.message || 'Authentication failed' };
      }

      setCurrentUser(data.user);
      setToken(data.token);
      setSessionRevokedNotice(null);
      return { success: true };
    } catch (err) {
      console.warn('Backend API login offline, matching demo users:', err);
      const matched = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setCurrentUser(matched);
        setToken('sx_local_demo_token');
        return { success: true };
      }
      return { success: false, error: 'Cannot connect to authentication server. Please check backend.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setActiveDevices([]);
    localStorage.removeItem('meil_auth_user');
    localStorage.removeItem('meil_auth_token');
  };

  const terminateSession = async () => {
    try {
      if (currentUser?.email) {
        await fetch(`${API_BASE}/auth/terminate-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userEmail: currentUser.email,
            deviceId: currentDeviceId 
          }),
        });
      }
    } catch (e) {
      console.warn('Failed to notify backend of session termination:', e);
    } finally {
      logout();
    }
  };

  const terminateDevice = async (targetDeviceId: string): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser?.email) return { success: false, message: 'Not authenticated' };
    try {
      const res = await fetch(`${API_BASE}/auth/terminate-device-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: currentUser.email,
          targetDeviceId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (targetDeviceId === currentDeviceId) {
          logout();
        } else {
          await refreshActiveDevices();
        }
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Failed to terminate device session' };
    } catch (err) {
      return { success: false, message: 'Network error connecting to auth server' };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    if (!currentUser?.email) {
      return { success: false, error: 'No active session found.' };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: currentUser.email,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to change password' };
      }

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: 'Authentication server unreachable.' };
    }
  };

  const switchPersona = (roleKeyOrEmail: string) => {
    let user: User | undefined = DEMO_USERS[roleKeyOrEmail];
    if (!user) {
      user = Object.values(DEMO_USERS).find(u => u.email === roleKeyOrEmail || u.roleId === roleKeyOrEmail);
    }
    if (user) {
      setCurrentUser(user);
      setToken('sx_local_demo_token');
      localStorage.setItem('meil_auth_user', JSON.stringify(user));
      localStorage.setItem('meil_auth_token', 'sx_local_demo_token');
      setSessionRevokedNotice(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.roleId || 'SITE_USER',
        isAuthenticated: !!currentUser,
        token,
        currentDeviceId,
        currentDeviceName,
        activeDevices,
        sessionRevokedNotice,
        clearSessionNotice,
        login,
        logout,
        terminateSession,
        terminateDevice,
        refreshActiveDevices,
        changePassword,
        switchPersona,
      }}
    >
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
