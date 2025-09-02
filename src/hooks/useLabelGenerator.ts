// src/hooks/useLabelGenerator.ts
import { useState } from 'react';
import { toast } from 'sonner';

declare const BrowserPrint: any;

const MAX_LABELS = 50;

// Função auxiliar para gerar o template ZPL de uma etiqueta
const generateZplForLabel = (labelId: string): string => {
  const zplTemplate = `
  ^XA
  ^FO20,20^A0N,30,30^FDETIQUETA DE PROCESSO^FS
  ^FO20,60^BY2,2.0,60^BCN,60,N,N,N,A^FD${labelId}^FS
  ^FO40,130^A0N,25,25^FD${labelId}^FS
  ^XZ
  `;
  return zplTemplate.trim();
};

export const useLabelGenerator = () => {
  const [packageId, setPackageId] = useState('9001941457766');
  const [loading, setIsLoading] = useState(false);
  const [processQuantity, setProcessQuantity] = useState<number>(5);
  const [generatedLabels, setGeneratedLabels] = useState<string[]>([]);

  const sendZplToPrinter = (zplCode: string) => {
    // ... (esta função continua exatamente a mesma da resposta anterior)
    setIsLoading(true);
    try {
      BrowserPrint.getDefaultDevice("printer", (device: any) => {
        if (device) {
          device.send(zplCode, () => {
            toast.success('Impressão enviada com sucesso!');
            setIsLoading(false);
          }, (error: any) => {
            toast.error(`Erro ao enviar para impressora: ${error}`);
            setIsLoading(false);
          });
        } else {
          toast.error("Nenhuma impressora padrão encontrada. Verifique o Zebra Browser Print.");
          setIsLoading(false);
        }
      }, (error: any) => {
        toast.error(`Erro ao comunicar com o Browser Print: ${error}.`);
        setIsLoading(false);
      });
    } catch (error) {
        toast.error("Não foi possível acessar o Zebra Browser Print. Verifique se ele está instalado e em execução.");
        setIsLoading(false);
    }
  };

  const handleGenerateLabels = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!packageId.trim()) {
        toast.error('Por favor, insira o número da etiqueta do pacote.');
        return;
      }
      if (processQuantity > MAX_LABELS) {
        toast.error(`A quantidade máxima de etiquetas permitida é ${MAX_LABELS}.`);
        return;
      }
      if (processQuantity <= 0) {
        toast.error('A quantidade deve ser de no mínimo 1.');
        return;
      }
      setGeneratedLabels([]);
      setTimeout(() => {
        const labels: string[] = [];
        for (let i = 1; i <= processQuantity; i++) {
          const processNumber = String(i).padStart(3, '0');
          labels.push(`${packageId}-TJSP${processNumber}`);
        }
        setGeneratedLabels(labels);
        toast.success(`${labels.length} etiquetas geradas!`);
      }, 500);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };
  
  const handlePrintAll = () => {
    if (generatedLabels.length === 0) {
        toast.warning("Nenhuma etiqueta gerada para imprimir.");
        return;
    }
    const allZpl = generatedLabels.map(labelId => generateZplForLabel(labelId)).join('\n');
    sendZplToPrinter(allZpl);
  };

  /**
   * NOVA FUNÇÃO: Imprime uma única etiqueta.
   * Ela recebe o ID da etiqueta, gera o ZPL e envia para a impressora.
   */
  const handlePrintSingleLabel = (labelId: string) => {
    const zplCode = generateZplForLabel(labelId);
    sendZplToPrinter(zplCode);
  };

  const handleClearAll = () => {
    setPackageId('');
    setProcessQuantity(1);
    setGeneratedLabels([]);
  };

  return {
    loading,
    packageId,
    setPackageId,
    processQuantity,
    setProcessQuantity,
    generatedLabels,
    handleGenerateLabels,
    handlePrintAll,
    handleClearAll,
    handlePrintSingleLabel, // <-- Exportando a nova função
  };
};