import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "../ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/authStore";
import { PERMISSIONS } from "@/constants/permissions";

export const FichaListTable = ({
  table,
  columns,
  loading,
  hasActiveFilters,
  clearAllFilters,
  handleCreateFicha,
}) => {
  const { hasPermission } = useAuthStore();
  return (
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
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
  );
};
