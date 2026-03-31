import React, { useMemo, useState } from 'react';
import {
  AuthProvider as OidcProvider,
  useAuth as useOidcAuth,
  type AuthProviderProps,
} from 'react-oidc-context';
import { User } from 'oidc-client-ts';
import { Center, Loader } from '@mantine/core';
import { jwtDecode } from 'jwt-decode';
import { AuthContext, type AuthContextType, type AuthUser } from './AuthContext';

// --- 1. Environment Configuration ---
const CLIENT_ID = import.meta.env.VITE_OIDC_CLIENT_ID;
const AUTHORITY = import.meta.env.VITE_OIDC_AUTHORITY;

const parseRoles = (user: User | null): string[] => {
  if (!user || !user.access_token) return [];

  try {
    const decoded = jwtDecode(user.access_token) as {
      roles?: string[];
    };
    return decoded.roles || [];
  } catch (error) {
    console.error('Failed to decode JWT', error);
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
      roles: parseRoles(auth.user),
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
    token: auth.user?.access_token,
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

// --- 5. The Mock Provider ---
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockToken = useMemo(() => {
    const toBase64Url = (str: string) => {
      return window.btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = toBase64Url(
      JSON.stringify({
        sub: 'mock-user-id',
        preferred_username: 'mockuser',
        email: 'mock@example.com',
        given_name: 'Mock',
        family_name: 'User',
        roles: ['admin', 'user'],
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    );
    return `${header}.${payload}.mock-signature`;
  }, []);

  const mockUser: AuthUser = useMemo(
    () => ({
      id: 'mock-user-id',
      username: 'mockuser',
      email: 'mock@example.com',
      firstName: 'Mock',
      lastName: 'User',
      roles: ['admin', 'user'],
      token: mockToken,
    }),
    [mockToken],
  );

  const [user, setUser] = useState<AuthUser | null>(mockUser);

  const value: AuthContextType = {
    isAuthenticated: !!user,
    isLoading: false,
    user: user,
    login: () => {
      console.log('Mock login');
      setUser(mockUser);
    },
    logout: () => {
      console.log('Mock logout');
      setUser(null);
    },
    hasRole: (role: string) => user?.roles.includes(role) || false,
    token: user?.token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 6. The Main Provider Component ---
export const AppAuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Check if we should use the mock provider
  if (import.meta.env.VITE_USE_MOCK_AUTH === 'true') {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }

  // OIDC Configuration
  const oidcConfig: AuthProviderProps = {
    authority: AUTHORITY,
    client_id: CLIENT_ID,
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'openid profile email',
    onSigninCallback: () => {
      // Removes the code/state from URL after login
      window.history.replaceState({}, document.title, window.location.pathname);
    },
  };

  return (
    <OidcProvider {...oidcConfig}>
      <AuthAdapter>{children}</AuthAdapter>
    </OidcProvider>
  );
};
