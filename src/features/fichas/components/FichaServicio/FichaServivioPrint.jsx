import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/shared/ui/button";
import { useRef } from "react";
import PropTypes from "prop-types";
import { ContentPrintFichaServicio } from "../Print/ContentPrintFichaServicio";
import { ScissorsLine } from "@/shared/ui/ScissorsLine";

const PAGE_STYLE = `
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
    * {
      color: black !important;
      border-color: black !important;
    }
    img {
      filter: grayscale(100%) contrast(120%) brightness(110%) !important;
    }
  }
`;

export const FichaServivioPrint = ({ fichaData }) => {
  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: PAGE_STYLE,
    removeAfterPrint: true,
    copyStyles: true,
    documentTitle: "Ficha de Servicio",
    onBeforeGetContent: () => new Promise((resolve) => resolve()),
  });

  return (
    <>
      <Button onClick={reactToPrintFn} size="sm">
        <Printer className="h-4 w-4 mr-2" /> Imprimir Ficha
      </Button>

      <div
        className="hidden print:flex print:flex-col print:items-center print:mx-auto m-6 print:p-1 print:m-0"
        ref={contentRef}
      >
        <ContentPrintFichaServicio fichaData={fichaData} isTecnico={true} />
        <ScissorsLine />
        <ContentPrintFichaServicio fichaData={fichaData} isTecnico={false} />
      </div>
    </>
  );
};

FichaServivioPrint.propTypes = {
  fichaData: PropTypes.object.isRequired,
};
