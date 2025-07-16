import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "../ui/table";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS } from "@/constants/permissions";

export const FichaListTable = ({
  table,
  columns,
  loading,
  hasActiveFilters,
  clearAllFilters,
  handleCreateFicha,
  refreshData,
}) => {
  const { hasPermission } = usePermission();
  return (
    <div className="space-y-4">
      {/* Header con botón de refresco */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {loading ? "Actualizando..." : "Datos actualizados"}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="text-sm bg-muted/50 font-medium text-muted-foreground border-b border-muted cursor-pointer">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className=""
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1 text-center justify-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="text-xs">
                          {{
                            asc: <ArrowUp size={12} />,
                            desc: <ArrowDown size={12} />,
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
                  className="transition-colors hover:bg-blue-500/50 text-center items-center justify-center"
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
                    {hasActiveFilters ? (
                      <>
                        <p className="text-muted-foreground">
                          No se encontraron fichas con los filtros aplicados.
                        </p>
                        <Button variant="outline" onClick={clearAllFilters}>
                          Limpiar filtros
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground">
                          No se encontraron fichas.
                        </p>
                        {hasPermission(PERMISSIONS.FICHA_INGRESO_CREATE) && (
                          <Button variant="outline" onClick={handleCreateFicha}>
                            Crear la primera ficha
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
