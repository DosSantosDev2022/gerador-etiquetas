// src/hooks/useLabelGenerator.ts
import { useState } from 'react';
import { toast } from 'sonner';

// ==========================================================
// Adicionando a declaração de tipo para o BrowserPrint
// Isso informa ao TypeScript que o objeto 'BrowserPrint' existirá no escopo global (window).
// ==========================================================
declare const BrowserPrint: any;

/**
 * Hook personalizado para gerenciar a lógica de criação e impressão de etiquetas.
 * Ele encapsula o estado e as funções relacionadas à geração de etiquetas,
 * tornando o componente principal mais limpo e focado na UI.
 */

// ==========================================================
// 1. CONSTANTES E TIPOS
// ==========================================================
const MAX_LABELS = 50;

export const useLabelGenerator = () => {
  // ==========================================================
  // 1. ESTADO DO COMPONENTE
  // ==========================================================
  const [packageId, setPackageId] = useState('9001941457766');
  const [loading, setIsLoading] = useState(false);
  const [processQuantity, setProcessQuantity] = useState<number>(5);
  const [generatedLabels, setGeneratedLabels] = useState<string[]>([]);
  
  // O estado 'zplToPrint' não é mais necessário, pois enviaremos o ZPL diretamente.
  // const [zplToPrint, setZplToPrint] = useState('');

  // ==========================================================
  // 2. FUNÇÕES DE MANIPULAÇÃO DO ESTADO
  // ==========================================================

  /**
   * NOVA FUNÇÃO: Envia o código ZPL diretamente para a impressora
   * usando a biblioteca Zebra Browser Print.
   * @param zplCode - O código ZPL (string) a ser impresso.
   */
  const sendZplToPrinter = (zplCode: string) => {
    setIsLoading(true);
    try {
      // 1. Tenta encontrar a impressora padrão configurada no Browser Print.
      BrowserPrint.getDefaultDevice("printer", (device: any) => {
        
        // 2. Se encontrou um dispositivo, envia o código ZPL.
        if (device) {
          device.send(zplCode, () => {
            toast.success('Impressão enviada com sucesso!');
            setIsLoading(false);
          }, (error: any) => {
            // Em caso de erro no envio
            toast.error(`Erro ao enviar para impressora: ${error}`);
            setIsLoading(false);
          });
        } else {
          // Caso nenhuma impressora padrão seja encontrada.
          toast.error("Nenhuma impressora padrão encontrada. Verifique se o Zebra Browser Print está em execução e configurado.");
          setIsLoading(false);
        }
      }, (error: any) => {
        // Em caso de erro ao obter a lista de impressoras
        toast.error(`Erro ao comunicar com o Browser Print: ${error}. Verifique se ele está em execução.`);
        setIsLoading(false);
      });
    } catch (error) {
        toast.error("Não foi possível acessar o Zebra Browser Print. Certifique-se de que ele está instalado e em execução, e que o script foi adicionado ao seu HTML.");
        setIsLoading(false);
    }
  };


  /**
   * Gera uma lista de etiquetas com base no ID do pacote e na quantidade.
   * (Esta função permanece igual, sua lógica está perfeita).
   */
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
  
  /**
   * Compila todas as etiquetas geradas em um único código ZPL e solicita a impressão.
   * MODIFICADO: Agora chama a nova função de envio direto.
   */
  const handlePrintAll = () => {
    if (generatedLabels.length === 0) {
        toast.warning("Nenhuma etiqueta gerada para imprimir.");
        return;
    }

    // A lógica de geração do ZPL está ótima, mantemos como está.
    // Apenas removemos o '\n\n' extra, pois não é estritamente necessário.
    // O comando ^XZ já finaliza uma etiqueta e a impressora começa a próxima.
    const allZpl = generatedLabels.map(labelId => {
      const zplTemplate = `
      ^XA
      ^FO20,20^A0N,30,30^FDETIQUETA DE PROCESSO^FS
      ^FO20,60^BY2,2.0,60^BCN,60,N,N,N,A^FD${labelId}^FS
      ^FO40,130^A0N,25,25^FD${labelId}^FS
      ^XZ
      `;
      return zplTemplate.trim();
    }).join('\n'); // Um único '\n' é suficiente.

    // Chama a nossa nova função de impressão direta!
    sendZplToPrinter(allZpl);
  };

  /**
   * Limpa todos os campos de entrada e a lista de etiquetas geradas.
   * (Esta função permanece igual).
   */
  const handleClearAll = () => {
    setPackageId('');
    setProcessQuantity(1);
    setGeneratedLabels([]);
  };

  // ==========================================================
  // 3. RETORNO DO HOOK
  // ==========================================================
  return {
    loading,
    packageId,
    setPackageId,
    processQuantity,
    setProcessQuantity,
    generatedLabels,
    // zplToPrint não é mais necessário
    // handlePrintRequest foi substituído
    handleGenerateLabels,
    handlePrintAll,
    handleClearAll,
  };
};