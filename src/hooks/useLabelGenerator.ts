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

  // ... (Funções sendZplToPrinter, handleGenerateLabels, etc. continuam iguais)
  const sendZplToPrinter = (zplCode: string) => {
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
      // ... (lógica de validação)
      if (!packageId.trim() || processQuantity <= 0 || processQuantity > MAX_LABELS) {
         if (!packageId.trim()) toast.error('Por favor, insira o número da etiqueta.');
         if (processQuantity <= 0) toast.error('A quantidade deve ser de no mínimo 1.');
         if (processQuantity > MAX_LABELS) toast.error(`A quantidade máxima é ${MAX_LABELS}.`);
         setIsLoading(false);
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
        setIsLoading(false);
      }, 500);
    } catch (e) {
      setIsLoading(false);
    }
  };
  
  const handlePrintAll = () => {
    if (generatedLabels.length === 0) return toast.warning("Nenhuma etiqueta para imprimir.");
    const allZpl = generatedLabels.map(labelId => generateZplForLabel(labelId)).join('\n');
    sendZplToPrinter(allZpl);
  };

  const handlePrintSingleLabel = (labelId: string) => {
    const zplCode = generateZplForLabel(labelId);
    sendZplToPrinter(zplCode);
  };

  /**
   * NOVO: Função para gerar e baixar o arquivo ZPL completo.
   */
  const handleDownloadZplFile = () => {
    if (generatedLabels.length === 0) {
      toast.warning("Nenhuma etiqueta gerada para baixar.");
      return;
    }

    // 1. Gera a string ZPL completa
    const allZpl = generatedLabels.map(labelId => generateZplForLabel(labelId)).join('\n');

    // 2. Cria um "Blob", que é um objeto semelhante a um arquivo em memória
    const blob = new Blob([allZpl], { type: 'text/plain' });

    // 3. Cria uma URL temporária para o Blob
    const url = URL.createObjectURL(blob);
    
    // 4. Cria um link <a> invisível para iniciar o download
    const a = document.createElement('a');
    a.href = url;
    a.download = `etiquetas-${packageId}.zpl`; // Nome do arquivo
    document.body.appendChild(a);
    a.click();

    // 5. Limpa a URL e o link para liberar memória
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Arquivo .zpl gerado com sucesso!");
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
    handlePrintSingleLabel,
    handleDownloadZplFile, // <-- Exportando a nova função
  };
};