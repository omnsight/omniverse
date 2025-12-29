import { useAuth } from '../../../provider/AuthContext';

interface EntityWithAuth {
  owner?: string;
  write?: string[];
  read?: string[];
  id?: string;
}

export const useEntityAuth = (entity?: EntityWithAuth) => {
  const { user } = useAuth();

  if (!user || !entity) {
    return { canEdit: false };
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
