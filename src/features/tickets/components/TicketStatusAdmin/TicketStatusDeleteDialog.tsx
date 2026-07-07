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
import { useDeleteTicketStatus } from "../../hooks/useTicketStatuses";

interface TicketStatusDeleteDialogProps {
  statusId: number;
  statusName: string;
}

export const TicketStatusDeleteDialog = ({
  statusId,
  statusName,
}: TicketStatusDeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const deleteStatus = useDeleteTicketStatus();

  const handleConfirm = async () => {
    await deleteStatus.mutateAsync(statusId);
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
          <DialogTitle>Eliminar estado</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar el estado &quot;{statusName}&quot;?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteStatus.isPending}
          >
            {deleteStatus.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
