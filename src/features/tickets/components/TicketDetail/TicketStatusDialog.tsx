import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useChangeTicketStatus } from "../../hooks/useTickets";
import type { Ticket, TicketStatus } from "../../types";

interface TicketStatusDialogProps {
  ticket: Ticket;
  statuses: TicketStatus[];
}

export const TicketStatusDialog = ({
  ticket,
  statuses,
}: TicketStatusDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    ticket.global_status ? String(ticket.global_status) : ""
  );
  const changeStatus = useChangeTicketStatus();

  const handleConfirm = async () => {
    if (!selectedStatus) return;
    await changeStatus.mutateAsync({
      id: ticket.id as number,
      globalStatus: Number(selectedStatus),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Cambiar estado
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar estado del ticket</DialogTitle>
        </DialogHeader>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={String(status.id)}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedStatus || changeStatus.isPending}
          >
            {changeStatus.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
