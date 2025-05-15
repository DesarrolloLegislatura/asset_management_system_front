import dependenciaService from "@/api/dependenciaService";
import { useEffect, useState } from "react";

export const useEstado = () => {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEstados = async () => {
    setLoading(true);
    try {
      const response = await dependenciaService.getAll();
      console.log(response.data);
      setEstados(response.data || []);
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
    fetchEstados();
  }, []);

  return {
    estados,
    loading,
    error,
    fetchEstados,
  };
};
