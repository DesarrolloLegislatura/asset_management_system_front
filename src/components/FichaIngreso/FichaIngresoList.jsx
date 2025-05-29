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
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";

export function FichaIngresoList() {
  const navigate = useNavigate();
  const { fichasTecnicas, loading } = useFichaTecnica(true);
  const { group } = useAuthStore((state) => state.user);
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
              return "bg-purple-50 text-purple-600 border-purple-200";
            case "SALIDA":
              return "bg-green-50 text-green-600 border-green-200";
            case "PENDIENTE":
              return "bg-pink-50 text-pink-600 border-pink-200";
            case "COMPLETADO":
              return "bg-teal-50 text-teal-600 border-teal-200";
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
      cell: ({ row }) => {
        const ficha = row.original;
        return (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(ficha.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePrint(ficha.id)}
            >
              <Printer className="h-4 w-4" />
            </Button>
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

  // Obtener información del usuario logueado
  const user = useAuthStore((state) => state.user);

  // Determinar la ruta según el grupo del usuario
  const handleCreateFicha = () => {
    // Obtener el grupo del usuario, manejar tanto array como string
    const userGroup = Array.isArray(user.group) ? user.group : [user.group];

    if (userGroup.includes("Tecnico")) {
      navigate("/ficha-ingreso/detail/${id}");
    } else if (userGroup.includes("Administrativo")) {
      navigate("/ficha-ingreso/");
    } else if (userGroup.includes("Admin")) {
      // Los administradores pueden elegir (opcional)
      // navigate("/seleccionar-tipo-ficha/");
      navigate("/ficha-tecnica/");
    } else {
      // Por defecto, ir a la página de no autorizado
      navigate("/unauthorized");
    }
  };
  const handleEdit = (id) => {
    console.log("Editar ficha:", id);
    console.log("Grupo del usuario:", group);
    if (group === "Tecnico") {
      navigate(`/ficha-tecnica/${id}`);
    } else if (group === "Administrativo") {
      navigate(`/ficha-ingreso/${id}`);
    } else if (group === "Admin") {
      navigate(`/ficha-tecnica/${id}`);
    }
  };
  const handlePrint = (id) => {
    console.log("Editar ficha:", id);
    console.log("Grupo del usuario:", group);
    if (group === "Tecnico") {
      navigate(`/ficha-tecnica/${id}`);
    } else if (group === "Administrativo") {
      navigate(`/ficha-ingreso/detail/${id}`);
    } else if (group === "Admin") {
      navigate(`/ficha-ingreso/detail/${id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto max-h-dvw overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6">Listado Ficha Tecnica </h2>
      <div className=" bg-white shadow-sm rounded-md p-3">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button className="bg-primary" onClick={handleCreateFicha}>
              Crear Ficha
            </Button>
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
                        <div className="flex items-center  gap-1">
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
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`transition-colors hover:bg-gray-50 ${
                      Number(row.id) % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
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
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-3 mt-4 sm:mt-6">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1.5 sm:py-2 text-sm sm:text-base text-black-600 hover:text-black-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft color="#2563eb" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1.5 sm:py-2 text-sm sm:text-base text-black-600 hover:text-black-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft color="#2563eb" />
            </button>
          </div>

          <span className="text-sm sm:text-base text-gray-600">
            Página{" "}
            <span className="font-semibold text-black-600">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-black-600">
              {" "}
              {table.getPageCount()}
            </span>
          </span>
          <span className="text-sm sm:text-base text-gray-600">
            Total de Fichas:{" "}
            <span className="font-semibold text-black-600">
              {table.getRowCount()}
            </span>
          </span>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1.5 sm:py-2 text-sm sm:text-base text-black-600 hover:text-black-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight color="#2563eb" />
            </button>
            <button
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1.5 sm:py-2 text-sm sm:text-base text-black-600 hover:text-black-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight color="#2563eb" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
