/**
 * Sistema de gestión de transiciones de estados para fichas técnicas
 *
 * Mejoras implementadas:
 * - Estados como enums para evitar duplicación
 * - Grupos de estados para simplificar reglas
 * - Mapeo de variantes para normalización
 * - Funciones optimizadas con mejor rendimiento
 * - Validaciones más robustas
 */

// ===== ENUMS DE ESTADOS =====
export const STATUS = Object.freeze({
  // Estados iniciales
  INGRESADO: "ingresado",

  // Estados de diagnóstico
  DIAGNOSTICO_PENDIENTE: "diagnóstico pendiente",

  // Estados de trabajo
  EN_REPARACION: "en reparación",
  EN_ESPERA_REPUESTO: "en espera de repuesto",
  EN_REPARACION_EXTERNA: "en reparación externa",

  // Estados finales técnicos
  REPARADO: "reparado",
  SIN_REPARACION: "sin reparación",
  SE_RECOMIENDA_BAJA: "se recomienda baja",

  // Estados de cierre logístico
  LISTO_PARA_RETIRAR: "listo para retirar",
  RETIRADO: "retirado",
  FINALIZADO: "finalizado",
  REASIGNAR: "reasignar",
});

// ===== GRUPOS DE ESTADOS =====
const STATUS_GROUPS = Object.freeze({
  INICIAL: [STATUS.INGRESADO, STATUS.REASIGNAR, STATUS.RETIRADO],

  DIAGNOSTICO: [STATUS.DIAGNOSTICO_PENDIENTE],

  TRABAJO_TECNICO: [
    STATUS.EN_REPARACION,
    STATUS.EN_ESPERA_REPUESTO,
    STATUS.EN_REPARACION_EXTERNA,
  ],

  FINALES_TECNICOS: [
    STATUS.REPARADO,
    STATUS.SIN_REPARACION,
    STATUS.SE_RECOMIENDA_BAJA,
  ],

  CIERRE_LOGISTICO: [
    STATUS.LISTO_PARA_RETIRAR,
    STATUS.RETIRADO,
    STATUS.FINALIZADO,
  ],
});

// ===== MAPEO DE VARIANTES =====
const STATUS_VARIANTS_MAP = Object.freeze({
  // Variantes de "diagnóstico pendiente"
  "diagnostico pendiente": STATUS.DIAGNOSTICO_PENDIENTE,

  // Variantes de "en reparación"
  "en reparacion": STATUS.EN_REPARACION,

  // Variantes de "en espera de repuesto"
  "en espera de repuestos": STATUS.EN_ESPERA_REPUESTO,
});

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Normaliza un estado manejando variantes y inconsistencias
 */
export const normalizeStatus = (status) => {
  if (!status) return "";

  const statusLower = status.toLowerCase().trim();
  return STATUS_VARIANTS_MAP[statusLower] || statusLower;
};

/**
 * Obtiene todos los estados de un grupo
 */
const getGroupStates = (...groups) => {
  return groups.flatMap((group) => STATUS_GROUPS[group] || []);
};

// ===== REGLAS DE TRANSICIÓN OPTIMIZADAS =====

/**
 * Genera reglas de transición basadas en la lógica del negocio
 */
const createTransitionRules = () => {
  const rules = new Map();

  // Estados iniciales → pueden ir a diagnóstico o trabajo técnico
  STATUS_GROUPS.INICIAL.forEach((status) => {
    rules.set(status, [
      status, // Mantener estado actual
      ...STATUS_GROUPS.DIAGNOSTICO,
      ...STATUS_GROUPS.TRABAJO_TECNICO,
      ...STATUS_GROUPS.FINALES_TECNICOS,
    ]);
  });

  // Estados de diagnóstico → pueden ir a trabajo técnico o finales
  STATUS_GROUPS.DIAGNOSTICO.forEach((status) => {
    rules.set(status, [
      status, // Mantener estado actual
      ...STATUS_GROUPS.TRABAJO_TECNICO,
      ...STATUS_GROUPS.FINALES_TECNICOS,
    ]);
  });

  // Estados de trabajo técnico → pueden cambiar entre sí o ir a finales
  STATUS_GROUPS.TRABAJO_TECNICO.forEach((status) => {
    rules.set(status, [
      status, // Mantener estado actual
      ...STATUS_GROUPS.TRABAJO_TECNICO,
      ...STATUS_GROUPS.FINALES_TECNICOS,
    ]);
  });

  // Estados finales técnicos → pueden ir a cierre logístico (solo en ficha ingreso)
  STATUS_GROUPS.FINALES_TECNICOS.forEach((status) => {
    rules.set(status, [status]); // Por defecto solo se mantienen
  });

  return rules;
};

/**
 * Genera reglas específicas para ficha de ingreso
 */
const createFichaIngresoRules = () => {
  const baseRules = createTransitionRules();
  const fichaIngresoRules = new Map(baseRules);

  // Los estados finales técnicos pueden avanzar al cierre logístico
  STATUS_GROUPS.FINALES_TECNICOS.forEach((status) => {
    fichaIngresoRules.set(status, [status, ...STATUS_GROUPS.CIERRE_LOGISTICO]);
  });

  // Estados de cierre logístico siguen su flujo natural
  fichaIngresoRules.set(STATUS.LISTO_PARA_RETIRAR, [
    STATUS.LISTO_PARA_RETIRAR,
    STATUS.RETIRADO,
    STATUS.FINALIZADO,
  ]);

  fichaIngresoRules.set(STATUS.RETIRADO, [STATUS.RETIRADO, STATUS.FINALIZADO]);

  fichaIngresoRules.set(STATUS.FINALIZADO, [STATUS.FINALIZADO]);

  // Estados técnicos en ficha ingreso son de solo lectura (no cambian)
  [
    STATUS.INGRESADO,
    STATUS.DIAGNOSTICO_PENDIENTE,
    STATUS.EN_ESPERA_REPUESTO,
    STATUS.EN_REPARACION,
  ].forEach((status) => {
    fichaIngresoRules.set(status, [status]);
  });

  return fichaIngresoRules;
};

// ===== REGLAS EXPORTADAS =====
export const FICHA_TECNICA_TRANSITION_RULES = createTransitionRules();
export const FICHA_INGRESO_TRANSITION_RULES = createFichaIngresoRules();

// ===== CONTEXTOS PERMITIDOS =====
export const ALLOWED_STATES_BY_CONTEXT = Object.freeze({
  ficha_tecnica: [
    ...STATUS_GROUPS.TRABAJO_TECNICO,
    ...STATUS_GROUPS.DIAGNOSTICO,
    ...STATUS_GROUPS.FINALES_TECNICOS,
  ],

  ficha_ingreso_creation: [...STATUS_GROUPS.INICIAL],

  ficha_ingreso_edition: [
    ...STATUS_GROUPS.DIAGNOSTICO,
    ...STATUS_GROUPS.TRABAJO_TECNICO,
    ...STATUS_GROUPS.FINALES_TECNICOS,
    ...STATUS_GROUPS.CIERRE_LOGISTICO,
    ...STATUS_GROUPS.INICIAL,
  ],
});

// ===== FUNCIONES OPTIMIZADAS =====

/**
 * Obtiene las transiciones permitidas para un estado actual
 * Optimizada para mejor rendimiento
 */
export const getTransitionsByCurrentState = (
  currentStateName,
  context = "ficha_ingreso"
) => {
  if (!currentStateName) return [];

  const normalizedState = normalizeStatus(currentStateName);
  const rules =
    context === "ficha_tecnica"
      ? FICHA_TECNICA_TRANSITION_RULES
      : FICHA_INGRESO_TRANSITION_RULES;

  return rules.get(normalizedState) || [];
};

/**
 * Verifica si una transición es válida
 * Optimizada con búsqueda directa en lugar de iteración
 */
export const isValidTransition = (
  fromState,
  toState,
  context = "ficha_ingreso"
) => {
  if (!fromState || !toState) return false;

  const allowedTransitions = getTransitionsByCurrentState(fromState, context);
  const normalizedToState = normalizeStatus(toState);

  return allowedTransitions.includes(normalizedToState);
};

/**
 * Obtiene información detallada sobre un estado
 */
export const getStatusInfo = (status) => {
  const normalizedStatus = normalizeStatus(status);

  for (const [groupName, statuses] of Object.entries(STATUS_GROUPS)) {
    if (statuses.includes(normalizedStatus)) {
      return {
        status: normalizedStatus,
        group: groupName,
        isInitial: STATUS_GROUPS.INICIAL.includes(normalizedStatus),
        isFinal:
          STATUS_GROUPS.FINALES_TECNICOS.includes(normalizedStatus) ||
          STATUS_GROUPS.CIERRE_LOGISTICO.includes(normalizedStatus),
        isTechnical: STATUS_GROUPS.TRABAJO_TECNICO.includes(normalizedStatus),
      };
    }
  }

  return {
    status: normalizedStatus,
    group: "UNKNOWN",
    isInitial: false,
    isFinal: false,
    isTechnical: false,
  };
};

/**
 * Valida si un estado es permitido en un contexto específico
 */
export const isStatusAllowedInContext = (status, context) => {
  const normalizedStatus = normalizeStatus(status);
  const allowedStates = ALLOWED_STATES_BY_CONTEXT[context] || [];

  return allowedStates.includes(normalizedStatus);
};
