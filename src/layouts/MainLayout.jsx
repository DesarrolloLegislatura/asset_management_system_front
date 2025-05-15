import { Outlet } from "react-router";
import { Navbar } from "./Navbar";

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar fijo en la parte superior */}
      <Navbar />

      {/* Contenedor principal con margen superior para el navbar */}
      <div className="flex flex-col flex-grow pt-16">
        {/* Contenido principal */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer opcional */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Sistema de Fichas - Legislatura{" "}
            {/* Mostrar título de la página actual */}
            <span className="font-medium"> - By Adrian and Daniel</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
