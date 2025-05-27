import { useAuthStore } from "@/store/authStore";

// Listado de todos los estados posibles de un bien.
const ALL_STATES = [
  "ingreso",
  "salida",
  "retirada",
  "diagnostico",
  "reparacion interna",
  "reparacion externa",
  "baja definitiva",
];

// Estados reservados para el personal administrativo
const ADMINISTRATIVO_STATES = ["ingreso", "salida", "retirada"];

// Utilidad principal para centralizar la lógica de permisos.
export const useAuthorization = () => {
  const user = useAuthStore((state) => state.user) || {};
  const roles = user.roles || user.groups || user.group || [];
  const normalizedRoles = Array.isArray(roles) ? roles : [roles];

  const isAdmin = normalizedRoles.includes("Admin");
  const isTecnico = normalizedRoles.includes("Tecnico");
  const isAdministrativo = normalizedRoles.includes("Administrativo");

  /**
   * Devuelve qué estados puede seleccionar el usuario autenticado.
   */
  const allowedStates = () => {
    if (isAdmin) return ALL_STATES;
    if (isAdministrativo) return ADMINISTRATIVO_STATES;
    if (isTecnico) return ALL_STATES.filter(
      (s) => !ADMINISTRATIVO_STATES.includes(s)
    );
    return [];
  };

  /**
   * Verifica si el usuario puede crear un determinado tipo de ficha.
   * @param {"ingreso" | "tecnica" | "toner"} type
   */
  const canCreateFicha = (type) => {
    if (isAdmin) return true;
    if (type === "ingreso") return isAdministrativo;
    if (type === "tecnica") return isTecnico;
    if (type === "toner") return isAdministrativo || isTecnico;
    return false;
  };

  /**
   * Verifica si el usuario puede imprimir una ficha dependiendo del estado.
   */
  const canPrint = (estado, fichaType) => {
    if (isAdmin) return true;

    if (fichaType === "ingreso") {
      return isAdministrativo && ADMINISTRATIVO_STATES.includes(estado);
    }

    if (fichaType === "tecnica") {
      return isTecnico && !ADMINISTRATIVO_STATES.includes(estado);
    }

    return false;
  };

  return {
    isAdmin,
    isTecnico,
    isAdministrativo,
    allowedStates,
    canCreateFicha,
    canPrint,
  };
};
