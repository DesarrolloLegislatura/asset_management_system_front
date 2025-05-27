import fichaTecnicaService from "@/api/fichaTecnicaService";
import { useCallback, useReducer, useEffect } from "react";

// Reducer para manejar estados relacionados
const fichaReducer = (state, action) => {
  switch (action.type) {
    case "REQUEST_START":
      return { ...state, loading: true, error: null };
    case "REQUEST_SUCCESS":
      return { ...state, loading: false };
    case "REQUEST_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "SET_ALL_FICHAS":
      return { ...state, fichasTecnicas: action.payload };
    case "SET_FICHA_BY_ID":
      return { ...state, fichaTecnicaById: action.payload };
    default:
      return state;
  }
};

export const useFichaTecnica = (autoFetch = false) => {
  const initialState = {
    loading: false,
    error: null,
    fichasTecnicas: [],
    fichaTecnicaById: null,
  };

  const [state, dispatch] = useReducer(fichaReducer, initialState);

  // Fetch all fichas técnicas
  const fetchAllFichasTecnicas = useCallback(async () => {
    dispatch({ type: "REQUEST_START" });
    try {
      const response = await fichaTecnicaService.getAll();
      dispatch({ type: "SET_ALL_FICHAS", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "REQUEST_FAILURE", payload: error });
      return null;
    } finally {
      dispatch({ type: "REQUEST_SUCCESS" });
    }
  }, []);

  // Fetch ficha técnica by ID
  const fetchByIdFichaTecnica = useCallback(async (idFicha) => {
    if (!idFicha) return null;

    dispatch({ type: "REQUEST_START" });
    try {
      const response = await fichaTecnicaService.getById(idFicha);
      dispatch({ type: "SET_FICHA_BY_ID", payload: response.data });
      console.log("Ficha técnica obtenida:", response.data);

      return response.data;
    } catch (error) {
      dispatch({ type: "REQUEST_FAILURE", payload: error });
      return null;
    } finally {
      dispatch({ type: "REQUEST_SUCCESS" });
    }
  }, []);

  // Create ficha técnica
  const createFichaTecnica = useCallback(async (datosIngreso) => {
    dispatch({ type: "REQUEST_START" });
    try {
      const response = await fichaTecnicaService.create(datosIngreso);
      return response.data;
    } catch (error) {
      dispatch({ type: "REQUEST_FAILURE", payload: error });
      return null;
    } finally {
      dispatch({ type: "REQUEST_SUCCESS" });
    }
  }, []);

  // Update ficha técnica
  const updateFichaTecnica = useCallback(async (idFicha, datosActualizados) => {
    dispatch({ type: "REQUEST_START" });
    try {
      const response = await fichaTecnicaService.update(
        idFicha,
        datosActualizados
      );
      return response.data;
    } catch (error) {
      dispatch({ type: "REQUEST_FAILURE", payload: error });
      return null;
    } finally {
      dispatch({ type: "REQUEST_SUCCESS" });
    }
  }, []);

  // Auto-fetch si está habilitado
  useEffect(() => {
    if (autoFetch) {
      fetchAllFichasTecnicas();
    }
  }, [autoFetch, fetchAllFichasTecnicas]);

  return {
    fichasTecnicas: state.fichasTecnicas,
    fichaTecnicaById: state.fichaTecnicaById,
    loading: state.loading,
    error: state.error,
    createFichaTecnica,
    fetchAllFichasTecnicas,
    fetchByIdFichaTecnica,
    updateFichaTecnica,
  };
};
