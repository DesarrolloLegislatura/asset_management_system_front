import axiosService from "./axiosService";
const authService = {
  auth: async (username, password) => {
    try {
      const response = await axiosService.post(`/auth/login/`, {
        username: username,
        password: password,
      });

      // Se espera estructura { refresh, access }
      const { access, refresh } = response.data;
      if (!access || !refresh) {
        throw new Error("Estructura de respuesta inválida");
      }
      return { access, refresh };
    } catch (error) {
      if (axiosService.isAxiosError(error)) {
        throw error;
      }
      throw new Error("Falló la autenticación");
    }
  },
  refresh: async (refreshToken) => {
    const response = await axiosService.post(`/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    const { access, refresh } = response.data;
    if (!access || !refresh) {
      throw new Error("Estructura de respuesta inválida en refresh");
    }
    return { access, refresh };
  },
};

export default authService;
