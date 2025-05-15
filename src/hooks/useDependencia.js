import { useState, useEffect } from "react";
import dependenciaService from "@/api/dependenciaService";

export const useDependencias = (selectedDepId) => {
  const [dependencias, setDependencias] = useState([]);
  const [dependenciasInternas, setDependenciasInternas] = useState([]);
  const [loading, setLoading] = useState({
    dependencias: false,
  });
  const [error, setError] = useState({
    dependencias: null,
  });

  const fetchDependencias = async () => {
    setLoading((prev) => ({ ...prev, dependencias: true }));
    try {
      const response = await dependenciaService.getAll();
      console.log(response.data);
      setDependencias(response.data || []);
      setError((prev) => ({ ...prev, dependencias: null }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        dependencias: "Error al cargar Dependencias",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, dependencias: false }));
    }
  };
  const fetchDependenciasInternas = async (id) => {
    setLoading((prev) => ({ ...prev, dependenciasInternas: true }));
    console.log("fetchDependenciasInternas", typeof id);

    try {
      const response = await dependenciaService.getDependenciaInternaById(id);
      console.log(response.data);

      setDependenciasInternas(response.data || []);
      setError((prev) => ({ ...prev, dependencias: null }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        dependencias: "Error al cargar Dependencias Internas",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, dependencias: false }));
    }
  };

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    fetchDependencias();
  }, []);

  useEffect(() => {
    if (selectedDepId) {
      fetchDependenciasInternas(selectedDepId);
    }
  }, [selectedDepId]);

  return {
    dependencias,
    dependenciasInternas,
    loading,
    error,
    refetch: {
      dependencias: fetchDependencias,
      dependenciasInternas: fetchDependenciasInternas,
    },
  };
};
