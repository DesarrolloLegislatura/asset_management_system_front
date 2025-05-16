import assetsService from "@/api/assetsService";
import { useEffect, useState } from "react";

export const useAsset = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllAssets = async () => {
    setLoading(true);
    try {
      const response = await assetsService.getAllAssets();
      console.log(response);

      setAssets(response);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAssets();
  }, []);

  return {
    assets,
    fetchAllAssets,
    loading,
  };
};
