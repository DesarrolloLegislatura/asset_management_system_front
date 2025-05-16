import axiosService from "./axiosService";
const fichaTecnicaService = {
  getById: async (id) => {
    return await axiosService.get(`/tds/tds/${id}`);
  },
  create: async (datosIngreso) => {
    return await axiosService.post(`/tds/tds`, datosIngreso);
  },
  getAll: async () => {
    return await axiosService.get(`/tds/tds/`);
  },
  update: async (id, datosActualizados) => {
    return await axiosService.put(`/tds/update/${id}`, datosActualizados);
  },
};

export default fichaTecnicaService;
