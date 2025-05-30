import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router";
import { usePermissions } from "@/contexts/PermissionContext";
import { useAuthStore } from "@/store/authStore";

/**
 * Componente que protege rutas basándose en permisos
 * @param {string|string[]} permission - Permiso(s) requerido(s)
 * @param {boolean} requireAll - Si se requieren todos los permisos
 * @param {string} redirectTo - Ruta a la que redirigir si no tiene permisos
 * @param {React.ReactNode} children - Componente de la ruta
 */
export const ProtectedRoute = ({
  permission,
  requireAll = false,
  redirectTo = "/unauthorized",
  children,
}) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { hasPermission, hasAnyPermission, hasAllPermissions, canAccessRoute } =
    usePermissions();

  // Si no hay usuario autenticado, redirigir al login
  if (!user?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permisos específicos si se proporcionan
  if (permission) {
    let hasAccess = false;

    if (typeof permission === "string") {
      hasAccess = hasPermission(permission);
    } else if (Array.isArray(permission)) {
      hasAccess = requireAll
        ? hasAllPermissions(permission)
        : hasAnyPermission(permission);
    }

    if (!hasAccess) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Verificar si puede acceder a la ruta actual
  if (!canAccessRoute(location.pathname)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  permission: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  requireAll: PropTypes.bool,
  redirectTo: PropTypes.string,
  children: PropTypes.node.isRequired,
};
