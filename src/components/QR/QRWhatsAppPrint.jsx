import { QRCodeSVG } from "qrcode.react";

export const QRWhatsAppPrint = (fichaId) => {
  console.log(fichaId);

  const finalMessage = `Hola, quisiera información sobre la ficha N° ${fichaId.fichaId}`;
  const encodedMessage = encodeURIComponent(finalMessage);
  const whatsappUrl = `https://wa.me/+5493624565024?text=${encodedMessage}`;

  return (
    <>
      <div
        className="relative inline-block
        print:border print:border-black print:rounded-none print:p-1 print:bg-white
        print:mr-2"
      >
        <QRCodeSVG
          value={whatsappUrl}
          size={40}
          className="print:contrast-125"
        />
      </div>
      <p className="text-xs text-center mt-1 print:text-[8px] print:text-black print:font-medium print:mb-1">
        Escanear para soporte
      </p>
    </>
  );
};
