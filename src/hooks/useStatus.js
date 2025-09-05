import statusService from "@/api/statusService";
import { useEffect, useMemo, useState } from "react";
import {
  ALLOWED_STATES_BY_CONTEXT,
  getTransitionsByCurrentState,
} from "@/constants/statusTransitions";

export const useStatus = () => {
  const [status, setStatus] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const response = await statusService.getAll();
      console.log("Status cargados:", response.data);
      setStatus(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error al cargar estados:", err);
      setError("Error al cargar estados");
    } finally {
      setLoadingStatus(false);
    }
  };

  // Función para obtener estados para Ficha de Ingreso
  const getFichaIngresoStates = useMemo(() => {
    return (isCreating = false) => {
      const allowedStates = isCreating
        ? ALLOWED_STATES_BY_CONTEXT.ficha_ingreso_creation
        : ALLOWED_STATES_BY_CONTEXT.ficha_ingreso_edition;

      return status.filter((estado) =>
        allowedStates.some((allowed) =>
          estado.name.toLowerCase().includes(allowed.toLowerCase())
        )
      );
    };
  }, [status]);

  // Función para obtener estados para Ficha de Ingreso basado en el estado actual
  const getFichaIngresoStatesWithFlow = useMemo(() => {
    return (isCreating = false, currentStatusId = null) => {
      if (isCreating) {
        // Al crear: permitir "Ingresado" y "Reasignar"
        return status.filter((estado) => {
          const nombreEstado = estado.name.toLowerCase();
          return (
            nombreEstado.includes("ingresado") ||
            nombreEstado.includes("reasignar")
          );
        });
      } else {
        // En modo edición: mostrar estado actual + posibles transiciones
        const currentStatus = status.find((s) => s.id === currentStatusId);
        const currentStatusName = currentStatus?.name || "";

        // Obtener transiciones permitidas usando la función helper
        const allowedTransitions = getTransitionsByCurrentState(
          currentStatusName,
          "ficha_ingreso"
        );

        // Si no se encuentra una regla específica, solo permitir el estado actual
        if (allowedTransitions.length === 0) {
          return currentStatus ? [currentStatus] : [];
        }

        return status.filter((estado) =>
          allowedTransitions.some((allowed) =>
            estado.name.toLowerCase().includes(allowed.toLowerCase())
          )
        );
      }
    };
  }, [status]);

  // Función para obtener estados para Ficha Técnica
  const getFichaTecnicaStates = useMemo(() => {
    return () => {
      const allowedStates = ALLOWED_STATES_BY_CONTEXT.ficha_tecnica;

      return status.filter((estado) =>
        allowedStates.some((allowed) =>
          estado.name.toLowerCase().includes(allowed.toLowerCase())
        )
      );
    };
  }, [status]);

  // Función para obtener estados para Ficha Técnica basado en el estado actual
  const getFichaTecnicaStatesWithFlow = useMemo(() => {
    return (currentStatusId = null) => {
      // En Ficha Técnica no hay modo "creación", siempre es edición
      // En modo edición: mostrar estado actual + posibles transiciones
      const currentStatus = status.find(
        (statu) => statu.id === currentStatusId
      );
      const currentStatusName = currentStatus?.name || "";

      // Obtener transiciones permitidas usando la función helper
      const allowedTransitions = getTransitionsByCurrentState(
        currentStatusName,
        "ficha_tecnica"
      );

      // Si no se encuentra una regla específica, solo permitir el estado actual
      if (allowedTransitions.length === 0) {
        return currentStatus ? [currentStatus] : [];
      }

      return status.filter((estado) =>
        allowedTransitions.some((allowed) =>
          estado.name.toLowerCase().includes(allowed.toLowerCase())
        )
      );
    };
  }, [status]);

  // Función genérica para obtener estados por contexto
  const getStatesByContext = useMemo(() => {
    return (context, isCreating = false) => {
      switch (context) {
        case "ficha_ingreso":
          return getFichaIngresoStates(isCreating);
        case "ficha_tecnica":
          return getFichaTecnicaStates();
        default:
          return status;
      }
    };
  }, [status, getFichaIngresoStates, getFichaTecnicaStates]);

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    status,
    loadingStatus,
    error,
    fetchStatus,
    getFichaIngresoStates,
    getFichaIngresoStatesWithFlow,
    getFichaTecnicaStates,
    getFichaTecnicaStatesWithFlow,
    getStatesByContext,
  };
};
