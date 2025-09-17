// src/hooks/useLabelGenerator.ts
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
// Importe as funções do nosso novo serviço
import { connectToPrinter, sendZplToPrinter, isPrinterConnected } from '../services/webUsbService';

// A função generateZplForLabel e a const MAX_LABELS permanecem as mesmas
const MAX_LABELS = 100;
const generateZplForLabel = (labelId: string): string => {
  // ... ZPL template ...
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
  // ... outros estados ...
  const [packageId, setPackageId] = useState('9001941457766');
  const [loading, setIsLoading] = useState(false);
  const [processQuantity, setProcessQuantity] = useState<number>(5);
  const [generatedLabels, setGeneratedLabels] = useState<string[]>([]);
  
  // NOVO ESTADO para gerenciar o status da conexão da impressora
  const [printerConnected, setPrinterConnected] = useState(false);

  // Ao iniciar o hook, verifica se já existe uma conexão ativa
  useEffect(() => {
    setPrinterConnected(isPrinterConnected());
  }, []);

  const handleGenerateLabels = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    try {
      setIsLoading(true);
      
      // Lógica de validação
      if (!packageId.trim() || processQuantity <= 0 || processQuantity > MAX_LABELS) {
        if (!packageId.trim()) toast.error('Por favor, insira o número da etiqueta.');
        if (processQuantity <= 0) toast.error('A quantidade deve ser de no mínimo 1.');
        if (processQuantity > MAX_LABELS) toast.error(`A quantidade máxima é ${MAX_LABELS}.`);
        setIsLoading(false);
        return;
      }
      
      // Limpa as etiquetas antigas antes de gerar as novas
      setGeneratedLabels([]);
      
      // Usamos um pequeno timeout para que a UI possa mostrar o estado de "loading"
      setTimeout(() => {
        const labels: string[] = [];
        for (let i = 1; i <= processQuantity; i++) {
          const processNumber = String(i).padStart(3, '0');
          labels.push(`${packageId}-TJSP${processNumber}`);
        }
        
        // Atualiza o estado com as novas etiquetas
        setGeneratedLabels(labels);
        toast.success(`${labels.length} etiquetas geradas!`);
        setIsLoading(false);
      }, 500); // Um pequeno delay de 500ms

    } catch (e) {
      toast.error("Ocorreu um erro inesperado ao gerar as etiquetas.");
      setIsLoading(false);
    }
  };
  
  // --- NOVAS FUNÇÕES PARA WEBUSB ---

  /**
   * Inicia o processo de conexão com a impressora USB.
   */
  const handleConnectPrinter = async () => {
    setIsLoading(true);
    toast.info("Na janela do navegador, selecione a impressora Zebra e clique em 'Conectar'.");
    try {
      await connectToPrinter();
      setPrinterConnected(true);
      toast.success("Impressora conectada com sucesso!");
    } catch (error: any) {
      // O erro pode ser o usuário clicando em "Cancelar", o que é normal.
      if (error.name !== 'NotFoundError') {
        toast.error(`Falha ao conectar: ${error.message}`);
      }
      setPrinterConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Imprime uma única etiqueta usando WebUSB.
   */
  const handlePrintWebUsb = async (labelId: string) => {
    if (!printerConnected) {
      toast.error("Impressora não está conectada.");
      return;
    }
    setIsLoading(true);
    try {
      const zplCode = generateZplForLabel(labelId);
      await sendZplToPrinter(zplCode);
      toast.success("Comando de impressão enviado!");
    } catch (error: any) {
      toast.error(`Erro ao imprimir: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Imprime todas as etiquetas geradas em um único envio via WebUSB.
   */
  const handlePrintAllWebUsb = async () => {
    if (generatedLabels.length === 0) return toast.warning("Nenhuma etiqueta para imprimir.");
    if (!printerConnected) return toast.error("Impressora não está conectada.");
    
    setIsLoading(true);
    try {
      const allZpl = generatedLabels.map(labelId => generateZplForLabel(labelId)).join('\n');
      await sendZplToPrinter(allZpl);
      toast.success(`${generatedLabels.length} etiquetas enviadas para a impressora!`);
    } catch (error: any) {
      toast.error(`Erro ao imprimir todas as etiquetas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => { /* ... sua lógica existente ... */ };
  const handleDownloadZplFile = () => { /* ... sua lógica existente ... */ };

  return {
    loading,
    packageId,
    setPackageId,
    processQuantity,
    setProcessQuantity,
    generatedLabels,
    handleGenerateLabels,
    handleClearAll,
    handleDownloadZplFile,
    // Exportando o novo estado e as novas funções
    printerConnected,
    handleConnectPrinter,
    handlePrintWebUsb,
    handlePrintAllWebUsb,
  };
};