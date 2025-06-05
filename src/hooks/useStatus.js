import statusService from "@/api/statusService";
import { useEffect, useMemo, useState } from "react";

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
      if (isCreating) {
        // Al crear: solo "Ingreso"
        return status.filter((estado) =>
          estado.name.toLowerCase().includes("ingresado")
        );
      } else {
        // Al editar: Ingreso + estados de finalización
        const allowedStates = [
          "ingresado",
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

  // Función para obtener estados para Ficha de Ingreso basado en el estado actual
  const getFichaIngresoStatesWithFlow = useMemo(() => {
    return (isCreating = false, currentStatusId = null) => {
      if (isCreating) {
        // Al crear: solo "Ingresado"
        return status.filter((estado) =>
          estado.name.toLowerCase().includes("ingresado")
        );
      } else {
        // En modo edición: mostrar estado actual + posibles transiciones
        const currentStatus = status.find((s) => s.id === currentStatusId);
        const currentStatusName = currentStatus?.name.toLowerCase() || "";

        // Definir las transiciones permitidas según el estado actual
        const transitionRules = {
          ingresado: ["ingresado"],
          "en reparación": [
            "en reparación",
            "en espera de repuesto",
            "en espera de repuestos",
            "reparado",
            "se recomienda baja",
          ],
          "en reparacion": [
            "en reparación",
            "en reparacion",
            "en espera de repuesto",
            "en espera de repuestos",
            "reparado",
            "se recomienda baja",
          ],
          "diagnóstico pendiente": [
            "diagnóstico pendiente",
            "diagnostico pendiente",
            "en reparación",
            "en reparacion",
            "se recomienda baja",
          ],
          "diagnostico pendiente": [
            "diagnóstico pendiente",
            "diagnostico pendiente",
            "en reparación",
            "en reparacion",
            "se recomienda baja",
          ],
          "en espera de repuesto": [
            "en espera de repuesto",
            "en espera de repuestos",
            "en reparación",
            "en reparacion",
            "reparado",
          ],
          "en espera de repuestos": [
            "en espera de repuesto",
            "en espera de repuestos",
            "en reparación",
            "en reparacion",
            "reparado",
          ],
          reparado: ["reparado", "listo para retirar", "retirado"],
          "listo para retirar": ["listo para retirar", "retirado"],
          retirado: ["retirado", "finalizado"],
          finalizado: ["finalizado"],
        };

        // Buscar las transiciones permitidas para el estado actual
        let allowedTransitions = [];
        for (const [key, transitions] of Object.entries(transitionRules)) {
          if (currentStatusName.includes(key)) {
            allowedTransitions = transitions;
            break;
          }
        }

        // Si no se encuentra una regla específica, permitir todos los estados de edición
        if (allowedTransitions.length === 0) {
          allowedTransitions = [
            "ingresado",
            "en reparación",
            "en reparacion",
            "diagnóstico pendiente",
            "diagnostico pendiente",
            "en espera de repuesto",
            "en espera de repuestos",
            "reparado",
            "listo para retirar",
            "retirado",
            "finalizado",
            "se recomienda baja",
          ];
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
    loadingStatus,
    error,
    fetchStatus,
    getFichaIngresoStates,
    getFichaIngresoStatesWithFlow,
    getFichaTecnicaStates,
    getStatesByContext,
  };
};
