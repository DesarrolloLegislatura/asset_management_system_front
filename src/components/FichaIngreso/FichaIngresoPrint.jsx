import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "../ui/button";
import { useRef } from "react";
import PropTypes from "prop-types";
import { ContentPrintFichaIngreso } from "../Print/ContentPrintFichaIngreso";

export const FichaIngresoPrint = ({ fichaTecnicaById }) => {
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
        <Printer className="h-4 w-4 mr-2" /> Imprimir Ingreso
      </Button>

      <div
        className="hidden print:flex print:flex-col print:items-center print:mx-auto m-6 print:p-1 print:m-0"
        ref={contentRef}
      >
        <ContentPrintFichaIngreso fichaTecnicaById={fichaTecnicaById} />
        {/* <div className=" print:relative print:w-full print:flex print:items-center print:justify-center ">
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
        </div> */}
      </div>
    </>
  );
};

// Agregar PropTypes para evitar errores del linter
FichaIngresoPrint.propTypes = {
  fichaTecnicaById: PropTypes.object.isRequired,
};
