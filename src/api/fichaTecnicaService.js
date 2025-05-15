import axiosService from "./axiosService";
const fichaTecnicaService = {
  getById: async (id) => {
    return await axiosService.get(`/fichaTecnica/ficha/${id}`);
  },
  create: async (datosIngreso) => {
    return await axiosService.post(`/fichaTecnica/create`, datosIngreso);
  },
  getAll: async () => {
    return await axiosService.get(`/fichaTecnica/getAllFichas`);
  },
  update: async (id, datosActualizados) => {
    return await axiosService.put(
      `/fichaTecnica/update/${id}`,
      datosActualizados
    );
  },
};

export default fichaTecnicaService;
