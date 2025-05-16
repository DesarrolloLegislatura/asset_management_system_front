import axiosService from "./axiosService";
const authService = {
  auth: async (username, password) => {
    console.log(username, password);

    try {
      // const response = await axiosService.post(`/users/login`, {
      //   user: username,
      //   password: password,
      // });
      // if (!response.data.token) {
      //   throw new Error("Estructura de respuesta inválida");
      // }

      // TODO: Cambiar estructura de respuesta cuando guille implemente la api
      // Datos mock
      const response = {
        id: 1,
        user: "admin",
        nombre: "Admin",
        grupo: {
          nombre: "Admin",
        },
        token: "token",
      };
      return response;
    } catch (error) {
      if (axiosService.isAxiosError(error)) {
        throw error;
      }
      throw new Error("Falló la autenticación");
    }
  },
};

export default authService;
