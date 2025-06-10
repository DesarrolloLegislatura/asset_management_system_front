import { Computer, Printer, ScissorsLineDashed } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "../ui/button";
import { useRef } from "react";
import PropTypes from "prop-types";

const ContentPrintFichaTecnica = ({ fichaTecnicaById }) => {
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
            className="h-16 w-auto print:h-14 print:w-auto print:filter print:grayscale print:contrast-125"
          />
        </div>

        {/* Date and number of the document - positioned to the right */}
        <div className="flex-shrink-0">
          <p className="text-sm print:text-[16px] font-bold text-right print:text-black">
            Ficha:{" "}
            <span className="font-normal print:font-medium">
              N°{fichaTecnicaById.id || ""}
            </span>
          </p>
        </div>
      </div>

      {/* Titulo */}
      <div className="text-center mb-2 print:mb-[3px] print:border-b-2 print:border-black print:pb-1">
        <h1 className="text-4xl font-semibold uppercase underline print:text-[19px] print:text-black print:font-bold">
          Servicio Técnico
        </h1>
        <h2 className="text-lg font-light uppercase print:text-[12px] print:text-black print:font-medium">
          Ficha de resolución técnica
        </h2>
      </div>

      <div className="mb-1 p-1 print:mb-[2px] print:p-[1px]">
        {/* Encabezado de sección optimizado para B&N */}
        <div className="print:bg-gray-300 print:text-white print:p-1 print:mb-2 print:rounded-none">
          <h3 className="font-bold mb-1 text-sm text-gray-900 uppercase pb-1 print:text-xs print:text-white print:mb-0 flex items-center">
            <Computer className="mr-1 print:hidden" size={15} />
            <span className="print:block print:font-bold">
              📋 INFORMACIÓN DEL BIEN
            </span>
          </h3>
        </div>

        {/* Grid con bordes mejorados para impresión */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 print:gap-1 mb-3 print:mb-[4px] print:text-[11px] print:border print:border-black">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Estado:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.status?.[0]?.name || "Sin Datos"}
            </span>
          </div>
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Tipo del Bien:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.asset?.typeasset?.name || "Sin Datos"}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              N° de Inventario:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.asset?.inventory || "Sin Datos"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 print:gap-1 mb-2 print:mb-[4px] print:text-[11px] print:border print:border-black print:border-t-0">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Área:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.asset?.area?.name || "Sin Datos"}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              Edificio:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.asset?.building?.name || "Sin Datos"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 print:gap-1 mb-3 print:mb-[4px] print:text-[11px] print:border print:border-black print:border-t-0">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Fecha Ingreso:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.date_in || "Sin Datos"}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              Act. Simple:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {`${fichaTecnicaById.act_simple || ""}/${
                fichaTecnicaById.year_act_simple || ""
              }`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 print:gap-1 mb-3 print:mb-[6px] print:text-[11px] print:border print:border-black print:border-t-0">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Usuario PC:
            </span>
            <span className="print:text-black print:font-normal">
              {fichaTecnicaById.user_pc || "Sin Datos"}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              Contraseña PC:
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.pass_pc || "Sin Datos"}
            </span>
          </div>
        </div>
      </div>

      {/* Sección de resolución técnica mejorada */}
      <div className="mb-10 p-1 print:mb-[8px] print:p-[1px]">
        <div className="print:bg-gray-300 print:text-white print:p-1 print:mb-2">
          <h3 className="font-bold mb-1 text-sm text-gray-700 uppercase pb-1 print:text-xs print:text-white print:mb-0 flex items-center">
            <span className="print:block print:font-bold">
              🔧 RESOLUCIÓN TÉCNICA
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 print:gap-1 print:text-[11px] print:border print:border-black">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Tipo de Asistencia:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.assistance || "Sin Datos"}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              Ponderación:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.ponderacion || "Sin Datos"}
            </span>
          </div>
        </div>

        {/* Descripción técnica con mejor formato */}
        <div className="mb-3 p-2 print:mb-[6px] print:text-[11px] print:p-0">
          <h3 className="font-bold mb-2 print:mb-[2px] print:text-black print:font-bold print:text-[12px]">
            Descripción de la Resolución Técnica:
          </h3>
          <div className="border border-dotted border-gray-200 print:border-2 print:border-black print:border-solid rounded-sm p-2 print:p-2 print:min-h-[20mm]">
            <p className="text-justify print:pb-1 print:text-black print:leading-tight print:text-[10px]">
              {fichaTecnicaById.tech_description ||
                "Sin resolución técnica registrada"}
            </p>
          </div>
        </div>
      </div>

      {/* Firma mejorada */}
      <div className="hidden print:flex print:absolute print:bottom-[34px] print:right-0 print:mr-4 print:z-10">
        <div className="border-dotted border-t-2 border-black w-40 text-center">
          <h3 className="font-light print:mt-1 print:text-[10px] print:text-black print:font-medium">
            FIRMA Y SELLO
          </h3>
        </div>
      </div>

      {/* Footer optimizado para B&N */}
      <div
        id="pie"
        className="hidden print:block print:absolute print:bottom-0 print:left-0 print:right-0 print:w-full print:bg-white print:border-t-1 print:border-black print:pt-1 print:pb-1"
      >
        <p className="text-[9px] leading-tight text-center print:text-black print:font-medium">
          <span className="font-bold print:font-bold">
            DIRECCIÓN DE SISTEMAS Y COMUNICACIONES
          </span>{" "}
          - José María Paz Nº 170, 1° Piso, Resistencia, Chaco - WhatsApp:
          362-4565024 -{" "}
          <b className="print:font-bold">Dir: Francisco Javier Fariña</b>
        </p>
      </div>
    </div>
  );
};

// Agregar PropTypes para evitar errores del linter
ContentPrintFichaTecnica.propTypes = {
  fichaTecnicaById: PropTypes.object.isRequired,
};

const ContentPrintFichaSalida = ({ fichaTecnicaById, ingreso }) => {
  return (
    <div className="print:page-break-inside-avoid print:h-[68mm] print:overflow-hidden print:w-full print:p-2 print:border-box print:relative">
      {/* Encabezado */}
      <div className="flex justify-between items-center print:mb-[1px]">
        {/* Logo positioned to the left */}
        <div className="flex-shrink-0">
          <img
            src="/assets/svg/pl_logo.svg"
            alt="Logo"
            className="h-16 w-auto print:h-14 print:w-auto print:filter print:grayscale print:contrast-125"
          />
        </div>

        {/* Date and number of the document - positioned to the right */}
        <div className="flex-shrink-0">
          <p className="text-sm print:text-[16px] font-bold text-right print:text-black">
            Ficha:{" "}
            <span className="font-normal print:font-medium">
              N°{fichaTecnicaById.id || ""}
            </span>
          </p>
        </div>
      </div>

      {/* Titulo */}
      <div className="text-center mb-2 print:mb-[3px] print:border-b-2 print:border-black print:pb-1">
        <h1 className="text-4xl font-semibold uppercase underline print:text-[19px] print:text-black print:font-bold">
          Servicio Técnico
        </h1>
        <h2 className="text-lg font-light uppercase print:text-[12px] print:text-black print:font-medium">
          Ficha de {ingreso ? "Constancia de Retiro" : "de salida"}
        </h2>
      </div>

      {/* Contenido principal */}
      <div className="print:mb-4 print:text-[11px] print:text-black print:leading-relaxed print:p-2">
        <div className="print:mb-2">
          <p className="print:text-[13px] print:leading-relaxed">
            {ingreso ? (
              <>
                Se deja constancia de que el agente{" "}
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.retired_by || "________________________"}
                </span>
                , del área
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.area?.name ||
                    "________________________"}
                </span>{" "}
                , procede a retirar el bien que se detalla a continuación:
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.typeasset?.name ||
                    "________________________"}
                </span>
                , N° de inventario:
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.inventory ||
                    "________________________"}
                </span>
              </>
            ) : (
              <>
                Se autoriza a
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.retired_by || "________________________"}
                </span>
                , del área
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.area?.name ||
                    "________________________"}
                </span>
                , a retirar el bien que se detalla a continuación:
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.typeasset?.name ||
                    "________________________"}
                </span>
                , N° de inventario:
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.inventory ||
                    "________________________"}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="print:mb-2">
          <p className="print:text-[13px] print:leading-relaxed print:text-black">
            <span className="print:font-medium">Fecha Retiro: </span>
            <span>
              {fichaTecnicaById.date_out
                ? new Date(fichaTecnicaById.date_out).toLocaleDateString(
                    "es-AR"
                  )
                : "___/___/____"}
            </span>
          </p>
          {/* Firma mejorada */}
          <div className="hidden print:flex print:absolute print:bottom-[34px] print:right-0 print:mr-4 print:z-10">
            <div className="border-dotted border-t-2 border-black w-40 text-center">
              <h3 className="font-light print:mt-1 print:text-[10px] print:text-black print:font-medium">
                Firma y Aclaración
              </h3>
            </div>
          </div>
        </div>
        {/* Footer optimizado para B&N */}
        <div
          id="pie"
          className="hidden print:block print:absolute print:bottom-0 print:left-0 print:right-0 print:w-full print:bg-white print:border-t-1 print:border-black print:pt-1 print:pb-1"
        >
          <p className="text-[9px] leading-tight text-center print:text-black print:font-medium">
            <span className="font-bold print:font-bold">
              DIRECCIÓN DE SISTEMAS Y COMUNICACIONES
            </span>{" "}
            - José María Paz Nº 170, 1° Piso, Resistencia, Chaco - WhatsApp:
            362-4565024 -{" "}
            <b className="print:font-bold">Dir: Francisco Javier Fariña</b>
          </p>
        </div>
      </div>
    </div>
  );
};

ContentPrintFichaSalida.propTypes = {
  fichaTecnicaById: PropTypes.object.isRequired,
  ingreso: PropTypes.bool.isRequired,
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
        font-family: 'Arial', sans-serif;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      .print-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        page-break-after: avoid;
      }
      /* Forzar colores para impresión B&N */
      * {
        color: black !important;
        border-color: black !important;
      }
      /* Mejorar contraste de imágenes */
      img {
        filter: grayscale(100%) contrast(120%) brightness(110%) !important;
      }
      
    }
    `,
    removeAfterPrint: true,
    copyStyles: true,
    documentTitle: "Ficha Técnica",
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
        <ContentPrintFichaTecnica fichaTecnicaById={fichaTecnicaById} />
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
        <ContentPrintFichaSalida
          fichaTecnicaById={fichaTecnicaById}
          ingreso={false}
        />
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
        <ContentPrintFichaSalida
          fichaTecnicaById={fichaTecnicaById}
          ingreso={true}
        />
      </div>
    </>
  );
};

// Agregar PropTypes para evitar errores del linter
FichaTecnicaPrint.propTypes = {
  fichaTecnicaById: PropTypes.object.isRequired,
};
