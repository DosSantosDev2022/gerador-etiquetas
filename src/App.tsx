// src/App.tsx
import { Footer, Header , LabelCard } from './components/global';
import { useLabelGenerator } from './hooks/useLabelGenerator';
import { Button, Input, Label } from './components/ui';
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';

function App() {
  // 1. AJUSTE: Removemos 'zplToPrint' e 'handlePrintRequest' e adicionamos 'handlePrintSingleLabel'
  const {
    packageId,
    setPackageId,
    processQuantity,
    setProcessQuantity,
    generatedLabels,
    loading,
    handleGenerateLabels,
    handlePrintAll,
    handleClearAll,
    handlePrintSingleLabel, // <-- A nova função para impressão individual
  } = useLabelGenerator();

  return (
    <>
      <div className="app-container min-h-screen flex flex-col bg-muted ">
        <Header />
        <main className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-20 flex-grow">
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
                  type="button"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto border max-h-[568px] scrollbar-custom p-2 rounded-2xl border-border">
                {generatedLabels.map((label) => (
                  // 2. AJUSTE: Passamos a nova função 'handlePrintSingleLabel' para o onPrint.
                  <LabelCard key={label} labelId={label} onPrint={handlePrintSingleLabel} />
                ))}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
      
      {/* 3. AJUSTE: A tag <pre> foi removida pois não é mais necessária com a impressão direta. */}
      <Toaster position="top-center" richColors/>
    </>
  );
}

export default App;