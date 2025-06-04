import PropTypes from "prop-types";
import { usePermissions } from "@/contexts/PermissionContext";

/**
 * Componente que renderiza children solo si el usuario tiene los permisos necesarios
 * @param {string|string[]} permission - Permiso(s) requerido(s)
 * @param {boolean} requireAll - Si se requieren todos los permisos (por defecto: false)
 * @param {React.ReactNode} fallback - Componente a mostrar si no tiene permisos
 * @param {React.ReactNode} children - Contenido a proteger
 */
export const PermissionGuard = ({
  permission,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let hasAccess = false;

  if (!permission) {
    hasAccess = true;
  } else if (typeof permission === "string") {
    hasAccess = hasPermission(permission);
  } else if (Array.isArray(permission)) {
    hasAccess = requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  }

  return hasAccess ? children : fallback;
};

PermissionGuard.propTypes = {
  permission: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  requireAll: PropTypes.bool,
  fallback: PropTypes.node,
  children: PropTypes.node.isRequired,
};
