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
import { useDeleteAdditionalRequest } from "../../hooks/useAdditionalRequests";

interface TicketRequestDeleteDialogProps {
  ticketId: number;
  requestId: number;
  requestLabel: string;
}

export const TicketRequestDeleteDialog = ({
  ticketId,
  requestId,
  requestLabel,
}: TicketRequestDeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const deleteRequest = useDeleteAdditionalRequest(ticketId);

  const handleConfirm = async () => {
    await deleteRequest.mutateAsync(requestId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar pedido adicional</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar &quot;{requestLabel}&quot;? Esta
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
            disabled={deleteRequest.isPending}
          >
            {deleteRequest.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
