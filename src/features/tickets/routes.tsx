import type { RouteObject } from "react-router";
import { TicketsPage } from "./pages/TicketsPage";

export const ticketsRoutes: RouteObject[] = [
  {
    path: "tickets",
    element: <TicketsPage />,
  },
];
