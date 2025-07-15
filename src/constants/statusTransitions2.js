/**
 * Reglas de transición de estados para el sistema de gestión de activos
 *
 * Estructura:
 * - Cada clave representa un estado actual
 * - El valor es un array con los estados a los que puede transicionar
 * - Siempre incluye el estado actual para permitir mantenerlo
 */

// Reglas de transición para Ficha de Ingreso
export const FICHA_INGRESO_TRANSITION_RULES = {
  // Estados técnicos - Solo permiten mantenerse en el mismo estado
  // (Las transiciones se manejan desde Ficha Técnica)
  ingresado: ["ingresado"],

  "diagnóstico pendiente": ["diagnóstico pendiente", "diagnostico pendiente"],

  "diagnostico pendiente": ["diagnóstico pendiente", "diagnostico pendiente"],

  "en espera de repuesto": ["en espera de repuesto", "en espera de repuestos"],

  "en espera de repuestos": ["en espera de repuesto", "en espera de repuestos"],

  // Estados de finalización - Permiten trasnsiciones hacia estados de cierre
  reparado: ["reparado", "listo para retirar", "retirado", "finalizado"],

  "listo para retirar": ["listo para retirar", "retirado", "finalizado"],

  retirado: ["retirado", "finalizado"],

  finalizado: ["finalizado"],

  "sin reparación": [
    "sin reparación",
    "sin reparacion",
    "listo para retirar",
    "retirado",
    "finalizado",
  ],

  "sin reparacion": [
    "sin reparación",
    "sin reparacion",
    "listo para retirar",
    "retirado",
    "finalizado",
  ],

  "se recomienda baja": [
    "se recomienda baja",
    "listo para retirar",
    "retirado",
    "finalizado",
  ],

  "en reparación externa": [
    "en reparación externa",
    "en reparacion externa",
    "listo para retirar",
    "retirado",
    "finalizado",
  ],

  "en reparacion externa": [
    "en reparación externa",
    "en reparacion externa",
    "listo para retirar",
    "retirado",
    "finalizado",
  ],

  "en reparación": ["en reparación", "en reparacion"],

  "en reparacion": ["en reparación", "en reparacion"],
};

// Reglas de transición para Ficha Técnica
export const FICHA_TECNICA_TRANSITION_RULES = {
  ingresado: [
    "ingresado",
    "diagnóstico pendiente",
    "diagnostico pendiente",
    "en reparación",
    "en reparacion",
    "en espera de repuesto",
    "en espera de repuestos",
    "reparado",
    "sin reparación",
    "sin reparacion",
    "se recomienda baja",
    "en reparación externa",
    "en reparacion externa",
  ],

  "diagnóstico pendiente": [
    "diagnóstico pendiente",
    "diagnostico pendiente",
    "en reparación",
    "en reparacion",
    "en espera de repuesto",
    "en espera de repuestos",
    "reparado",
    "sin reparación",
    "sin reparacion",
    "se recomienda baja",
    "en reparación externa",
    "en reparacion externa",
  ],

  "diagnostico pendiente": [
    "diagnóstico pendiente",
    "diagnostico pendiente",
    "en reparación",
    "en reparacion",
    "en espera de repuesto",
    "en espera de repuestos",
    "reparado",
    "sin reparación",
    "sin reparacion",
    "se recomienda baja",
    "en reparación externa",
    "en reparacion externa",
  ],

  "en reparación": [
    "en reparación",
    "en reparacion",
    "en espera de repuesto",
    "en espera de repuestos",
    "reparado",
    "sin reparación",
    "sin reparacion",
    "se recomienda baja",
    "en reparación externa",
    "en reparacion externa",
  ],

  "en reparacion": [
    "en reparación",
    "en reparacion",
    "en espera de repuesto",
    "en espera de repuestos",
    "reparado",
    "sin reparación",
    "sin reparacion",
    "se recomienda baja",
    "en reparación externa",
    "en reparacion externa",
  ],

  "en espera de repuesto": [
    "en espera de repuesto",
    "en espera de repuestos",
    "en reparación",
    "en reparacion",
    "reparado",
    "sin reparación",
    "sin reparacion",
    "se recomienda baja",
    "en reparación externa",
    "en reparacion externa",
  ],

  "en espera de repuestos": [
    "en espera de repuesto",
    "en espera de repuestos",
    "en reparación",
    "en reparacion",
    "reparado",
    "sin reparación",
    "sin reparacion",
    "se recomienda baja",
    "en reparación externa",
    "en reparacion externa",
  ],

  // Estados finales de reparación - Solo permiten mantenerse (no más cambios técnicos)
  reparado: ["reparado"],
  "sin reparación": ["sin reparación", "sin reparacion"],
  "sin reparacion": ["sin reparación", "sin reparacion"],
  "se recomienda baja": ["se recomienda baja"],
  "en reparación externa": ["en reparación externa", "en reparacion externa"],
  "en reparacion externa": ["en reparación externa", "en reparacion externa"],
};

// Estados permitidos para cada contexto
export const ALLOWED_STATES_BY_CONTEXT = {
  ficha_tecnica: [
    "en reparación",
    "en reparacion",
    "en espera de repuesto",
    "en espera de repuestos",
    "diagnóstico pendiente",
    "diagnostico pendiente",
    "reparado",
    "se recomienda baja",
    "en reparación externa",
    "en reparacion externa",
    "sin reparación",
    "sin reparacion",
  ],

  ficha_ingreso_creation: ["ingresado"],

  ficha_ingreso_edition: [
    "diagnóstico pendiente",
    "en espera de repuesto",
    "en reparación",
    "en reparación externa",
    "finalizado",
    "ingresado",
    "listo para retirar",
    "reparado",
    "retirado",
    "se recomienda baja",
    "sin reparación",
  ],
};

// Función helper para obtener transiciones por estado actual
export const getTransitionsByCurrentState = (
  currentStateName,
  context = "ficha_ingreso"
) => {
  const rules =
    context === "ficha_tecnica"
      ? FICHA_TECNICA_TRANSITION_RULES
      : FICHA_INGRESO_TRANSITION_RULES;

  const normalizedStateName = currentStateName?.toLowerCase() || "";

  // Buscar las transiciones permitidas para el estado actual
  for (const [key, transitions] of Object.entries(rules)) {
    if (normalizedStateName.includes(key)) {
      return transitions;
    }
  }

  // Si no se encuentra regla específica, retornar array vacío
  return [];
};

// Función helper para verificar si una transición es válida
export const isValidTransition = (
  fromState,
  toState,
  context = "ficha_ingreso"
) => {
  const allowedTransitions = getTransitionsByCurrentState(fromState, context);
  const normalizedToState = toState?.toLowerCase() || "";

  return allowedTransitions.some((allowed) =>
    normalizedToState.includes(allowed.toLowerCase())
  );
};
