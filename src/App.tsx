// src/App.tsx
import { useState } from 'react';
import { LabelCard } from './components/LabelCard';
import { Header } from './components/Header';

function App() {
  const [packageId, setPackageId] = useState('9001941457766');
  const [processQuantity, setProcessQuantity] = useState<number>(5);
  const [generatedLabels, setGeneratedLabels] = useState<string[]>([]);
  const [zplToPrint, setZplToPrint] = useState('');

  const handlePrintRequest = (zplCode: string) => {
    setZplToPrint(zplCode);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleGenerateLabels = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageId || processQuantity <= 0) return;

    const labels: string[] = [];
    for (let i = 1; i <= processQuantity; i++) {
      const processNumber = String(i).padStart(3, '0');
      labels.push(`${packageId}-TJSP${processNumber}`);
    }
    setGeneratedLabels(labels);
  };

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
  
  // ==========================================================
  // 1. ADIÇÃO DA NOVA FUNÇÃO PARA LIMPAR O ESTADO
  // ==========================================================
  const handleClearAll = () => {
    setPackageId(''); // Limpa o campo de ID
    setProcessQuantity(1); // Reseta a quantidade para o valor mínimo
    setGeneratedLabels([]); // Limpa a lista de etiquetas geradas
  };

  return (
    <>
      <div className="app-container min-h-screen bg-gray-100 pt-20">
        <Header />
        <main className="w-full max-w-5xl mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className=' mb-6'>
              <h1 className="text-2xl font-bold text-gray-800">Gerar etiquetas</h1>
              <span className='text-gray-600'>Insira uma etiqueta e adicione a quantidade para gerar a sequência.</span>
            </div>
            <form onSubmit={handleGenerateLabels} className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-grow">
                <label htmlFor="packageId" className="block text-sm font-medium text-gray-700">Nº da Etiqueta do Pacote</label>
                <input
                  type="text" id="packageId" value={packageId} onChange={(e) => setPackageId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="flex-shrink-0">
                <label htmlFor="processQuantity" className="block text-sm font-medium text-gray-700">Quantidade</label>
                <input
                  type="number" id="processQuantity" value={processQuantity} onChange={(e) => setProcessQuantity(Number(e.target.value))}
                  min="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              {/* ========================================================== */}
              {/* 2. ADIÇÃO DO BOTÃO "LIMPAR" AO LADO DO BOTÃO "GERAR"     */}
              {/* ========================================================== */}
              <div className="flex space-x-2">
                <button type="submit" className="w-auto bg-blue-800 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer">
                  Gerar etiquetas
                </button>
                <button 
                  type="button" // Importante: 'type="button"' evita que o formulário seja enviado
                  onClick={handleClearAll}
                  className="w-auto bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 cursor-pointer"
                  title="Limpar campos e resultados"
                >
                  Limpar
                </button>
              </div>

            </form>
          </div>

          {generatedLabels.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-gray-700">Etiquetas Geradas</h2>
                <button onClick={handlePrintAll} className="bg-blue-700 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-800 cursor-pointer">
                  Imprimir Todas ({generatedLabels.length})
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto border max-h-[568px] p-2 rounded-2xl border-gray-200">
                {generatedLabels.map((label) => (
                  <LabelCard key={label} labelId={label} onPrint={handlePrintRequest} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      
      <pre id="print-area">{zplToPrint}</pre>
    </>
  );
}

export default App;