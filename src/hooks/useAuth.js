import authService from "@/api/authService";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { useNavigate } from "react-router";

// Utilidad simple para decodificar un JWT sin dependencias externas
const decodeJWT = (token) => {
  try {
    const payload = token.split(".")[1];
    const valor = JSON.parse(atob(payload));
    console.log(valor);
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.auth(username, password);

      if (!response?.access) {
        throw new Error("Respuesta inválida del servidor");
      }

      const decodedToken = decodeJWT(response.access);
      const userGroup =
        decodedToken.groups?.[0] || decodedToken.group || "Tecnico";
      setUser({
        id: decodedToken.user_id,
        username: decodedToken.username,
        first_name: decodedToken.first_name,
        last_name: decodedToken.last_name,
        group: userGroup,
        token: response.access,
        refresh: response.refresh,
      });
      redirectBasedGroup(userGroup);
      return response;
    } catch (error) {
      let errorMessage = "Error de conexión";

      if (error.response) {
        errorMessage =
          error.response.status === 404
            ? "Usuario no encontrado"
            : error.response.data?.message || "Credenciales inválidas";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Error de red. Verifica tu conexión";
      }

      setError(errorMessage);
      clearAuth();
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const redirectBasedGroup = (group) => {
    if (!group) {
      navigate("/unauthorized", { replace: true });
      return;
    }

    if (group.includes("Admin")) {
      navigate("/ficha-tecnica", { replace: true });
    } else if (group.includes("Tecnico")) {
      navigate("/ficha-tecnica", { replace: true });
    } else {
      navigate("/unauthorized", { replace: true });
    }
  };
  const logout = () => {
    clearAuth();
    navigate("/auth/login", { replace: true });
  };

  return {
    isAuthenticated: !!user.token,
    token: user.token || null,
    authLoading: loading,
    authError: error,
    login,
    logout,
    clearError: () => setError(null),
  };
};
