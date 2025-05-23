import axiosService from "./axiosService";
const fichaTecnicaService = {
  getById: async (id) => {
    return await axiosService.get(`/tds/tds/${id}/`);
  },
  create: async (datosIngreso) => {
    // Enviar datos de ingreso en formato application/json
    return await axiosService.post(`/tds/tds/`, datosIngreso, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  getAll: async () => {
    return await axiosService.get(`/tds/tds/`);
    // const respuesta = await axiosService.get(`/tds/tds/`);
  },
  update: async (id, datosActualizados) => {
    return await axiosService.put(`/tds/update/${id}`, datosActualizados);
  },
};

export default fichaTecnicaService;
