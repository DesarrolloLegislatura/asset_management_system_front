import type { RouteObject } from "react-router";
import { protect } from "@/shared/auth/guards";
import { PERMISSIONS } from "@/shared/auth/permissions";
import { TicketsPage } from "./pages/TicketsPage";
import { TicketDetail } from "./components/TicketDetail/TicketDetail";
import { TicketForm } from "./components/TicketForm/TicketForm";
import { TicketCatalogAdminPage } from "./pages/TicketCatalogAdminPage";

export const ticketsRoutes: RouteObject[] = [
  {
    path: "tickets",
    element: <TicketsPage />,
    loader: protect(PERMISSIONS.TICKET_VIEW),
  },
  {
    path: "tickets/detail/:id",
    element: <TicketDetail />,
    loader: protect(PERMISSIONS.TICKET_VIEW),
  },
  {
    path: "tickets/new",
    element: <TicketForm />,
    loader: protect(PERMISSIONS.TICKET_CREATE),
  },
  {
    path: "tickets/edit/:id",
    element: <TicketForm />,
    loader: protect(PERMISSIONS.TICKET_EDIT),
  },
  {
    path: "tickets/catalogos",
    element: <TicketCatalogAdminPage />,
    loader: protect(PERMISSIONS.TICKET_CATALOG_MANAGE),
  },
];
