import { Plus, Pencil } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import {
  usePriorities,
  useServiceTypes,
  useTaskCategories,
  useProviderCompanies,
} from "../hooks/useCatalogs";
import { useTicketStatuses } from "../hooks/useTicketStatuses";
import { CatalogTable, type CatalogColumn } from "../components/CatalogAdmin/CatalogTable";
import { PriorityFormDialog } from "../components/CatalogAdmin/PriorityFormDialog";
import { SimpleCatalogFormDialog } from "../components/CatalogAdmin/SimpleCatalogFormDialog";
import { ProviderCompanyFormDialog } from "../components/CatalogAdmin/ProviderCompanyFormDialog";
import { TicketStatusFormDialog } from "../components/CatalogAdmin/TicketStatusFormDialog";
import { CatalogDeleteDialog } from "../components/CatalogAdmin/CatalogDeleteDialog";
import type {
  Priority,
  ServiceType,
  TaskCategory,
  ProviderCompany,
  TicketStatus,
} from "../types";

export const TicketCatalogAdminPage = () => {
  const { data: priorities = [], isLoading: loadingPriorities } = usePriorities();
  const { data: serviceTypes = [], isLoading: loadingServiceTypes } = useServiceTypes();
  const { data: taskCategories = [], isLoading: loadingTaskCategories } = useTaskCategories();
  const { data: companies = [], isLoading: loadingCompanies } = useProviderCompanies();
  const { data: statuses = [], isLoading: loadingStatuses } = useTicketStatuses();

  const statusColumns: CatalogColumn<TicketStatus>[] = [
    { key: "code", header: "Código", render: (row) => row.code },
    { key: "name", header: "Nombre", render: (row) => row.name },
    {
      key: "description",
      header: "Descripción",
      render: (row) => row.description || "—",
    },
    {
      key: "active",
      header: "Activo",
      render: (row) => (
        <Badge variant={row.active ? "default" : "outline"}>
          {row.active ? "Sí" : "No"}
        </Badge>
      ),
    },
  ];

  const priorityColumns: CatalogColumn<Priority>[] = [
    { key: "name", header: "Nombre", render: (row) => row.name },
    { key: "code", header: "Código", render: (row) => row.code },
    {
      key: "active",
      header: "Activo",
      render: (row) => (
        <Badge variant={row.active ? "default" : "outline"}>
          {row.active ? "Sí" : "No"}
        </Badge>
      ),
    },
  ];

  const nameColumns = <T extends { name: string }>(): CatalogColumn<T>[] => [
    { key: "name", header: "Nombre", render: (row) => row.name },
  ];

  const companyColumns: CatalogColumn<ProviderCompany>[] = [
    { key: "name", header: "Nombre", render: (row) => row.name },
    {
      key: "contact_name",
      header: "Contacto",
      render: (row) => row.contact_name || "—",
    },
    {
      key: "contact_email",
      header: "Email",
      render: (row) => row.contact_email || "—",
    },
    {
      key: "active",
      header: "Activo",
      render: (row) => (
        <Badge variant={row.active ? "default" : "outline"}>
          {row.active ? "Sí" : "No"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Catálogos de Tickets</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administración de estados, prioridades, tipos de servicio, categorías y empresas
        </p>
      </div>

      <Tabs defaultValue="statuses">
        <TabsList>
          <TabsTrigger value="statuses">Estados</TabsTrigger>
          <TabsTrigger value="priorities">Prioridades</TabsTrigger>
          <TabsTrigger value="serviceTypes">Tipos de servicio</TabsTrigger>
          <TabsTrigger value="taskCategories">Categorías</TabsTrigger>
          <TabsTrigger value="companies">Empresas</TabsTrigger>
        </TabsList>

        <TabsContent value="statuses" className="py-4 space-y-4">
          <div className="flex justify-end">
            <TicketStatusFormDialog
              mode="create"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Nuevo estado
                </Button>
              }
            />
          </div>
          <CatalogTable<TicketStatus>
            columns={statusColumns}
            rows={statuses}
            isLoading={loadingStatuses}
            emptyMessage="No hay estados registrados."
            renderActions={(row) => (
              <>
                <TicketStatusFormDialog
                  mode="edit"
                  status={row}
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <CatalogDeleteDialog
                  resource="ticketStatus"
                  id={row.id as number}
                  label={row.name}
                />
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="priorities" className="py-4 space-y-4">
          <div className="flex justify-end">
            <PriorityFormDialog
              mode="create"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Nueva prioridad
                </Button>
              }
            />
          </div>
          <CatalogTable<Priority>
            columns={priorityColumns}
            rows={priorities}
            isLoading={loadingPriorities}
            emptyMessage="No hay prioridades registradas."
            renderActions={(row) => (
              <>
                <PriorityFormDialog
                  mode="edit"
                  priority={row}
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <CatalogDeleteDialog
                  resource="priority"
                  id={row.id as number}
                  label={row.name}
                />
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="serviceTypes" className="py-4 space-y-4">
          <div className="flex justify-end">
            <SimpleCatalogFormDialog
              resource="serviceType"
              mode="create"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Nuevo tipo de servicio
                </Button>
              }
            />
          </div>
          <CatalogTable<ServiceType>
            columns={nameColumns<ServiceType>()}
            rows={serviceTypes}
            isLoading={loadingServiceTypes}
            emptyMessage="No hay tipos de servicio registrados."
            renderActions={(row) => (
              <>
                <SimpleCatalogFormDialog
                  resource="serviceType"
                  mode="edit"
                  item={row}
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <CatalogDeleteDialog
                  resource="serviceType"
                  id={row.id as number}
                  label={row.name}
                />
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="taskCategories" className="py-4 space-y-4">
          <div className="flex justify-end">
            <SimpleCatalogFormDialog
              resource="taskCategory"
              mode="create"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Nueva categoría
                </Button>
              }
            />
          </div>
          <CatalogTable<TaskCategory>
            columns={nameColumns<TaskCategory>()}
            rows={taskCategories}
            isLoading={loadingTaskCategories}
            emptyMessage="No hay categorías registradas."
            renderActions={(row) => (
              <>
                <SimpleCatalogFormDialog
                  resource="taskCategory"
                  mode="edit"
                  item={row}
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <CatalogDeleteDialog
                  resource="taskCategory"
                  id={row.id as number}
                  label={row.name}
                />
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="companies" className="py-4 space-y-4">
          <div className="flex justify-end">
            <ProviderCompanyFormDialog
              mode="create"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Nueva empresa
                </Button>
              }
            />
          </div>
          <CatalogTable<ProviderCompany>
            columns={companyColumns}
            rows={companies}
            isLoading={loadingCompanies}
            emptyMessage="No hay empresas registradas."
            renderActions={(row) => (
              <>
                <ProviderCompanyFormDialog
                  mode="edit"
                  company={row}
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <CatalogDeleteDialog
                  resource="providerCompany"
                  id={row.id as number}
                  label={row.name}
                />
              </>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
