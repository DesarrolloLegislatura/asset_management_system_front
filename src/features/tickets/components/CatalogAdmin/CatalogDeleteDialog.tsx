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
import {
  useDeletePriority,
  useDeleteServiceType,
  useDeleteTaskCategory,
  useDeleteProviderCompany,
} from "../../hooks/useCatalogs";
import { useDeleteTicketStatus } from "../../hooks/useTicketStatuses";

type CatalogResource =
  | "priority"
  | "serviceType"
  | "taskCategory"
  | "providerCompany"
  | "ticketStatus";

interface CatalogDeleteDialogProps {
  resource: CatalogResource;
  id: number;
  label: string;
}

export const CatalogDeleteDialog = ({
  resource,
  id,
  label,
}: CatalogDeleteDialogProps) => {
  const [open, setOpen] = useState(false);

  // Las reglas de hooks exigen llamarlos incondicionalmente; solo se usa el
  // que corresponde a `resource` (fijo durante la vida del componente).
  const deletePriority = useDeletePriority();
  const deleteServiceType = useDeleteServiceType();
  const deleteTaskCategory = useDeleteTaskCategory();
  const deleteProviderCompany = useDeleteProviderCompany();
  const deleteTicketStatus = useDeleteTicketStatus();

  const mutation = {
    priority: deletePriority,
    serviceType: deleteServiceType,
    taskCategory: deleteTaskCategory,
    providerCompany: deleteProviderCompany,
    ticketStatus: deleteTicketStatus,
  }[resource];

  const handleConfirm = async () => {
    await mutation.mutateAsync(id);
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
          <DialogTitle>Eliminar</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar &quot;{label}&quot;? Esta acción
            no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
