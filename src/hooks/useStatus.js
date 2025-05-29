import statusService from "@/api/statusService";
import { STATUS_IDS } from "@/constants/statusConstants";
import { useEffect, useMemo, useState } from "react";

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

  // Función para filtrar estados segun el modo
  const getCreationMode = useMemo(() => {
    return (isCreationMode = false) => {
      if (isCreationMode) {
        // En modo creación, solo mostrar "Ingreso"
        return status.filter((estado) => estado.id === STATUS_IDS.INGRESO);
      }
      return status;
    };
  }, [status]);

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    status,
    loading,
    error,
    fetchStatus,
    getCreationMode,
  };
};
