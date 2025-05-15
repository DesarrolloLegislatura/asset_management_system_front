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
  const { fichasTecnicas, loading } = useFichaTecnica();
  const { group } = useAuthStore((state) => state.user);
  const [sorting, setSorting] = useState([]);

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      accessorKey: "numero_patrimonio",
      header: "N° de Patrimonio",
    },
    {
      accessorKey: "act_simple",
      header: "Acto Simple",
      cell: ({ row }) => {
        const ficha = row.original;
        const estado = row.getValue("act_simple");
        const anio = ficha.anio_act_simple;
        return <span>{`${estado}/${anio}`}</span>;
      },
    },
    {
      accessorKey: "dependencia_interna.dep_interna",
      header: "Dependencia",
    },
    {
      accessorKey: "fecha_de_ingreso",
      header: "Fecha Ingreso",
    },
    {
      accessorKey: "estado_del_bien",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("estado_del_bien")?.toLowerCase() || "";

        // Mapeo de estados a sus estilos y emojis
        const estadoConfig = {
          "en reparacion": {
            emoji: "🔧",
            label: "En reparación",
            color: "bg-amber-100 text-amber-800 border-amber-200",
          },
          "espera repuestos": {
            emoji: "⏳",
            label: "En espera de repuestos",
            color: "bg-blue-100 text-blue-800 border-blue-200",
          },
          diagnostico: {
            emoji: "🔍",
            label: "Diagnóstico pendiente",
            color: "bg-indigo-100 text-indigo-800 border-indigo-200",
          },
          reparado: {
            emoji: "✅",
            label: "Reparado",
            color: "bg-green-100 text-green-800 border-green-200",
          },
          "listo entregar": {
            emoji: "📦",
            label: "Listo para entregar",
            color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          },
          baja: {
            emoji: "❌",
            label: "Se recomienda baja",
            color: "bg-red-100 text-red-800 border-red-200",
          },
          "reparacion externa": {
            emoji: "🏢",
            label: "En reparación externa",
            color: "bg-purple-100 text-purple-800 border-purple-200",
          },
          ingreso: {
            emoji: "📥",
            label: "Ingreso",
            color: "bg-cyan-100 text-cyan-800 border-cyan-200",
          },
          salida: {
            emoji: "📤",
            label: "Salida",
            color: "bg-teal-100 text-teal-800 border-teal-200",
          },
          retirada: {
            emoji: "🚚",
            label: "Retirada",
            color: "bg-gray-100 text-gray-800 border-gray-200",
          },
        };

        // Simplificamos el estado para la búsqueda (quitando espacios, etc.)
        const estadoSimplificado = estado.replace(/\s+/g, " ").trim();
        console.log(estadoSimplificado);

        // Buscamos coincidencias parciales para mayor flexibilidad
        const coincidencia = Object.keys(estadoConfig).find((key) =>
          estadoSimplificado.includes(key)
        );

        // Si no hay coincidencia, mostramos el estado original
        if (!coincidencia) {
          return <span className="capitalize">{estado}</span>;
        }

        const { emoji, label, color } = estadoConfig[coincidencia];
        console.log(emoji, label, color);

        return (
          <Badge
            variant="outline"
            className={`${color} capitalize whitespace-nowrap px-2 py-1`}
          >
            <span className="mr-1">{emoji}</span>
            {label}
          </Badge>
        );
      },
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
              onClick={() => handleEdit(ficha.id_ficha_tecnica)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePrint(ficha.id_ficha_tecnica)}
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
