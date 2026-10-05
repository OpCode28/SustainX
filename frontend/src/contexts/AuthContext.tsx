import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType } from '../types';
import { DEMO_USERS } from '../data/demoData';

interface AuthContextType {
  currentUser: User | null;
  currentRole: RoleType;
  isAuthenticated: boolean;
  login: (email: string, role?: RoleType) => boolean;
  logout: () => void;
  switchRole: (role: RoleType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to GROUP_SUSTAINABILITY for immediate rich executive dashboard view
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('meil_auth_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.GROUP_SUSTAINABILITY;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('meil_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('meil_auth_user');
    }
  }, [currentUser]);

  const login = (email: string, role: RoleType = 'GROUP_SUSTAINABILITY'): boolean => {
    const matchedUser = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase()) || DEMO_USERS[role];
    setCurrentUser(matchedUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: RoleType) => {
    if (DEMO_USERS[role]) {
      setCurrentUser(DEMO_USERS[role]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.roleId || 'SITE_USER',
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole,
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
