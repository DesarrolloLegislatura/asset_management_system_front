import { z } from "zod";

export const TIPOS_BIENES = [
  { value: "pc desktop", label: "💻 PC/Desktop" },
  { value: "all in one", label: "💻 All-in-One" },
  { value: "notebook", label: "💼 Notebook/Laptop" },
  { value: "monitor", label: "🖥️ Monitor" },
  { value: "teclado", label: "⌨️ Teclado" },
  { value: "mouse", label: "🖱️ Mouse" },
  { value: "impresora", label: "🖨️ Impresora" },
  { value: "scanner", label: "🔄 Escáner" },
  { value: "multifuncion", label: "🔄 Impresora Multifunción" },
  { value: "auriculares", label: "🎧 Auriculares" },
  { value: "webcam", label: "📷 Cámara Web" },
  { value: "ups", label: "🔌 UPS/Batería de respaldo" },
  { value: "router", label: "🌐 Router" },
  { value: "switch", label: "🔌 Switch de red" },
  { value: "disco", label: "💾 Disco Duro" },
  { value: "ram", label: "🧠 Memoria RAM" },
  { value: "otro", label: "📦 Otro" }
];

export const bienSchema = z.object({
  tipo_de_bien: z.enum([
    ...TIPOS_BIENES.map(bien => bien.value)
  ])
});