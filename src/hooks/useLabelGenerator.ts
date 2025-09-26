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
    ^JZN
    ^XA
    ^MD11
    ^LH0,0^FS
    ^FO030,130^GB080,040,002,^FS 
    ^FO028,130^GD041,020,004,,L^FS
    ^FO066,130^GD041,020,004,,R^FS
    ^FO030,030^A0N,030,030,^FDIMB^FS
    ^FO030,060^BY2,2.0,65^BCN,65,N,N,N,A^FD${labelId}^FS
    ^FO150,140^A0N,030,030,^FD${labelId}^FS
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

  const handleClearAll = () => {
    // 1. Limpa o array de etiquetas, o que fará a lista de resultados desaparecer da tela.
    setGeneratedLabels([]);

    // 2. Limpa o campo de input da etiqueta do pacote.
    setPackageId('');

    // 3. Redefine a quantidade para o valor mínimo, para que o usuário possa começar de novo.
    // Usar o valor inicial '5' também seria uma opção. Escolhemos '1' por ser o mínimo válido.
    setProcessQuantity(1);

    // 4. (Opcional, mas recomendado) Exibe uma notificação para confirmar a ação.
    toast.info("Campos e resultados limpos!");
  };

  const handleDownloadZplFile = () => {
    // 1. Verifica se existem etiquetas para baixar. Se não houver, exibe um aviso.
    if (generatedLabels.length === 0) {
      toast.warning("Não há etiquetas geradas para baixar.");
      return;
    }

    // 2. Concatena todos os códigos ZPL em uma única string, separados por uma nova linha.
    // Isso garante que a impressora trate cada um como um comando de impressão separado.
    const allZpl = generatedLabels.map(labelId => generateZplForLabel(labelId)).join('\n');

    // 3. Cria um Blob (Binary Large Object). Pense nisso como um arquivo virtual em memória.
    // O tipo 'text/plain' indica que é um arquivo de texto simples.
    const blob = new Blob([allZpl], { type: 'text/plain' });

    // 4. Cria uma URL temporária para o nosso Blob. O navegador pode usar essa URL para acessar o "arquivo".
    const url = URL.createObjectURL(blob);

    // 5. Cria um elemento de link (<a>) dinamicamente. Ele não será visível na página.
    const a = document.createElement('a');

    // 6. Configura o link:
    a.href = url; // Aponta o link para a URL do nosso arquivo.
    a.download = 'etiquetas.txt'; // Define o nome do arquivo que será baixado.

    // 7. Adiciona o link ao corpo do documento para que possamos "clicá-lo".
    document.body.appendChild(a);

    // 8. Simula um clique no link, o que aciona o download no navegador.
    a.click();

    // 9. Limpeza: remove o link do documento e revoga a URL para liberar memória.
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Download do arquivo .zpl iniciado!");
  };

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