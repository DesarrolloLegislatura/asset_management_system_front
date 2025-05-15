import { Computer, Printer, ScissorsLineDashed, User } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "../ui/button";
import { useRef } from "react";

const ContentPrint = ({ fichaTecnicaById }) => {
  console.log("fichaTecnicaById", fichaTecnicaById);

  return (
    <div className="print:page-break-inside-avoid print:h-[138mm] print:overflow-hidden print:w-full print:p-2 print:border-box print:relative">
      {/* Encabezado */}
      <div className="flex justify-between items-center print:mb-[1px]">
        {/* Logo positioned to the left */}
        <div className="flex-shrink-0">
          <img
            src="/assets/svg/pl_logo.svg"
            alt="Logo"
            className="h-16 w-auto print:h-14 print:w-auto"
          />
        </div>

        {/* Date and number of the document - positioned to the right */}
        <div className="flex-shrink-0">
          <p className="text-sm print:text-[16px] font-bold text-right">
            Ficha:{" "}
            <span className="font-light">
              N°{fichaTecnicaById.id_ficha_tecnica || ""}
            </span>
          </p>
        </div>
      </div>

      {/* Titulo */}
      <div className="text-center mb-2 print:mb-[1px]">
        <h1 className="text-4xl font-semibold uppercase underline print:text-[19px]">
          Servicio Técnico
        </h1>
        <h2 className="text-lg font-light uppercase print:text-[12px] ">
          Ficha de ingreso del bien
        </h2>
      </div>

      <div className="mb-1 p-1 print:mb-[2px] print:p-[1px]">
        <h3 className="font-bold mb-1 text-sm text-gray-900 uppercase pb-1 print:text-xs print:bg-gray-700 flex items-center">
          <Computer className="mr-1 " size={15} /> Información de contacto
        </h3>

        {/* Additional rows with print size optimization */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 print:gap-2 mb-3 print:mb-[4px] print:text-[12px]">
          <div className="p-2 print:p-0">
            <span className="font-bold ">Estado: </span>
            <span className="font-light">
              {fichaTecnicaById.estado_del_bien}
            </span>
          </div>
          <div className="p-2 print:p-0 ">
            <span className="font-bold ">Tipo del Bien: </span>
            <span className="font-light">{fichaTecnicaById.tipo_de_bien}</span>
          </div>
          <div className="p-2 print:p-0">
            <span className="font-bold ">N de Patrimonio: </span>
            <span className="font-light">
              {fichaTecnicaById.numero_patrimonio}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 print:gap-2 mb-3 print:mb-[4px] print:text-[12px]">
          <div className="p-2 print:p-0">
            <span className="font-bold ">Fecha Ingreso: </span>
            <span className="font-light">
              {fichaTecnicaById.fecha_de_ingreso}
            </span>
          </div>
          <div className="p-2 print:p-0">
            <span className="font-bold ">Act. Simple: </span>

            <span className="font-light">{`${fichaTecnicaById.act_simple}/${fichaTecnicaById.anio_act_simple}`}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 print:gap-2 mb-2 print:mb-[4px] print:text-[12px]">
          {/* First row of data */}

          <div className="p-2 print:p-0 ">
            <span className="font-bold ">Dependencia: </span>
            <span className="font-light">
              {fichaTecnicaById.dependencia_interna?.dependencia?.dep_gral}
            </span>
          </div>
          <div className="p-2 print:p-0 ">
            <span className="font-bold ">Dependencia Interna: </span>

            <span className="font-light">
              {fichaTecnicaById.dependencia_interna?.dep_interna}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2  gap-4 print:gap-1 mb-3 print:mb-[8px] print:text-[12px]">
          <div className="p-2 print:p-0">
            <span className="font-bold">Usuario PC:</span>

            <span className="">{fichaTecnicaById.usuario_pc}</span>
          </div>
          <div className="p-2 print:p-0 ">
            <span className="font-bold">Contrasena PC:</span>

            <span className="font-light">
              {fichaTecnicaById.contrasenia_pc}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-10  p-1 print:mb-[12px] print:p-[1px]">
        <h3 className="font-bold mb-1 text-sm  text-gray-700 uppercase border-b border-gray-200 pb-1 print:text-xs print:bg-gray-700">
          Resolución Técnica
        </h3>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-4  print:gap-2  print:text-[12px]">
          <div className="p-2 print:p-0">
            <span className="font-bold ">Asistido</span>

            <span className="font-light">{fichaTecnicaById.asistido_por}</span>
          </div>
          <div className="p-2 print:p-0">
            <span className="font-bold ">Ponderacion:</span>

            <span className="font-light">{fichaTecnicaById.ponderacion}</span>
          </div>
        </div>
        <div className="mb-3 p-2 print:mb-[6px] print:text-[12px] print:p-0">
          <h3 className="font-bold mb-2 print:mb-[1px] ">
            Descripcion de la Resolución:
          </h3>
          <div className="border border-dotted border-gray-200 print:border-gray-300 rounded-sm  m p-2 print:p-[1px] ">
            <p className="text-justify print:pb-2 print:max-h-[100cm] print:overflow-hidden ">
              {fichaTecnicaById.descripcion_tec || "Sin descripción"}
            </p>
          </div>
        </div>
      </div>
      <div className="hidden print:flex print:absolute print:bottom-[34px] print:right-0 print:mr-4 print:z-10">
        <div className="border-dotted border-t-2 border-gray-500 w-40 text-center">
          <h3 className="font-light print:mt-1 print:text-[10px]">Firma</h3>
        </div>
      </div>

      {/* Footer con position fixed o absolute */}
      <div
        id="pie"
        className="hidden print:block print:absolute print:bottom-0 print:left-0 print:right-0 print:w-full print:bg-gray-100 print:border-t print:border-gray-300 print:pt-1 print:pb-1"
      >
        <p className="text-[9px] leading-tight text-center">
          <span className="font-bold">
            DIRECCIÓN DE SISTEMAS Y COMUNICACIONES
          </span>{" "}
          - José María Paz Nº 170, 1° Piso, Resistencia, Chaco - Tel: 4429149 -{" "}
          <b>Dir: Francisco Javier Fariña</b>
        </p>
      </div>
    </div>
  );
};

export const FichaTecnicaPrint = ({ fichaTecnicaById }) => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
      @page {
        size: A4;
        margin: 3mm;
      }
      @media print {
        html, body {
          height: 100%;
          width: 100%;
          overflow: hidden;
          font-family: open-sans, sans-serif;
        }
        .print-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          page-break-after: avoid;
        }
      }
    `,
    removeAfterPrint: true,
    copyStyles: true,
    documentTitle: "Ficha de Ingreso",
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        resolve();
      });
    },
  });
  return (
    <>
      <Button onClick={reactToPrintFn} size="sm">
        <Printer className="h-4 w-4 mr-2" /> Imprimir
      </Button>

      <div
        className="hidden print:flex print:flex-col print:items-center print:mx-auto m-6 print:p-1 print:m-0"
        ref={contentRef}
      >
        <ContentPrint fichaTecnicaById={fichaTecnicaById} />
        <div className=" print:relative print:w-full print:flex print:items-center print:justify-center ">
          <div className="">
            <ScissorsLineDashed className="h-6 w-6" color="#6a7282" />
          </div>
          <div className="border-t-2 border-dashed border-gray-500 flex-grow"></div>
          <div className="flex justify-end">
            <ScissorsLineDashed
              className="h-6 w-6 transform rotate-180"
              color="#6a7282"
            />
          </div>
        </div>
        {/* Second Detail component - only visible in print */}
        <ContentPrint fichaTecnicaById={fichaTecnicaById} />
      </div>
    </>
  );
};
