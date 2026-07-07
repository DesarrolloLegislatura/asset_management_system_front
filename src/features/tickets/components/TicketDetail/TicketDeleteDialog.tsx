import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useDeleteTicket } from "../../hooks/useTickets";

interface TicketDeleteDialogProps {
  ticketId: number;
  ticketTitle: string;
  onDeleted: () => void;
}

export const TicketDeleteDialog = ({
  ticketId,
  ticketTitle,
  onDeleted,
}: TicketDeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const deleteTicket = useDeleteTicket();

  const handleConfirm = async () => {
    await deleteTicket.mutateAsync(ticketId);
    setOpen(false);
    onDeleted();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar ticket</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar &quot;{ticketTitle}&quot;? Esta
            acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteTicket.isPending}
          >
            {deleteTicket.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
