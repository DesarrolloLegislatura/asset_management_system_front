import { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { useAuthStore } from "@/store/authStore";
import { GROUP_PERMISSIONS, GROUP_ROUTES } from "@/constants/permissions";

const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
  const { user } = useAuthStore();

  const permissions = useMemo(() => {
    if (!user?.group) return [];
    return GROUP_PERMISSIONS[user.group] || [];
  }, [user?.group]);

  const hasPermission = (permission) => {
    if (!permission) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    if (!permissionList || permissionList.length === 0) return true;
    return permissionList.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissionList) => {
    if (!permissionList || permissionList.length === 0) return true;
    return permissionList.every((permission) => hasPermission(permission));
  };

  const canAccessRoute = (route) => {
    if (!user?.group) return false;
    const allowedRoutes = GROUP_ROUTES[user.group] || [];

    // Verificar coincidencia exacta o con parámetros
    return allowedRoutes.some((allowedRoute) => {
      // Reemplazar parámetros como :id con regex
      const routeRegex = allowedRoute.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${routeRegex}$`);
      return regex.test(route);
    });
  };

  const value = {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    userGroup: user?.group,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

PermissionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};
