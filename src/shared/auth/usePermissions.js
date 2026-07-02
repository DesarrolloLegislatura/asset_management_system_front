import { useMemo } from "react";
import { useAuthStore } from "./authStore";
import {
  getPermissionsForGroup,
  can as canForGroup,
  canAny as canAnyForGroup,
  canAll as canAllForGroup,
} from "./authz";

/**
 * Hook único de autorización. Deriva los permisos del grupo del usuario
 * directamente del store de Zustand (sin Context intermedio) usando un
 * selector para no sobre-suscribir. Fail-closed por diseño.
 */
export const usePermissions = () => {
  const userGroup = useAuthStore((state) => state.user.group);

  return useMemo(() => {
    const permissions = getPermissionsForGroup(userGroup);

    const hasPermission = (permission) => canForGroup(userGroup, permission);
    const hasAnyPermission = (list) => canAnyForGroup(userGroup, list);
    const hasAllPermissions = (list) => canAllForGroup(userGroup, list);

    const isInGroup = (groups) => {
      if (!userGroup) return false;
      if (typeof groups === "string") return userGroup === groups;
      if (Array.isArray(groups)) return groups.includes(userGroup);
      return false;
    };

    // Helper semántico: can("edit", "ficha_ingreso") -> "ficha_ingreso.edit"
    const can = (action, resource) =>
      action && resource ? hasPermission(`${resource}.${action}`) : false;

    return {
      permissions,
      userGroup,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      isInGroup,
      can,
      // Alias para compatibilidad con consumidores existentes.
      canAny: hasAnyPermission,
      canAll: hasAllPermissions,
    };
  }, [userGroup]);
};
