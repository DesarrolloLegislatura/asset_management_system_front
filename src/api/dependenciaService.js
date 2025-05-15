import axiosService from "./axiosService";
const dependenciaService = {
  getAll: async () => {
    return await axiosService.get(`/dependencias/getAllDependencias`);
  },
  getDependenciaInternaById: async (id) => {
    return await axiosService.get(
      `/dependenciaInterna/getAllDepIntByDepId/${id}`
    );
  },
};

export default dependenciaService;
