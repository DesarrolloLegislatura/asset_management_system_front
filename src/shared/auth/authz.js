import { GROUP_PERMISSIONS, USER_GROUPS } from "@/constants/permissions";

/**
 * Capa pura de autorización (sin React ni hooks).
 * Reutilizable tanto por hooks de UI como por loaders de React Router.
 * Diseño fail-closed: ante la duda, se deniega.
 */

// Prioridad de grupos: el de mayor privilegio gana cuando el usuario
// pertenece a varios grupos a la vez.
const GROUP_PRIORITY = [
  USER_GROUPS.ADMINISTRADOR,
  USER_GROUPS.TECNICO,
  USER_GROUPS.ADMINISTRATIVO,
];

/**
 * Resuelve el grupo primario (mayor privilegio) a partir de los grupos del JWT.
 * @param {string[]} groups
 * @returns {string|null}
 */
export const resolvePrimaryGroup = (groups = []) => {
  if (!Array.isArray(groups) || groups.length === 0) return null;
  return GROUP_PRIORITY.find((group) => groups.includes(group)) ?? null;
};

/**
 * Permisos asociados a un grupo (array vacío si el grupo es desconocido o nulo).
 * @param {string|null} group
 * @returns {string[]}
 */
export const getPermissionsForGroup = (group) => {
  if (!group) return [];
  return GROUP_PERMISSIONS[group] ?? [];
};

/**
 * ¿El grupo tiene el permiso? Fail-closed: deniega si falta grupo o permiso.
 */
export const can = (group, permission) => {
  if (!group || !permission) return false;
  return getPermissionsForGroup(group).includes(permission);
};

/** OR lógico. Fail-closed: lista vacía => false. */
export const canAny = (group, permissions = []) => {
  if (!Array.isArray(permissions) || permissions.length === 0) return false;
  return permissions.some((permission) => can(group, permission));
};

/** AND lógico. Fail-closed: lista vacía => false. */
export const canAll = (group, permissions = []) => {
  if (!Array.isArray(permissions) || permissions.length === 0) return false;
  return permissions.every((permission) => can(group, permission));
};
