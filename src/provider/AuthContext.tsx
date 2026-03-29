import { createContext, useContext } from 'react';

interface DataWithOwner {
  owner?: string;
}

interface EntityWithAuth extends DataWithOwner {
  write?: string[];
  read?: string[];
}

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

export const canWriteToEntity = (user: AuthUser | null, entity?: EntityWithAuth) => {
  if (!user || !entity) {
    return { canEdit: true };
  }

  // Check Owner (user.id matches entity.owner)
  if (entity.owner && entity.owner === user.id) {
    return { canEdit: true };
  }

  // Check Write Roles (intersection of user.roles and entity.write)
  if (entity.write && Array.isArray(entity.write)) {
    const hasWriteRole = entity.write.some((role) => user.roles.includes(role));
    if (hasWriteRole) {
      return { canEdit: true };
    }
  }

  return { canEdit: false };
};

export const useEntityAuth = (entity?: EntityWithAuth) => {
  const { user } = useAuth();
  return canWriteToEntity(user, entity);
};

export const useDataOwner = (data?: DataWithOwner) => {
  const { user } = useAuth();

  if (!user || !data) {
    return false;
  }

  return data.owner === user.id;
};
