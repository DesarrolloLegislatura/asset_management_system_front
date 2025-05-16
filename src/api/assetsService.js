import axiosService from "./axiosService";

const assets = (await import("../statics/lsitaAssets.json")).default;

const assetsService = {
  getAllAssets: async () => {
    try {
      // return await axiosService.post(`/tds/assets/`, data);
      return assets;
    } catch (error) {
      if (axiosService.isAxiosError(error)) {
        throw error;
      }
      throw new Error("Falló la búsqueda de los bienes");
    }
  },
};

export default assetsService;
