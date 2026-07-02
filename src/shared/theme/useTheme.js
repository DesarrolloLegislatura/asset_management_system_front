import { useTheme as useThemeContext } from "./ThemeContext";

export function useTheme() {
  return useThemeContext();
}
