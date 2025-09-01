// src/hooks/useLabelGenerator.ts
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Hook personalizado para gerenciar a lógica de criação e impressão de etiquetas.
 * Ele encapsula o estado e as funções relacionadas à geração de etiquetas,
 * tornando o componente principal mais limpo e focado na UI.
 */

// ==========================================================
// 1. CONSTANTES E TIPOS
// Definir o limite máximo como uma constante torna o código mais legível.
// ==========================================================
const MAX_LABELS = 50;


export const useLabelGenerator = () => {
  // ==========================================================
  // 1. ESTADO DO COMPONENTE
  // ==========================================================
  const [packageId, setPackageId] = useState('9001941457766');
  const [loading, setIsLoading] = useState(false)
  const [processQuantity, setProcessQuantity] = useState<number>(5);
  const [generatedLabels, setGeneratedLabels] = useState<string[]>([]);
  const [zplToPrint, setZplToPrint] = useState('');

  // ==========================================================
  // 2. FUNÇÕES DE MANIPULAÇÃO DO ESTADO
  // ==========================================================

  /**
   * Define o código ZPL para impressão e aciona a janela de impressão do navegador.
   * @param zplCode - O código ZPL (string) a ser impresso.
   */
  const handlePrintRequest = (zplCode: string) => {
    setZplToPrint(zplCode);
    setTimeout(() => {
      window.print();
    }, 100); // Um pequeno atraso para garantir que o estado seja atualizado no DOM.
  };

  /**
   * Gera uma lista de etiquetas com base no ID do pacote e na quantidade.
   * @param e - O evento do formulário para prevenir o comportamento padrão.
   */
  const handleGenerateLabels = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Ativamos o loading logo no início do bloco 'try'
      setIsLoading(true);

      // 2. Realizamos todas as validações. Se alguma falhar, ela vai
      // pular para o bloco 'finally' ao sair da função com 'return'.
      if (!packageId.trim()) {
        toast.error('Por favor, insira o número da etiqueta do pacote.');
        return;
      }

      if (processQuantity > MAX_LABELS) {
        toast.error(`A quantidade máxima de etiquetas permitida é ${MAX_LABELS}.`);
        return; // A função para aqui, mas o 'finally' AINDA SERÁ EXECUTADO.
      }

      if (processQuantity <= 0) {
        toast.error('A quantidade deve ser de no mínimo 1.');
        return;
      }
      
      // 3. Lógica principal (se as validações passarem)
      setGeneratedLabels([]); // Limpa as etiquetas antigas

      // Usando setTimeout para simular a operação, como antes
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
   */
  const handlePrintAll = () => {
    if (generatedLabels.length === 0) return;

    const allZpl = generatedLabels.map(labelId => {
      const zplTemplate = `
      ^XA
      ^FO20,20^A0N,30,30^FDETIQUETA DE PROCESSO^FS
      ^FO20,60^BY2,2.0,60^BCN,60,N,N,N,A^FD${labelId}^FS
      ^FO40,130^A0N,25,25^FD${labelId}^FS
      ^XZ
      `;
      return zplTemplate.trim();
    }).join('\n\n');

    handlePrintRequest(allZpl);
  };

  /**
   * Limpa todos os campos de entrada e a lista de etiquetas geradas.
   */
  const handleClearAll = () => {
    setPackageId('');
    setProcessQuantity(1);
    setGeneratedLabels([]);
  };

  // ==========================================================
  // 3. RETORNO DO HOOK
  // Expondo todos os estados e funções que a UI precisará.
  // ==========================================================
  return {
    loading,
    packageId,
    setPackageId,
    processQuantity,
    setProcessQuantity,
    generatedLabels,
    zplToPrint,
    handlePrintRequest,
    handleGenerateLabels,
    handlePrintAll,
    handleClearAll,
  };
};