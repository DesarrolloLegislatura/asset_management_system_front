import { PERMISSIONS, USER_GROUPS } from "@/shared/auth/permissions";
import { ClipboardCheck, Ticket, Wrench } from "lucide-react";

/**
 * Definición de items de navegación con sus permisos requeridos
 */
export const navigationItems = [
  {
    title: "Fichas de Ingreso",
    href: "/",
    icon: ClipboardCheck,
    permission: PERMISSIONS.FICHA_INGRESO_VIEW,
    children: [
      {
        title: "Ver Fichas",
        href: "/",
        permission: PERMISSIONS.FICHA_INGRESO_VIEW,
      },
      {
        title: "Nueva Ficha",
        href: "/ficha-ingreso",
        permission: PERMISSIONS.FICHA_INGRESO_CREATE,
      },
    ],
  },
  {
    title: "Fichas de Servicio",
    href: "/ficha-servicio",
    icon: Wrench,
    permission: PERMISSIONS.FICHA_SERVICIO_VIEW,
  },
  {
    title: "Tickets",
    href: "/tickets",
    icon: Ticket,
    permission: PERMISSIONS.TICKET_VIEW,
    children: [
      {
        title: "Ver Tickets",
        href: "/tickets",
        permission: PERMISSIONS.TICKET_VIEW,
      },
      {
        title: "Estados",
        href: "/tickets/estados",
        permission: PERMISSIONS.TICKET_STATUS_MANAGE,
      },
    ],
  },
];

/**
 * Filtra los items de navegación basándose en los permisos del usuario
 * @param {string[]} userPermissions - Array de permisos del usuario
 * @returns {object[]} Items de navegación filtrados
 */
export const getFilteredNavigation = (userPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return [];
  }

  return navigationItems
    .filter((item) => userPermissions.includes(item.permission))
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          userPermissions.includes(child.permission)
        );

        // Si no hay hijos visibles, no mostrar el item padre
        if (filteredChildren.length === 0) {
          return null;
        }

        return {
          ...item,
          children: filteredChildren,
        };
      }

      return item;
    })
    .filter(Boolean); // Eliminar items null
};

/**
 * Obtiene la primera ruta disponible para el usuario según sus permisos
 * @param {string[]} userPermissions - Array de permisos del usuario
 * @returns {string} Primera ruta disponible o '/unauthorized'
 */
export const getDefaultRoute = (userPermissions) => {
  const filteredNav = getFilteredNavigation(userPermissions);

  if (filteredNav.length > 0) {
    return filteredNav[0].href;
  }

  return "/unauthorized";
};

/**
 * Ruta por defecto tras el login según el grupo del usuario.
 * Fuente única reutilizada por useAuth y los loaders de auth.
 * @param {string|null} group
 * @returns {string}
 */
export const getDefaultRouteForGroup = (group) => {
  switch (group) {
    case USER_GROUPS.ADMINISTRATIVO:
      return "/ficha-ingreso";
    case USER_GROUPS.TECNICO:
    case USER_GROUPS.ADMINISTRADOR:
      return "/";
    default:
      return "/unauthorized";
  }
};

/**
 * Ruta de "ver detalle" de una ficha según el grupo.
 * @param {string|null} group
 * @param {string|number} id
 * @returns {string}
 */
export const getDetailRoute = (group, id) => {
  if (group === USER_GROUPS.TECNICO) return `/ficha-tecnica/detail/${id}`;
  if (
    group === USER_GROUPS.ADMINISTRATIVO ||
    group === USER_GROUPS.ADMINISTRADOR
  ) {
    return `/ficha-ingreso/detail/${id}`;
  }
  return "/unauthorized";
};

/**
 * Ruta de "editar" una ficha según el grupo (null si el grupo no puede editar).
 * @param {string|null} group
 * @param {string|number} id
 * @returns {string|null}
 */
export const getEditRoute = (group, id) => {
  if (group === USER_GROUPS.ADMINISTRADOR || group === USER_GROUPS.TECNICO) {
    return `/ficha-tecnica/${id}`;
  }
  if (group === USER_GROUPS.ADMINISTRATIVO) return `/ficha-ingreso/${id}`;
  return null;
};
