import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <div className="flex items-center justify-center text-9xl font-bold  mb-6">
          <span>4</span>
          <div className="relative inline-block w-30 h-35">
            <div className="absolute inset-0 rounded-full "></div>
            <img
              src={"/assets/images/chini.png"}
              alt="0"
              className="absolute inset-0 w-full h-full object-contain rounded-full"
            />
          </div>
          <span>4</span>
        </div>

        <h2 className="text-2xl font-semibold  mb-4">Página no encontrada</h2>
        <p className=" max-w-md mx-auto mb-8">
          La página que estás buscando no existe o ha sido movida a otra
          ubicación.
        </p>

        <Button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
