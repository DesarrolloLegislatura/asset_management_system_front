import { PERMISSIONS } from "@/constants/permissions";
import { FileText, ClipboardCheck, Printer, Search } from "lucide-react";

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
    title: "Fichas Técnicas",
    href: "/ficha-tecnica",
    icon: FileText,
    permission: PERMISSIONS.TECHNICAL_SHEET_VIEW,
    children: [
      {
        title: "Ver Fichas",
        href: "/ficha-tecnica",
        permission: PERMISSIONS.TECHNICAL_SHEET_VIEW,
      },
      {
        title: "Nueva Ficha",
        href: "/ficha-tecnica",
        permission: PERMISSIONS.TECHNICAL_SHEET_CREATE,
      },
    ],
  },
  {
    title: "Ficha Toner",
    href: "/ficha-toner",
    icon: Printer,
    permission: PERMISSIONS.FICHA_TONER_VIEW,
  },
  {
    title: "Inventario",
    href: "/inventory",
    icon: Search,
    permission: PERMISSIONS.INVENTORY_VIEW,
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
