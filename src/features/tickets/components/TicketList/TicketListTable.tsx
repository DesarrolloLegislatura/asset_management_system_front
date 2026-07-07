import type { Table as TableInstance } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { usePermissions } from "@/shared/auth/usePermissions";
import { PERMISSIONS } from "@/shared/auth/permissions";
import type { Ticket } from "../../types";

interface TicketListTableProps {
  table: TableInstance<Ticket>;
  columnsCount: number;
  isLoading: boolean;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  onCreateTicket: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TicketListTable = ({
  table,
  columnsCount,
  isLoading,
  hasActiveFilters,
  clearAllFilters,
  onCreateTicket,
  onRefresh,
  isRefreshing,
}: TicketListTableProps) => {
  const { hasPermission } = usePermissions();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {isRefreshing ? "Actualizando..." : "Datos actualizados"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="text-sm bg-muted/50 font-medium text-muted-foreground border-b border-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1 justify-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="text-xs">
                          {{
                            asc: <ArrowUp size={12} />,
                            desc: <ArrowDown size={12} />,
                          }[header.column.getIsSorted() as string] ?? ""}
                        </span>
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columnsCount} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                    Cargando tickets...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-blue-500/10 text-center"
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
                <TableCell colSpan={columnsCount} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {hasActiveFilters ? (
                      <>
                        <p className="text-muted-foreground">
                          No se encontraron tickets con los filtros aplicados.
                        </p>
                        <Button variant="outline" onClick={clearAllFilters}>
                          Limpiar filtros
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground">
                          No se encontraron tickets.
                        </p>
                        {hasPermission(PERMISSIONS.TICKET_CREATE) && (
                          <Button variant="outline" onClick={onCreateTicket}>
                            Crear el primer ticket
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
