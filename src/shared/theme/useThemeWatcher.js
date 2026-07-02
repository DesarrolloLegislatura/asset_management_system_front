import { useEffect } from "react";
import { useTheme } from "./ThemeContext";

export function useThemeWatcher() {
  const { theme, isDark, isLight } = useTheme();

  useEffect(() => {
    // Solo verificar en desarrollo para no afectar el rendimiento en producción
    if (import.meta.env.DEV) {
      const htmlElement = document.documentElement;
      const hasCorrectClass = htmlElement.classList.contains(theme);

      if (!hasCorrectClass) {
        console.warn(
          `⚠️ Tema ${theme} no está aplicado correctamente al documento`
        );
      }

   

      // Verificar variables CSS están disponibles
      const computedStyle = getComputedStyle(htmlElement);
      const backgroundVar = computedStyle
        .getPropertyValue("--background")
        .trim();

      if (!backgroundVar) {
        console.error("❌ Variables CSS de tema no están disponibles");
      }
    }
  }, [theme, isDark, isLight]);

  return { theme, isDark, isLight };
}
