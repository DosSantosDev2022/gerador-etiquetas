// src/hooks/useReprintLabel.ts
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { connectToPrinter, sendZplToPrinter, isPrinterConnected } from '../services/webUsbService';

// Reutilizamos a mesma função para gerar o código ZPL
const generateZplForLabel = (labelId: string): string => {
   const zplTemplate = `
^JZN
^XA
^MD11
^LH0,0^FS
^FO070,130^GB100,040,002,^FS
^FO068,130^GD051,020,004,,L^FS
^FO116,130^GD051,020,004,,R^FS
^FO070,030^A0N,030,030,^FDIMB^FS
^FO070,060^BY3,200,065^BCN,65,N,N,N,A^FD${labelId}^FS
^FO210,140^A0N,030,030,^FD${labelId}^FS


^XZ
  `;
  return zplTemplate.trim();
};

export const useReprintLabel = () => {
  const [labelsToReprint, setLabelsToReprint] = useState(''); // Armazena o texto do textarea
  const [generatedLabels, setGeneratedLabels] = useState<string[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(false);

  useEffect(() => {
    setPrinterConnected(isPrinterConnected());
  }, []);

  /**
   * Processa o texto do textarea e transforma em uma lista de etiquetas.
   */
  const handlePrepareLabels = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelsToReprint.trim()) {
      return toast.error("Insira ao menos uma etiqueta para reimprimir.");
    }

    // Lógica principal: quebra o texto por linha, remove linhas vazias e espaços em branco.
    const labels = labelsToReprint
      .split('\n')
      .map(label => label.trim())
      .filter(label => label.length > 0);

    if (labels.length === 0) {
      return toast.error("Nenhuma etiqueta válida encontrada.");
    }
    
    setGeneratedLabels(labels);
    toast.success(`${labels.length} etiquetas prontas para reimpressão!`);
  };
  
  const handleClearAll = () => {
    setLabelsToReprint('');
    setGeneratedLabels([]);
    toast.info("Campos e resultados limpos!");
  };

  // Funções de impressão e conexão (são praticamente idênticas ao outro hook)
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

  // Para evitar repetição, você pode copiar as implementações de `useLabelGenerator` para as 4 funções acima.
  // Uma prática mais avançada seria extrair essa lógica comum para um terceiro hook ou serviço.

  return {
    loading,
    labelsToReprint,
    setLabelsToReprint,
    generatedLabels,
    handlePrepareLabels,
    handleClearAll,
    handleDownloadZplFile,
    printerConnected,
    handleConnectPrinter,
    handlePrintWebUsb,
    handlePrintAllWebUsb,
  };
};