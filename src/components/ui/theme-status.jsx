import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";

export function ThemeStatus() {
  const { theme, isDark } = useTheme();

  // Solo mostrar en desarrollo
  // if (import.meta.env.PROD) {
  //   return null;
  // }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Badge variant={isDark ? "default" : "secondary"}>
        Tema: {theme} {isDark ? "🌙" : "☀️"}
      </Badge>
    </div>
  );
}
