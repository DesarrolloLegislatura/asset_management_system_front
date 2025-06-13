import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export const ErrorPage = ({ error = "Error al cargar los datos" }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="flex items-center justify-center text-9xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          <div className="relative inline-block w-30 h-35">
            <div className="absolute inset-0 rounded-full bg-white dark:bg-gray-900 animate-pulse"></div>
            <img
              src={"/assets/images/chini.png"}
              alt="0"
              className="absolute inset-0 w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Error al cargar los datos
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          {error}
        </p>

        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver atrás
        </Button>
      </div>
    </div>
  );
};
