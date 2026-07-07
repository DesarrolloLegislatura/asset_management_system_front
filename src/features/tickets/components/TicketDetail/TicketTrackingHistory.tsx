import { History, Pencil, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { usePermissions } from "@/shared/auth/usePermissions";
import { PERMISSIONS } from "@/shared/auth/permissions";
import { useTrackingHistory } from "../../hooks/useTrackingHistory";
import { useTicketStatuses } from "../../hooks/useTicketStatuses";
import { TrackingEntryFormDialog } from "./TrackingEntryFormDialog";
import { TrackingEntryDeleteDialog } from "./TrackingEntryDeleteDialog";

interface TicketTrackingHistoryProps {
  additionalRequestId: number;
}

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const TicketTrackingHistory = ({
  additionalRequestId,
}: TicketTrackingHistoryProps) => {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.TICKET_EDIT);
  const { data: entries = [], isLoading } = useTrackingHistory(
    additionalRequestId
  );
  const { data: statuses = [] } = useTicketStatuses();

  const statusName = (id: number | null | undefined) =>
    statuses.find((status) => status.id === id)?.name ?? "—";

  return (
    <div className="py-2 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <History className="h-3 w-3" /> Historial de seguimiento
        </p>
        {canEdit && (
          <TrackingEntryFormDialog
            additionalRequestId={additionalRequestId}
            mode="create"
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="h-3 w-3 mr-1" /> Registrar evento
              </Button>
            }
          />
        )}
      </div>

      {isLoading ? (
        <p className="text-xs text-muted-foreground py-2">
          Cargando historial...
        </p>
      ) : !entries.length ? (
        <p className="text-xs text-muted-foreground py-2">
          Sin historial de seguimiento.
        </p>
      ) : (
        <ul className="space-y-2 border-l-2 border-muted pl-4">
          {entries.map((entry) => (
            <li key={entry.id} className="text-xs flex justify-between gap-2">
              <div>
                <p className="text-muted-foreground">
                  {formatDateTime(entry.event_date)}
                  {entry.update_source && ` • ${entry.update_source}`}
                </p>
                <p>
                  {statusName(entry.previous_status)} →{" "}
                  <span className="font-medium">
                    {statusName(entry.new_status)}
                  </span>
                </p>
                {entry.comment && (
                  <p className="text-muted-foreground">{entry.comment}</p>
                )}
              </div>
              {canEdit && (
                <div className="flex items-start gap-1 shrink-0">
                  <TrackingEntryFormDialog
                    additionalRequestId={additionalRequestId}
                    mode="edit"
                    entry={entry}
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    }
                  />
                  <TrackingEntryDeleteDialog
                    additionalRequestId={additionalRequestId}
                    entryId={entry.id as number}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
