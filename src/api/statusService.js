import axiosService from "./axiosService";
const statusService = {
  getById: async (id) => {
    return await axiosService.get(`/tds/status/${id}`);
  },
  getAll: async () => {
    return await axiosService.get(`/tds/status/`);
  },
};

export default statusService;
