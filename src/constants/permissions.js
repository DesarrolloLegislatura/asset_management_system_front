// Grupos de usuario
export const USER_GROUPS = {
  ADMINISTRADOR: "Administrador",
  TECNICO: "Tecnico",
  ADMINISTRATIVO: "Administrativo",
};

// Permisos por funcionalidad
export const PERMISSIONS = {
  // Fichas Técnicas (solo edición y visualización, no creación)
  TECHNICAL_SHEET_VIEW: "technical_sheet.view",
  TECHNICAL_SHEET_EDIT: "technical_sheet.edit",
  TECHNICAL_SHEET_DELETE: "technical_sheet.delete",

  // Fichas de Ingreso
  FICHA_INGRESO_VIEW: "ficha_ingreso.view",
  FICHA_INGRESO_CREATE: "ficha_ingreso.create",
  FICHA_INGRESO_EDIT: "ficha_ingreso.edit",
  FICHA_INGRESO_DELETE: "ficha_ingreso.delete",

  // Ficha Toner
  FICHA_TONER_VIEW: "ficha_toner.view",
  FICHA_TONER_CREATE: "ficha_toner.create",
  FICHA_TONER_EDIT: "ficha_toner.edit",

  // Inventario
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_SEARCH: "inventory.search",
};

// Mapeo de permisos por grupo
export const GROUP_PERMISSIONS = {
  [USER_GROUPS.ADMINISTRADOR]: [
    // Acceso total a todas las funcionalidades
    ...Object.values(PERMISSIONS),
  ],

  [USER_GROUPS.TECNICO]: [
    // Fichas técnicas (solo edición y visualización)
    PERMISSIONS.TECHNICAL_SHEET_VIEW,
    PERMISSIONS.TECHNICAL_SHEET_EDIT,
    PERMISSIONS.TECHNICAL_SHEET_DELETE,

    // Fichas de Ingreso (acceso completo)
    PERMISSIONS.FICHA_INGRESO_VIEW,
    PERMISSIONS.FICHA_INGRESO_CREATE,
    PERMISSIONS.FICHA_INGRESO_EDIT,
    PERMISSIONS.FICHA_INGRESO_DELETE,

    // Ficha Toner (acceso completo)
    PERMISSIONS.FICHA_TONER_VIEW,
    PERMISSIONS.FICHA_TONER_CREATE,
    PERMISSIONS.FICHA_TONER_EDIT,

    // Inventario (solo visualización)
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_SEARCH,
  ],

  [USER_GROUPS.ADMINISTRATIVO]: [
    // Fichas de Ingreso (acceso completo)
    PERMISSIONS.FICHA_INGRESO_VIEW,
    PERMISSIONS.FICHA_INGRESO_CREATE,
    PERMISSIONS.FICHA_INGRESO_EDIT,
    PERMISSIONS.FICHA_INGRESO_DELETE,

    // Ficha Toner (solo visualización)
    PERMISSIONS.FICHA_TONER_VIEW,

    // Inventario (solo visualización)
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_SEARCH,
  ],
};

// Rutas accesibles por grupo
export const GROUP_ROUTES = {
  [USER_GROUPS.ADMINISTRADOR]: [
    "/",
    "/ficha-ingreso",
    "/ficha-ingreso/:idFichaIngreso",
    "/ficha-ingreso/detail/:idFichaIngreso",
    "/ficha-tecnica/:idFichaIngreso", // Solo edición
    "/ficha-tecnica/detail/:idFichaIngreso",
    "/ficha-toner",
    "/inventory",
  ],

  [USER_GROUPS.TECNICO]: [
    "/",
    "/ficha-ingreso",
    "/ficha-ingreso/:idFichaIngreso",
    "/ficha-ingreso/detail/:idFichaIngreso",
    "/ficha-tecnica/:idFichaIngreso", // Solo edición
    "/ficha-tecnica/detail/:idFichaIngreso",
    "/ficha-toner",
    "/inventory",
  ],

  [USER_GROUPS.ADMINISTRATIVO]: [
    "/",
    "/ficha-ingreso",
    "/ficha-ingreso/:idFichaIngreso",
    "/ficha-ingreso/detail/:idFichaIngreso",
    "/ficha-toner",
    "/inventory",
  ],
};
