import { useState, useMemo } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Edit, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS, USER_GROUPS } from "@/constants/permissions";
import { FichaListPaginate } from "./FichaListPaginate";
import { FichaListTable } from "./FichaListTable";
import { FichaListFilter } from "./FichaListFilter";

const TECNICO_STATUSES = ["INGRESADO"];

const ADMINISTRATIVO_STATUSES = ["REPARADO", "INGRESADO"];

export const FichaList = () => {
  const navigate = useNavigate();
  const { fichasTecnicas, loading, refreshData } = useFichaTecnica(true);

  const { userGroup, hasPermission } = usePermission();
  const [sorting, setSorting] = useState([
    { id: "status", desc: false },
    { id: "date_in", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Cambiar valor inicial
  const [fichaNumberFilter, setFichaNumberFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("all"); // NUEVO: Filtro por área

  // Función helper para obtener el estado actual de una ficha de forma segura
  const getCurrentStatus = (ficha) => {
    if (
      ficha.status_users &&
      Array.isArray(ficha.status_users) &&
      ficha.status_users.length > 0 &&
      ficha.status_users[0].status &&
      ficha.status_users[0].status.name
    ) {
      return ficha.status_users[0].status.name;
    }
    return null;
  };

  // Obtener estados únicos de las fichas para el select
  const availableStatuses = useMemo(() => {
    if (!fichasTecnicas) return [];

    const statusSet = new Set();
    fichasTecnicas.forEach((ficha) => {
      const status = getCurrentStatus(ficha);
      if (status) {
        statusSet.add(status);
      }
    });

    return Array.from(statusSet).sort();
  }, [fichasTecnicas]);

  // NUEVO: Obtener áreas únicas de las fichas para el select
  const availableAreas = useMemo(() => {
    if (!fichasTecnicas) return [];

    const areaSet = new Set();
    fichasTecnicas.forEach((ficha) => {
      const areaName = ficha.asset?.area?.name;
      if (areaName) {
        areaSet.add(areaName);
      }
    });

    return Array.from(areaSet).sort();
  }, [fichasTecnicas]);

  // Filtrar datos manualmente por inventario y status
  const filteredData = useMemo(() => {
    if (!fichasTecnicas) return [];

    let filtered = fichasTecnicas;

    // Filtrar por número de ficha
    if (fichaNumberFilter.trim() !== "") {
      filtered = filtered.filter((ficha) => {
        const fichaId = String(ficha.id).toLowerCase();
        const filterStr = fichaNumberFilter.toLowerCase();
        return fichaId.includes(filterStr);
      });
    }

    // Filtrar por inventario
    if (inventoryFilter.trim() !== "") {
      filtered = filtered.filter((ficha) => {
        const inventory = ficha.asset?.inventory;

        if (inventory === null || inventory === undefined) {
          return false;
        }

        try {
          const inventoryStr = String(inventory).toLowerCase();
          const filterStr = inventoryFilter.toLowerCase();
          return inventoryStr.includes(filterStr);
        } catch (error) {
          console.warn("Error al filtrar por inventario:", error, ficha);
          return false;
        }
      });
    }

    // Filtrar por status con validación
    if (statusFilter !== "all") {
      filtered = filtered.filter((ficha) => {
        const statusName = getCurrentStatus(ficha);
        return statusName === statusFilter;
      });
    }

    // NUEVO: Filtrar por área
    if (areaFilter !== "all") {
      filtered = filtered.filter((ficha) => {
        const areaName = ficha.asset?.area?.name;
        return areaName === areaFilter;
      });
    }

    return filtered;
  }, [
    fichasTecnicas,
    inventoryFilter,
    statusFilter,
    fichaNumberFilter,
    areaFilter,
  ]);

  const columns = [
    {
      accessorKey: "id",
      header: "N° de Ficha",
    },
    {
      accessorKey: "asset.inventory",
      id: "asset.inventory",
      header: "N° de Inventario",
    },

    {
      accessorKey: "asset.typeasset.name",
      header: "Tipo de Equipo",
    },
    {
      accessorKey: "date_in",
      header: "Fecha Ingreso",
      cell: ({ row }) => {
        const date = row.original.date_in;
        if (!date) return "Sin fecha";

        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
      },
    },
    {
      accessorFn: (row) => getCurrentStatus(row) || "",
      id: "status",
      header: "Estado",
      cell: ({ row }) => {
        const ficha = row.original;
        const statusName = getCurrentStatus(ficha);
        const estado = statusName ? statusName.toUpperCase() : "SIN ESTADO";

        const getStatusStyles = (status) => {
          switch (status) {
            case "INGRESO":
            case "INGRESADO":
              return "bg-blue-50 text-blue-600 border-blue-200";
            case "EN REPARACIÓN":
            case "EN REPARACION":
              return "bg-purple-50 text-purple-600 border-purple-200";
            case "SALIDA":
              return "bg-green-50 text-green-600 border-green-200";
            case "RETIRADO":
              return "bg-orange-50 text-orange-600 border-orange-200";
            case "LISTO PARA RETIRAR":
              return "bg-teal-50 text-teal-600 border-teal-200";
            case "FINALIZADO":
              return "bg-emerald-50 text-emerald-600 border-emerald-200";
            case "REPARADO":
              return "bg-lime-50 text-lime-600 border-lime-200";
            case "DIAGNÓSTICO PENDIENTE":
            case "DIAGNOSTICO PENDIENTE":
              return "bg-yellow-50 text-yellow-600 border-yellow-200";
            case "EN ESPERA DE REPUESTO":
            case "EN ESPERA DE REPUESTOS":
              return "bg-amber-50 text-amber-600 border-amber-200";
            case "SE RECOMIENDA BAJA":
            case "SIN REPARACIÓN":
            case "SIN REPARACION":
              return "bg-red-50 text-red-600 border-red-200";
            case "EN REPARACIÓN EXTERNA":
            case "EN REPARACION EXTERNA":
              return "bg-indigo-50 text-indigo-600 border-indigo-200";
            default:
              return "bg-gray-50 text-gray-600 border-gray-200";
          }
        };

        return (
          <Badge
            variant="outline"
            className={`capitalize whitespace-nowrap px-3 py-1.5 text-xs font-medium ${getStatusStyles(
              estado
            )}`}
          >
            {estado}
          </Badge>
        );
      },
      sortingFn: (rowA, rowB) => {
        const statusA = getCurrentStatus(rowA.original);
        const statusB = getCurrentStatus(rowB.original);

        const statusAUpper = statusA ? statusA.toUpperCase() : "";
        const statusBUpper = statusB ? statusB.toUpperCase() : "";

        const getPriority = (status) => {
          if (userGroup === USER_GROUPS.TECNICO) {
            return TECNICO_STATUSES.includes(status) ? 0 : 1;
          }
          if (userGroup === USER_GROUPS.ADMINISTRATIVO) {
            return ADMINISTRATIVO_STATUSES.includes(status) ? 0 : 1;
          }
          return 0;
        };

        const priorityA = getPriority(statusAUpper);
        const priorityB = getPriority(statusBUpper);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        return 0;
      },
    },
    {
      accessorKey: "asset.area.name",
      header: "Área",
    },

    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const ficha = row.original;
        return (
          <div className="flex gap-1">
            {/* Botón Ver - Todos pueden ver detalles */}
            {hasPermission(PERMISSIONS.FICHA_INGRESO_VIEW) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleView(ficha.id)}
                title="Ver detalle"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}

            {/* Botón Editar - Según el grupo del usuario */}
            {renderEditButton(ficha.id)}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  });

  // Función para limpiar el filtro de número de ficha
  const clearFichaNumberFilter = () => {
    setFichaNumberFilter("");
  };

  // Función para limpiar el filtro de inventario
  const clearInventoryFilter = () => {
    setInventoryFilter("");
  };

  // Función para limpiar el filtro de status
  const clearStatusFilter = () => {
    setStatusFilter("all"); // Cambiar a "all"
  };

  // NUEVO: Función para limpiar el filtro de área
  const clearAreaFilter = () => {
    setAreaFilter("all");
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setInventoryFilter("");
    setStatusFilter("all"); // Cambiar a "all"
    setFichaNumberFilter("");
    setAreaFilter("all"); // NUEVO: Limpiar filtro de área
  };

  // Verificar si hay filtros activos - Actualizar lógica
  const hasActiveFilters =
    inventoryFilter.trim() !== "" ||
    statusFilter !== "all" ||
    fichaNumberFilter.trim() !== "" ||
    areaFilter !== "all"; // NUEVO: Incluir filtro de área

  // Función para renderizar el botón de editar según permisos
  const renderEditButton = (fichaId) => {
    // Administradores: pueden editar fichas técnicas
    if (
      userGroup === USER_GROUPS.ADMINISTRADOR &&
      hasPermission(PERMISSIONS.TECHNICAL_SHEET_EDIT)
    ) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/ficha-tecnica/${fichaId}`)}
          title="Editar como Ficha Técnica"
        >
          <Edit className="h-4 w-4" />
        </Button>
      );
    }

    // Técnicos: pueden editar fichas técnicas
    if (
      userGroup === USER_GROUPS.TECNICO &&
      hasPermission(PERMISSIONS.TECHNICAL_SHEET_EDIT)
    ) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/ficha-tecnica/${fichaId}`)}
          title="Editar como Ficha Técnica"
        >
          <Edit className="h-4 w-4" />
        </Button>
      );
    }

    // Administrativos: pueden editar fichas de ingreso
    if (
      userGroup === USER_GROUPS.ADMINISTRATIVO &&
      hasPermission(PERMISSIONS.FICHA_INGRESO_EDIT)
    ) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/ficha-ingreso/${fichaId}`)}
          title="Editar Ficha de Ingreso"
        >
          <Edit className="h-4 w-4" />
        </Button>
      );
    }

    return null;
  };

  // Determinar la ruta para crear nueva ficha según el grupo del usuario
  const handleCreateFicha = () => {
    if (hasPermission(PERMISSIONS.FICHA_INGRESO_CREATE)) {
      navigate("/ficha-ingreso");
    } else {
      navigate("/unauthorized");
    }
  };

  // Ver detalle de ficha
  const handleView = (id) => {
    if (userGroup === USER_GROUPS.TECNICO) {
      navigate(`/ficha-tecnica/detail/${id}`);
    } else if (userGroup === USER_GROUPS.ADMINISTRATIVO) {
      navigate(`/ficha-ingreso/detail/${id}`);
    } else if (userGroup === USER_GROUPS.ADMINISTRADOR) {
      navigate(`/ficha-ingreso/detail/${id}`);
    }
  };

  return (
    // max-h-dvh
    <div className="max-w-6xl mx-auto overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Lista de Fichas de Ingreso
        </h2>
      </div>

      <div className="shadow-sm rounded-lg p-6 form-container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {hasPermission(PERMISSIONS.FICHA_INGRESO_CREATE) && (
              <Button
                onClick={handleCreateFicha}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Crear Nueva Ficha
              </Button>
            )}
          </div>
        </div>
        <FichaListFilter
          hasActiveFilters={hasActiveFilters}
          clearAllFilters={clearAllFilters}
          inventoryFilter={inventoryFilter}
          setInventoryFilter={setInventoryFilter}
          clearInventoryFilter={clearInventoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          clearStatusFilter={clearStatusFilter}
          availableStatuses={availableStatuses}
          filteredData={filteredData}
          fichaNumberFilter={fichaNumberFilter}
          setFichaNumberFilter={setFichaNumberFilter}
          clearFichaNumberFilter={clearFichaNumberFilter}
          areaFilter={areaFilter}
          setAreaFilter={setAreaFilter}
          clearAreaFilter={clearAreaFilter}
          availableAreas={availableAreas}
        />

        <FichaListTable
          table={table}
          columns={columns}
          loading={loading}
          hasActiveFilters={hasActiveFilters}
          clearAllFilters={clearAllFilters}
          handleCreateFicha={handleCreateFicha}
          hasPermission={hasPermission}
          refreshData={refreshData}
        />

        <FichaListPaginate
          table={table}
          filteredData={filteredData}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </div>
  );
};
