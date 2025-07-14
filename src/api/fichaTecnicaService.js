import axiosService from "./axiosService";
const fichaTecnicaService = {
  getById: async (id) => {
    return await axiosService.get(`/tds/tds/${id}/`);
  },
  create: async (datosIngreso) => {
    // Enviar datos de ingreso en formato application/json
    try {
      return await axiosService.post(`/tds/tds/`, datosIngreso, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
  getAll: async () => {
    return await axiosService.get(`/tds/tds/`);
    // const respuesta = await axiosService.get(`/tds/tds/`);
  },
  update: async (id, datosActualizados) => {
    return await axiosService.put(`/tds/tds/${id}/`, datosActualizados);
  },
};

export default fichaTecnicaService;
