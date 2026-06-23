import PropTypes from "prop-types";
import { usePermissions } from "@/hooks/usePermissions";

/**
 * Componente que renderiza contenido basado en condiciones de permisos
 * Útil para mostrar/ocultar elementos de UI según el rol del usuario
 */
export const ConditionalRender = ({ condition, children, fallback = null }) => {
  const permission = usePermissions();

  // Evaluar la condición pasando el objeto de permisos
  const shouldRender =
    typeof condition === "function"
      ? condition(permission)
      : Boolean(condition);

  return shouldRender ? children : fallback;
};

ConditionalRender.propTypes = {
  condition: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).isRequired,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

/**
 * Componente específico para renderizar basado en grupo
 */
export const GroupRender = ({ groups, children, fallback = null }) => {
  const { isInGroup } = usePermissions();

  return isInGroup(groups) ? children : fallback;
};

GroupRender.propTypes = {
  groups: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

/**
 * Componente para renderizar basado en una acción específica
 */
export const CanRender = ({ action, resource, children, fallback = null }) => {
  const { can } = usePermissions();

  return can(action, resource) ? children : fallback;
};

CanRender.propTypes = {
  action: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};
