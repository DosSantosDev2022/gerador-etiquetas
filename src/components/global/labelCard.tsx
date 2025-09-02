// src/components/global/LabelCard.tsx
import { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { Button } from '@/components/ui';

interface LabelCardProps {
  labelId: string;
  onPrint: (labelId: string) => void;
}

const LabelCard = ({ labelId, onPrint }: LabelCardProps) => {
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  // Gera a imagem do código de barras para a pré-visualização
  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, labelId, {
        format: 'CODE128',
        displayValue: false,
        width: 1.5,
        height: 40,
        margin: 10,
      });
    }
  }, [labelId]);

  const handlePrintThisLabel = () => {
    onPrint(labelId);
  };

  return (
    <div className="border border-border rounded-lg p-2 flex flex-col items-center text-center shadow-sm bg-background w-full max-w-sm mx-auto">
      <p className="font-mono text-sm font-semibold break-all">{labelId}</p>
      
      {/* O SVG agora ocupa a largura total do seu contêiner, respeitando o padding */}
      <svg ref={barcodeRef} className="my-2 w-full"></svg>

      <Button onClick={handlePrintThisLabel} variant="default" size="sm">
        Imprimir
      </Button>
    </div>
  );
}

export { LabelCard };