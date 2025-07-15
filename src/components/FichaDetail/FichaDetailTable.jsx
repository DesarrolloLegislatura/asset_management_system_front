import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FichaTabInfoBien } from "./FichaTabInfoBien";
import { FichaTabInfoContacto } from "./FichaTabInfoContacto";
import { FichaTabResolucionTecnica } from "./FichaTabResolucionTecnica";
import { FichaTabEstados } from "./FichaTabEstados";

export const FichaDetailTable = ({ fichaTecnicaById, group }) => {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid grid-cols-4  w-full mb-10  max-w-2xl m">
        <TabsTrigger value="info">Info del Bien</TabsTrigger>
        <TabsTrigger value="contact">Info de Contacto</TabsTrigger>
        <TabsTrigger value="tech">Resolución Técnica</TabsTrigger>

        <TabsTrigger value="states">Estados</TabsTrigger>
      </TabsList>

      <FichaTabInfoBien fichaTecnicaById={fichaTecnicaById} />
      <FichaTabInfoContacto fichaTecnicaById={fichaTecnicaById} />
      <FichaTabResolucionTecnica fichaTecnicaById={fichaTecnicaById} />
      <FichaTabEstados fichaTecnicaById={fichaTecnicaById} />
    </Tabs>
  );
};
