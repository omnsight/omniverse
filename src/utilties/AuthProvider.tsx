import React, { createContext, useContext, useMemo } from 'react';
import { AuthProvider as OidcProvider, useAuth as useOidcAuth, type AuthProviderProps } from 'react-oidc-context';
import { User } from 'oidc-client-ts';
import { Center, Loader } from '@mantine/core';
import { jwtDecode } from "jwt-decode";

// --- 1. Environment Configuration ---
const CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
const AUTHORITY = `${import.meta.env.VITE_KEYCLOAK_API_URL}/realms/${import.meta.env.VITE_REALM}`;

// --- 2. Type Definitions ---
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
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  token: string | undefined;
}

const AuthContext = createContext<AuthContextType | null>(null);

const parseKeycloakRoles = (user: User | null): string[] => {
  if (!user || !user.access_token) return [];
  
  try {
    const decoded = jwtDecode(user.access_token) as any;
    const resourceAccess = decoded.resource_access;
    const clientRoles = resourceAccess?.[CLIENT_ID]?.roles || [];
    return clientRoles;
  } catch (error) {
    console.error("Failed to decode JWT", error);
    return [];
  }
};

// --- 4. The Internal Adapter (Web Implementation) ---
const AuthAdapter = ({ children }: { children: React.ReactNode }) => {
  const auth = useOidcAuth();

  // MAPPING: Convert OIDC-Context generic user to Your App's User format
  const appUser: AuthUser | null = useMemo(() => {
    if (!auth.user) return null;
    return {
      id: auth.user.profile.sub,
      username: auth.user.profile.preferred_username || '',
      email: auth.user.profile.email,
      firstName: auth.user.profile.given_name,
      lastName: auth.user.profile.family_name,
      roles: parseKeycloakRoles(auth.user),
      token: auth.user.access_token,
    };
  }, [auth.user]);

  const hasRole = (role: string) => {
    return appUser?.roles.includes(role) || false;
  };

  const value: AuthContextType = {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: appUser,
    login: () => auth.signinRedirect(),
    logout: () => auth.signoutRedirect(),
    hasRole,
    token: auth.user?.access_token
  };

  if (auth.isLoading) {
    return (
      <Center h="100%">
        <Loader size="lg" />
      </Center>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 5. The Main Provider Component ---
export const AppAuthProvider = ({ children }: { children: React.ReactNode }) => {

  // OIDC Configuration
  const oidcConfig: AuthProviderProps = {
    authority: AUTHORITY,
    client_id: CLIENT_ID,
    redirect_uri: window.location.origin,
    onSigninCallback: () => {
      // Removes the code/state from URL after login
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return (
    <OidcProvider {...oidcConfig}>
      <AuthAdapter>{children}</AuthAdapter>
    </OidcProvider>
  );
};

// --- 6. The Hook (Usage) ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AppAuthProvider');
  }
  return context;
};
