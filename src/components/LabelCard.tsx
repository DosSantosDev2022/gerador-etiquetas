// src/components/LabelCard.tsx
import { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

// Função que gera o ZPL para UMA etiqueta.
// Podemos mantê-la aqui ou em um arquivo de 'utils'.
function generateZplForLabel(labelId: string): string {
  const zplTemplate = `
^XA
^FO20,20^A0N,30,30^FDETIQUETA DE PROCESSO^FS
^FO20,60^BY2,2.0,60^BCN,60,N,N,N,A^FD${labelId}^FS
^FO40,130^A0N,25,25^FD${labelId}^FS
^XZ
`;
  return zplTemplate.trim();
}

interface LabelCardProps {
  labelId: string;
  onPrint: (zplCode: string) => void; // Função que será chamada para imprimir
}

export function LabelCard({ labelId, onPrint }: LabelCardProps) {
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  // Gera a imagem do código de barras para a pré-visualização
  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, labelId, {
        format: 'CODE128',
        displayValue: false,
        width: 1.5,
        height: 40,
      });
    }
  }, [labelId]);

  const handlePrintThisLabel = () => {
    const zpl = generateZplForLabel(labelId);
    onPrint(zpl); // Chama a função do componente pai para realizar a impressão
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center text-center shadow-sm bg-white">
      <p className="font-mono text-sm font-semibold break-all">{labelId}</p>
      <svg ref={barcodeRef} className="my-2"></svg>
      <button
        onClick={handlePrintThisLabel}
        className="w-full mt-2 bg-blue-500 text-white text-sm font-bold py-1 px-3 rounded hover:bg-blue-600 transition-colors cursor-pointer"
      >
        Imprimir etiqueta
      </button>
    </div>
  );
}