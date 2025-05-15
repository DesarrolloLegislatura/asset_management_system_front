import { Link } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, FilePenLine } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/login", { replace: true });
  };

  return (
    <nav className="bg-background border-b h-16 flex items-center px-4 fixed w-full z-50">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold">
              <FilePenLine />
            </span>
          </div>
          <h1 className="text-xl font-bold hidden md:block">
            Sistema de Fichas
          </h1>
        </Link>

        {/* Central Space - puede usarse para navegación o búsqueda */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/ficha-tecnica"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Fichas Técnicas
          </Link>
          <Link
            to="/ficha-ingreso"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Fichas de Ingreso
          </Link>
          <Link
            to="/ficha-toner"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Toner
          </Link>
        </div>

        {/* User Menu & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* User Info (visible en desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User size={16} className="text-muted-foreground" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{user?.name || user?.username}</div>
              <div className="text-xs text-muted-foreground">{user?.group}</div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle>Menú</SheetTitle>
                <SheetDescription>
                  Navegación y opciones de usuario
                </SheetDescription>
              </SheetHeader>

              <div className="px-6 py-4">
                {/* User Info en Mobile */}
                <div className="flex items-center gap-4 mb-6 md:hidden">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {user?.name?.charAt(0) ||
                        user?.username?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {user?.name || user?.username}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user?.group}
                    </div>
                  </div>
                </div>

                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Logout Button */}
                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
