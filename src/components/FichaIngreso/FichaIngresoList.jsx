import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Printer,
  Eye,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS, USER_GROUPS } from "@/constants/permissions";

export function FichaIngresoList() {
  const navigate = useNavigate();
  const { fichasTecnicas, loading } = useFichaTecnica(true);
  const { userGroup, hasPermission } = usePermission();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      accessorKey: "id",
      header: "N° de Ficha",
    },
    {
      accessorKey: "asset.inventory",
      header: "N° de Patrimonio",
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
      accessorKey: "status.name",
      header: "Estado",
      cell: ({ row }) => {
        const ficha = row.original;
        const estado = ficha.status[0]?.name?.toUpperCase() || "";

        const getStatusStyles = (status) => {
          switch (status) {
            case "INGRESO":
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
            className={`capitalize whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyles(
              estado
            )}`}
          >
            {estado}
          </Badge>
        );
      },
    },
    {
      accessorKey: "asset.area.name",
      header: "Área",
    },
    {
      accessorKey: "asset.building.name",
      header: "Edificio",
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

            {/* Botón Imprimir/Ver - Todos pueden imprimir */}
            {hasPermission(PERMISSIONS.FICHA_INGRESO_VIEW) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePrint(ficha.id)}
                title="Imprimir"
              >
                <Printer className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: fichasTecnicas || [],
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

  // Función para imprimir (redirige al detalle)
  const handlePrint = (id) => {
    navigate(`/ficha-ingreso/detail/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto max-h-dvh overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Gestión de Fichas de Ingreso
        </h2>
        <p className="text-sm text-muted-foreground">
          Grupo actual: <span className="font-medium">{userGroup}</span>
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
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
          <div className="text-sm text-muted-foreground">
            {userGroup === USER_GROUPS.ADMINISTRADOR && "Acceso completo"}
            {userGroup === USER_GROUPS.TECNICO && "Edición técnica disponible"}
            {userGroup === USER_GROUPS.ADMINISTRATIVO &&
              "Edición administrativa"}
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <span className="text-xs">
                            {{
                              asc: <ArrowUp color="#4e545f" size={12} />,
                              desc: <ArrowDown color="#4e545f" size={12} />,
                            }[header.column.getIsSorted()] || ""}
                          </span>
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Cargando fichas...
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="transition-colors hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">
                        No se encontraron fichas.
                      </p>
                      {hasPermission(PERMISSIONS.FICHA_INGRESO_CREATE) && (
                        <Button variant="outline" onClick={handleCreateFicha}>
                          Crear la primera ficha
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              Página{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              de <span className="font-medium">{table.getPageCount()}</span>
            </span>
            <span className="text-muted-foreground">
              Total: <span className="font-medium">{table.getRowCount()}</span>{" "}
              fichas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
