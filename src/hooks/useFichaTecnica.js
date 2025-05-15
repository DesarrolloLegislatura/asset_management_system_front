import fichaTecnicaService from "@/api/fichaTecnicaService";
import { useState, useEffect, useCallback } from "react";

export const useFichaTecnica = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fichasTecnicas, setFichasTecnicas] = useState([]);
  const [fichaTecnicaById, setFichaTecnicaById] = useState([]);

  const createFichaTecnica = async (datosIngreso) => {
    setLoading(true);
    try {
      const response = await fichaTecnicaService.create(datosIngreso);
      return response.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllFichasTecnicas = async () => {
    setLoading(true);
    try {
      const response = await fichaTecnicaService.getAll();
      setFichasTecnicas(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchByIdFichaTecnica = useCallback(async (idFicha) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fichaTecnicaService.getById(idFicha);
      console.log("Response from API:", response.data); // Log API response
      setFichaTecnicaById(response.data);
      return response.data; // Return the data for immediate use
    } catch (error) {
      console.error("Error fetching ficha:", error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFichaTecnica = async (idFicha, datosActualizados) => {
    setLoading(true);
    try {
      const response = await fichaTecnicaService.update(
        idFicha,
        datosActualizados
      );
      return response.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    fetchAllFichasTecnicas();
  }, []);

  return {
    fichasTecnicas,
    fichaTecnicaById,
    loading,
    error,
    createFichaTecnica,
    fetchAllFichasTecnicas,
    fetchByIdFichaTecnica,
    updateFichaTecnica,
  };
};
