import { Link } from "react-router";
import { useLocation } from "react-router";
import {
  FileText,
  Printer,
  Home,
  Settings,
  Users,
  BarChart,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Sidebar() {
  const location = useLocation();
  const { group } = useAuthStore((state) => state.user);

  // Helper to check if route is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Link
          to="/"
          className={`flex items-center px-3 py-2 rounded-md text-sm ${
            location.pathname === "/"
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Home className="mr-2 h-4 w-4" />
          Inicio
        </Link>

        <Link
          to="/ficha-tecnica"
          className={`flex items-center px-3 py-2 rounded-md text-sm ${
            isActive("/ficha-tecnica")
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <FileText className="mr-2 h-4 w-4" />
          Fichas Técnicas
        </Link>

        <Link
          to="/ficha-ingreso"
          className={`flex items-center px-3 py-2 rounded-md text-sm ${
            isActive("/ficha-ingreso")
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <FileText className="mr-2 h-4 w-4" />
          Fichas de Ingreso
        </Link>

        <Link
          to="/ficha-toner"
          className={`flex items-center px-3 py-2 rounded-md text-sm ${
            isActive("/ficha-toner")
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Printer className="mr-2 h-4 w-4" />
          Fichas de Toner
        </Link>
      </div>

      {/* Admin section - solo visible para administradores */}
      {group === "Admin" && (
        <div className="pt-4 border-t">
          <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Administración
          </h3>
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive("/dashboard")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Link>

            <Link
              to="/settings"
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive("/settings")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Link>

            <Link
              to="/users"
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive("/users")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Users className="mr-2 h-4 w-4" />
              Usuarios
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
