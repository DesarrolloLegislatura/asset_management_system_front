import statusService from "@/api/statusService";
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

  // Función para obtener estados para Ficha de Ingreso
  const getFichaIngresoStates = useMemo(() => {
    return (isCreating = false) => {
      if (isCreating) {
        // Al crear: solo "Ingreso"
        return status.filter((estado) =>
          estado.name.toLowerCase().includes("ingreso")
        );
      } else {
        // Al editar: Ingreso + estados de finalización
        const allowedStates = [
          "ingreso",
          "retirado",
          "listo para retirar",
          "salida",
          "finalizado",
        ];

        return status.filter((estado) =>
          allowedStates.some((allowed) =>
            estado.name.toLowerCase().includes(allowed.toLowerCase())
          )
        );
      }
    };
  }, [status]);

  // Función para obtener estados para Ficha Técnica
  const getFichaTecnicaStates = useMemo(() => {
    return () => {
      const allowedStates = [
        "en reparación",
        "en reparacion", // variante sin tilde
        "en espera de repuesto",
        "en espera de repuestos", // variante plural
        "diagnóstico pendiente",
        "diagnostico pendiente", // variante sin tilde
        "reparado",
        "se recomienda baja",
        "en reparación externa",
        "en reparacion externa", // variante sin tilde
      ];

      return status.filter((estado) =>
        allowedStates.some((allowed) =>
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
    loading,
    error,
    fetchStatus,
    getFichaIngresoStates,
    getFichaTecnicaStates,
    getStatesByContext,
  };
};
