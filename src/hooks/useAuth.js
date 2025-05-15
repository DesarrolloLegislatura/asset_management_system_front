import authService from "@/api/authService";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { useNavigate } from "react-router";

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

      if (!response?.token) {
        throw new Error("Respuesta inválida del servidor");
      }

      console.log("lo de dani:" + Object.keys(response));
      const userGroup = response.grupo?.nombre || "Tecnico";
      setUser({
        id: response.id,
        username: response.user,
        name: response.nombre,
        group: userGroup,
        token: response.token,
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
