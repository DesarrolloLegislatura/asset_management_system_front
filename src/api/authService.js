import axios from "axios";
import axiosService from "./axiosService";
const authService = {
  auth: async (username, password) => {
    console.log(username, password);

    try {
      const response = await axiosService.post(`/auth/login/`, {
        username: username,
        password: password,
      });
      if (!response.data.access) {
        throw new Error("Estructura de respuesta inválida");
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      }
      throw new Error("Falló la autenticación");
    }
  },
};

export default authService;
