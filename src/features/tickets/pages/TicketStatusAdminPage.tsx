import { Plus, Pencil } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { useTicketStatuses } from "../hooks/useTicketStatuses";
import { TicketStatusFormDialog } from "../components/TicketStatusAdmin/TicketStatusFormDialog";
import { TicketStatusDeleteDialog } from "../components/TicketStatusAdmin/TicketStatusDeleteDialog";

export const TicketStatusAdminPage = () => {
  const { data: statuses = [], isLoading } = useTicketStatuses();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Estados de Ticket
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administración del catálogo de estados
          </p>
        </div>
        <TicketStatusFormDialog
          mode="create"
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Nuevo estado
            </Button>
          }
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Cargando estados...
                </TableCell>
              </TableRow>
            ) : statuses.length ? (
              statuses.map((status) => (
                <TableRow key={status.id}>
                  <TableCell>{status.code}</TableCell>
                  <TableCell>{status.name}</TableCell>
                  <TableCell>{status.description || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={status.active ? "default" : "outline"}>
                      {status.active ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <TicketStatusFormDialog
                        mode="edit"
                        status={status}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <TicketStatusDeleteDialog
                        statusId={status.id as number}
                        statusName={status.name}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay estados registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
