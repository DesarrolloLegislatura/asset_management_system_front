import axiosService from "./axiosService";

// const assets = (await import("../statics/lsitaAssets.json")).default;

const assetsService = {
  getAllAssets: async () => {
    return await axiosService.get("/tds/assets");
  },
};

export default assetsService;
