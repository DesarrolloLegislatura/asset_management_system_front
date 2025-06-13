import authService from "@/api/authService";
import { parseJwt } from "@/utils/jwt";
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
      const { access, refresh } = await authService.auth(username, password);

      // Decodificar el token para obtener la info del usuario
      const payload = parseJwt(access);
      console.log(payload);
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

      const group = validateGroups(groups);

      setUser({
        id,
        username: userName,
        first_name: firstName,
        last_name: lastName,
        groups,
        group: group,
        token: access,
        refreshToken: refresh,
      });

      redirectBasedGroup(groups);

      return { access, refresh };
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

  const redirectBasedGroup = (groups = []) => {
    const userGroups = groups;

    if (userGroups.length === 0) {
      navigate("/unauthorized", { replace: true });
      return;
    }

    if (userGroups.includes("Administrativo")) {
      navigate("/ficha-ingreso", { replace: true });
    } else if (userGroups.includes("Tecnico")) {
      navigate("/", { replace: true });
    } else if (userGroups.includes("Administrador")) {
      navigate("/", { replace: true });
    } else {
      navigate("/unauthorized", { replace: true });
    }
  };

  const validateGroups = (groups = []) => {
    if (groups.includes("Administrativo")) {
      return "Administrativo";
    } else if (groups.includes("Tecnico")) {
      return "Tecnico";
    } else if (groups.includes("Administrador")) {
      return "Administrador";
    } else {
      return "Unauthorized";
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
