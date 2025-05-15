import axiosService from "./axiosService";
const estadoService = {
  getById: async (id) => {
    return await axiosService.get(`/estado/estado/${id}`);
  },
  getAll: async () => {
    return await axiosService.get(`/estado/getAllEstados`);
  },
};

export default estadoService;
