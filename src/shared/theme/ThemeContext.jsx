import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Si estamos en el servidor, devolver un valor por defecto
    if (typeof window === "undefined") return "light";

    // Intentar obtener el tema guardado en localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }

    // Si no hay tema guardado, detectar preferencia del sistema
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  });

  // Función para aplicar el tema al documento
  const applyTheme = useCallback((themeToApply) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    // Remover todas las clases de tema
    root.classList.remove("light", "dark");
    // Agregar la clase del tema actual
    root.classList.add(themeToApply);
    // Asegurar que el atributo data-theme esté configurado para compatibilidad con algunas librerías
    root.setAttribute("data-theme", themeToApply);
    // Guardar en localStorage
    localStorage.setItem("theme", themeToApply);
  }, []);

  // Aplicar el tema de forma sincrónica antes del primer renderizado
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  const setLightTheme = useCallback(() => setTheme("light"), []);
  const setDarkTheme = useCallback(() => setTheme("dark"), []);

  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe ser usado dentro de ThemeProvider");
  }
  return context;
}
