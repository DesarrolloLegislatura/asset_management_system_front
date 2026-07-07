import { History } from "lucide-react";
import { useTrackingHistory } from "../../hooks/useTrackingHistory";
import { useTicketStatuses } from "../../hooks/useTicketStatuses";

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
  const { data: entries = [], isLoading } = useTrackingHistory(
    additionalRequestId
  );
  const { data: statuses = [] } = useTicketStatuses();

  const statusName = (id: number | null | undefined) =>
    statuses.find((status) => status.id === id)?.name ?? "—";

  if (isLoading) {
    return (
      <p className="text-xs text-muted-foreground py-2">
        Cargando historial...
      </p>
    );
  }

  if (!entries.length) {
    return (
      <p className="text-xs text-muted-foreground py-2">
        Sin historial de seguimiento.
      </p>
    );
  }

  return (
    <div className="py-2 space-y-2">
      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <History className="h-3 w-3" /> Historial de seguimiento
      </p>
      <ul className="space-y-2 border-l-2 border-muted pl-4">
        {entries.map((entry) => (
          <li key={entry.id} className="text-xs">
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
          </li>
        ))}
      </ul>
    </div>
  );
};
