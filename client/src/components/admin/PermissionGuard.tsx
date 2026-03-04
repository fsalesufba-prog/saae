import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string[];
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback = null
}) => {
  const { user } = useAuth();

  if (!user) return null;

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <>{fallback}</>;
  }

  if (requiredPermission && user.permissions) {
    const hasPermission = user.permissions[requiredPermission] || user.permissions.all;
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export default PermissionGuard;