import { LabelCard } from './components/LabelCard';
import { Header } from './components/Header';
import { useLabelGenerator } from './hooks/useLabelGenerator';
import { Button, Input, Label } from './components/ui';
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';

function App() {
   const {
    packageId,
    setPackageId,
    processQuantity,
    setProcessQuantity,
    generatedLabels,
    zplToPrint,
    handleGenerateLabels,
    handlePrintRequest,
    loading,
    handlePrintAll,
    handleClearAll,
  } = useLabelGenerator();


  return (
    <>
      <div className="app-container min-h-screen bg-muted pt-20">
        <Header />
        <main className="w-full max-w-5xl mx-auto px-4 sm:px-8">
          <div className="bg-background rounded-lg shadow-md p-6 mb-6">
            <div className=' mb-6'>
              <h1 className="text-2xl font-bold">Gerar etiquetas</h1>
              <span className='text-muted-foreground'>Insira uma etiqueta e adicione a quantidade para gerar a sequência.</span>
            </div>
            <form onSubmit={handleGenerateLabels} className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-grow">
                <Label htmlFor="packageId" className="block text-sm font-medium text-muted-foreground">Nº da Etiqueta do Pacote</Label>
                <Input
                  type="text" id="packageId" value={packageId} onChange={(e) => setPackageId(e.target.value)}
                  className="mt-1 block w-full border border-border rounded-md shadow-sm p-2"
                  placeholder='Insira a etiqueta do pacote (9020005689720)'
                />
              </div>
              <div className="flex-shrink-0">
                <Label htmlFor="processQuantity" className="block text-sm font-medium text-muted-foreground">Quantidade</Label>
                <Input
                  type="number" id="processQuantity" value={processQuantity} onChange={(e) => setProcessQuantity(Number(e.target.value))}
                  min="1" className="mt-1 block w-full border border-border rounded-md shadow-sm p-2"
                  
                />
              </div>
              
              {/* ========================================================== */}
              {/* 2. ADIÇÃO DO BOTÃO "LIMPAR" AO LADO DO BOTÃO "GERAR"     */}
              {/* ========================================================== */}
              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Gerar etiquetas"
                  )}
                </Button>
                <Button 
                  type="button" // Importante: 'type="button"' evita que o formulário seja enviado
                  onClick={handleClearAll}
                  variant={'destructive'}
                  title="Limpar campos e resultados"
                  disabled={loading}
                >
                  Limpar etiquetas
                </Button>
              </div>

            </form>
          </div>
         
          {generatedLabels.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold">Etiquetas Geradas</h2>
                <Button onClick={handlePrintAll}>
                  Imprimir Todas ({generatedLabels.length})
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto border max-h-[568px] p-2 rounded-2xl border-border">
                {generatedLabels.map((label) => (
                   <LabelCard key={label} labelId={label} onPrint={handlePrintRequest} />
                ))}
              </div>
              
            </>
          )}
        </main>
      </div>
      
      <pre id="print-area">{zplToPrint}</pre>
      <Toaster position="top-center"  richColors/>
    </>
  );
}

export default App;