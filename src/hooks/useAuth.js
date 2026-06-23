import authService from "@/api/authService";
import { parseJwt } from "@/utils/jwt";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";
import { resolvePrimaryGroup } from "@/lib/authz";
import { getDefaultRouteForGroup } from "@/utils/navigation";

/**
 * Deriva un mensaje de error amigable a partir del error de red/HTTP.
 */
const getAuthErrorMessage = (error) => {
  if (error?.message === "No se pudo decodificar el token") return error.message;
  if (error?.response) {
    return error.response.status === 404
      ? "Usuario no encontrado"
      : error.response.data?.message || "Credenciales inválidas";
  }
  if (error?.message?.includes("Network Error")) {
    return "Error de red. Verifica tu conexión";
  }
  return "Error de conexión";
};

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  /**
   * Autentica al usuario. En caso de éxito navega a la ruta por defecto de su
   * grupo. Lanza un Error con mensaje amigable si falla (lo consume el Action
   * del LoginForm para el estado pending/error de React 19).
   */
  const login = async (username, password) => {
    try {
      const { access, refresh } = await authService.auth(username, password);

      const payload = parseJwt(access);
      if (!payload) {
        throw new Error("No se pudo decodificar el token");
      }

      const {
        user_id: id,
        username: userName,
        first_name: firstName,
        last_name: lastName,
        groups = [],
      } = payload;

      // Mayor privilegio gana cuando hay varios grupos.
      const group = resolvePrimaryGroup(groups);

      setUser({
        id,
        username: userName,
        first_name: firstName,
        last_name: lastName,
        groups,
        group,
        token: access,
        refreshToken: refresh,
      });

      navigate(getDefaultRouteForGroup(group), { replace: true });

      return { access, refresh };
    } catch (error) {
      clearAuth();
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const logout = () => {
    clearAuth();
    navigate("/auth/login", { replace: true });
  };

  return {
    isAuthenticated: !!user.token,
    token: user.token || null,
    login,
    logout,
  };
};
