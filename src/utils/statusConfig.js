import { Badge } from "@/components/ui/badge";

/**
 * Configuración centralizada de estados para las fichas técnicas
 * Cada estado tiene:
 * - emoji: Ícono representativo
 * - label: Etiqueta en español
 * - color: Clases de Tailwind para el estilo
 */
export const statusConfig = {
  "en reparacion": {
    emoji: "🔧",
    label: "En reparación",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  "espera repuestos": {
    emoji: "⏳",
    label: "En espera de repuestos",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  diagnostico: {
    emoji: "🔍",
    label: "Diagnóstico pendiente",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  reparado: {
    emoji: "✅",
    label: "Reparado",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  "listo entregar": {
    emoji: "📦",
    label: "Listo para entregar",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  baja: {
    emoji: "❌",
    label: "Se recomienda baja",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  "reparacion externa": {
    emoji: "🏢",
    label: "En reparación externa",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  ingreso: {
    emoji: "📥",
    label: "Ingreso",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  salida: {
    emoji: "📤",
    label: "Salida",
    color: "bg-teal-100 text-teal-800 border-teal-200",
  },
  retirada: {
    emoji: "🚚",
    label: "Retirada",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

/**
 * Obtiene la configuración de un estado específico
 * @param {string} estado - El nombre del estado a buscar
 * @returns {Object} La configuración del estado o un estado por defecto
 */
export const getStatusConfig = (estado) => {
  if (!estado) return null;

  // Simplificamos el estado para la búsqueda
  const estadoSimplificado = estado.toLowerCase().replace(/\s+/g, " ").trim();

  // Buscamos coincidencias parciales
  const coincidencia = Object.keys(statusConfig).find((key) =>
    estadoSimplificado.includes(key)
  );

  return coincidencia ? statusConfig[coincidencia] : null;
};

/**
 * Renderiza un badge con el estilo del estado
 * @param {string} estado - El nombre del estado
 * @returns {JSX.Element} El componente Badge con el estilo correspondiente
 */
export const renderStatusBadge = (estado) => {
  const config = getStatusConfig(estado);

  if (config) {
    return <span className="capitalize">{estado}</span>;
  }

  const { emoji, label, color } = config;

  return (
    <Badge
      variant="outline"
      className={`${color} capitalize whitespace-nowrap px-2 py-1`}
    >
      <span className="mr-1">{emoji}</span>
      {label}
    </Badge>
  );
};
