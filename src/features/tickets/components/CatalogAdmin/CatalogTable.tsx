import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

export interface CatalogColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface CatalogTableProps<T extends { id?: number }> {
  columns: CatalogColumn<T>[];
  rows: T[];
  isLoading: boolean;
  emptyMessage: string;
  renderActions?: (row: T) => ReactNode;
}

export function CatalogTable<T extends { id?: number }>({
  columns,
  rows,
  isLoading,
  emptyMessage,
  renderActions,
}: CatalogTableProps<T>) {
  const columnCount = columns.length + (renderActions ? 1 : 0);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
            {renderActions && (
              <TableHead className="text-right">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-20 text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.render(row)}</TableCell>
                ))}
                {renderActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {renderActions(row)}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-20 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
