import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "../ui/button";
import { useRef } from "react";
import { ContentPrintFichaTecnica } from "../Print/ContentPrintFichaTecnica";
import { ScissorsLine } from "../ui/ScissorsLine";
import { ContentPrintFichaSalidaExterna } from "../Print/ContentPrintFichaSalidaExterna";

export const FichaSalidaExternaPrint = ({ fichaTecnicaById }) => {
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
        <Printer className="h-4 w-4 mr-2" /> Reparación Externa
      </Button>

      <div
        className="hidden print:flex print:flex-col print:items-center print:mx-auto m-6 print:p-1 print:m-0"
        ref={contentRef}
      >
        <ContentPrintFichaTecnica
          fichaTecnicaById={fichaTecnicaById}
          ingreso={false}
        />
        <ScissorsLine />
        {/* Second Detail component - only visible in print */}
        <ContentPrintFichaSalidaExterna
          fichaTecnicaById={fichaTecnicaById}
          ingreso={false}
        />
        <ScissorsLine />
        <ContentPrintFichaSalidaExterna
          fichaTecnicaById={fichaTecnicaById}
          ingreso={true}
        />
      </div>
    </>
  );
};
