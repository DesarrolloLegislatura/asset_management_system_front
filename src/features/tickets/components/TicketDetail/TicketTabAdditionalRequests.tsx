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
import { usePermissions } from "@/shared/auth/usePermissions";
import { PERMISSIONS } from "@/shared/auth/permissions";
import { useAdditionalRequestsByTicket } from "../../hooks/useAdditionalRequests";
import { useTicketStatuses } from "../../hooks/useTicketStatuses";
import { usePriorities } from "../../hooks/useCatalogs";
import { TicketRequestFormDialog } from "./TicketRequestFormDialog";
import { TicketRequestDeleteDialog } from "./TicketRequestDeleteDialog";
import { TicketTrackingHistory } from "./TicketTrackingHistory";

interface TicketTabAdditionalRequestsProps {
  ticketId: number;
}

export const TicketTabAdditionalRequests = ({
  ticketId,
}: TicketTabAdditionalRequestsProps) => {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.TICKET_EDIT);
  const { data: requests = [], isLoading } =
    useAdditionalRequestsByTicket(ticketId);
  const { data: statuses = [] } = useTicketStatuses();
  const { data: priorities = [] } = usePriorities();

  const statusName = (id: number | null | undefined) =>
    statuses.find((status) => status.id === id)?.name ?? "Sin estado";
  const priorityName = (id: number | null | undefined) =>
    priorities.find((priority) => priority.id === id)?.name ?? "—";

  return (
    <div className="py-4 space-y-4">
      {canEdit && (
        <div className="flex justify-end">
          <TicketRequestFormDialog
            ticketId={ticketId}
            mode="create"
            trigger={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Nuevo pedido
              </Button>
            }
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Secuencia</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              {canEdit && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center">
                  Cargando pedidos...
                </TableCell>
              </TableRow>
            ) : requests.length ? (
              requests.map((request) => (
                <>
                  <TableRow key={request.id}>
                    <TableCell>{request.sequence}</TableCell>
                    <TableCell>{request.request_description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {statusName(request.request_status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{priorityName(request.priority)}</TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <TicketRequestFormDialog
                            ticketId={ticketId}
                            mode="edit"
                            request={request}
                            trigger={
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <TicketRequestDeleteDialog
                            ticketId={ticketId}
                            requestId={request.id as number}
                            requestLabel={request.request_description}
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow key={`${request.id}-history`}>
                    <TableCell colSpan={canEdit ? 5 : 4} className="bg-muted/20">
                      <TicketTrackingHistory
                        additionalRequestId={request.id as number}
                      />
                    </TableCell>
                  </TableRow>
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={canEdit ? 5 : 4} className="h-20 text-center">
                  No hay pedidos adicionales registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
