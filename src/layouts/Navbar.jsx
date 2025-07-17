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
import { Menu, User, LogOut, FilePenLine, ExternalLink } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/login", { replace: true });
  };

  const handleSabClick = () => {
    window.open(import.meta.env.VITE_URL_SAB, "_blank");
  };

  return (
    <nav className="bg-background border-b h-16 flex items-center px-4 fixed w-full z-50">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded  flex items-center justify-center">
            <span className="text-primary font-bold">
              <FilePenLine className="text-green-600" />
            </span>
          </div>
          <h1 className="text-xl font-bold hidden md:block">
            Sistema de Fichas
          </h1>
        </Link>

        {/* Central Space - puede usarse para navegación o búsqueda */}
        <div className="hidden md:flex items-center gap-6"></div>

        {/* User Menu & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* SAB Button - Tamaño sm con estilos modernos */}
          <Button
            size="sm"
            onClick={handleSabClick}
            className="hidden sm:flex items-center gap-1 relative overflow-hidden
                     bg-gradient-to-r from-emerald-500 to-teal-600 
                     dark:from-emerald-400 dark:to-teal-500
                     text-white shadow-lg 
                     hover:from-emerald-600 hover:to-teal-700
                     dark:hover:from-emerald-500 dark:hover:to-teal-600
                     cursor-pointer
                    "
            title="Acceder al Sistema SAB"
          >
            <ExternalLink className="h-4 w-4 drop-shadow-sm" />
            <span className="hidden md:inline drop-shadow-sm">SAB</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

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
                {/* SAB Button for Mobile - Tamaño default con estilos modernos */}
                <div className="mb-4 pb-4 ">
                  <Button
                    size="default"
                    onClick={handleSabClick}
                    className="w-full relative overflow-hidden group
                             bg-gradient-to-r from-emerald-500 to-teal-600 
                             dark:from-emerald-400 dark:to-teal-500
                             text-white shadow-lg 
                             hover:from-emerald-600 hover:to-teal-700
                             dark:hover:from-emerald-500 dark:hover:to-teal-600
                           focus:ring-emerald-400 
                             dark:focus:ring-emerald-300 cursor-pointer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4 drop-shadow-sm z-10" />
                    <span className="drop-shadow-sm z-10">Acceder a SAB</span>
                    {/* Efecto de brillo animado */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent 
                                  transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                  transition-transform duration-700 ease-in-out"
                    />
                  </Button>
                </div>

                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Logout Button */}
                <div className="mt-2 pt-4 border-t">
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
