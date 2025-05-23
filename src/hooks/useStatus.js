import statusService from "@/api/statusService";
import { useEffect, useState } from "react";

export const useStatus = () => {
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await statusService.getAll();
      console.log("Status cargados:", response.data);
      setStatus(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error al cargar estados:", err);
      setError("Error al cargar estados");
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    status,
    loading,
    error,
    fetchStatus,
  };
};
