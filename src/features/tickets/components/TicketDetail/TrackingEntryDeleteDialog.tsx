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
import { useDeleteTrackingEntry } from "../../hooks/useTrackingHistory";

interface TrackingEntryDeleteDialogProps {
  additionalRequestId: number;
  entryId: number;
}

export const TrackingEntryDeleteDialog = ({
  additionalRequestId,
  entryId,
}: TrackingEntryDeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const deleteEntry = useDeleteTrackingEntry(additionalRequestId);

  const handleConfirm = async () => {
    await deleteEntry.mutateAsync(entryId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar evento de seguimiento</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar este evento? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteEntry.isPending}
          >
            {deleteEntry.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
