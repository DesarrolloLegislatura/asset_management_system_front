import { usePermissions } from "@/contexts/PermissionContext";
import { useCallback } from "react";

/**
 * Hook personalizado para gestión de permisos
 * Proporciona utilidades simplificadas para verificar permisos
 */
export const usePermission = () => {
  const {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    userGroup,
  } = usePermissions();

  // Verificar si el usuario pertenece a uno o más grupos
  const isInGroup = useCallback(
    (groups) => {
      if (!userGroup) return false;
      if (typeof groups === "string") {
        return userGroup === groups;
      }
      if (Array.isArray(groups)) {
        return groups.includes(userGroup);
      }
      return false;
    },
    [userGroup]
  );

  // Verificar si puede realizar una acción específica
  const can = useCallback(
    (action, resource) => {
      if (!action || !resource) return false;
      const permission = `${resource}.${action}`;
      return hasPermission(permission);
    },
    [hasPermission]
  );

  // Verificar múltiples permisos con lógica OR
  const canAny = useCallback(
    (permissions) => {
      return hasAnyPermission(permissions);
    },
    [hasAnyPermission]
  );

  // Verificar múltiples permisos con lógica AND
  const canAll = useCallback(
    (permissions) => {
      return hasAllPermissions(permissions);
    },
    [hasAllPermissions]
  );

  return {
    // Estado
    permissions,
    userGroup,

    // Funciones de verificación
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    isInGroup,
    can,
    canAny,
    canAll,
  };
};
