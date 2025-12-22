import { createContext, useContext } from 'react';

// --- Type Definitions ---
// This is the "Generic" User type your app will use everywhere.
export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  token: string;
}

// The generic interface your components will use.
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  token: string | undefined;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// --- The Hook (Usage) ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AppAuthProvider');
  }
  return context;
};
