// src/pages/GeneratePage.tsx
// Copie e cole todo o conteúdo do seu App.tsx antigo para cá,
// mas remova o Header, Footer e Toaster, pois eles já estão no Layout.

import { LabelCard } from '../components/global';
import { useLabelGenerator } from '../hooks/useLabelGenerator';
import { Button, Input, Label } from '../components/ui';
import { Download, Loader2, Usb } from 'lucide-react';

export function GeneratePage() {
  const {
    packageId,
    setPackageId,
    processQuantity,
    setProcessQuantity,
    generatedLabels,
    loading,
    printerConnected,
    handleGenerateLabels,
    handleClearAll,
    handleConnectPrinter,
    handlePrintWebUsb, 
    handlePrintAllWebUsb,
    handleDownloadZplFile
  } = useLabelGenerator();

  return (
    <>
      {/* O conteúdo do seu <main> antigo vem aqui */}
      <div className="bg-background rounded-lg shadow-md p-6 mb-6">
        <div className=' mb-6'>
          <h1 className="text-2xl font-bold">Gerar etiquetas</h1>
          <span className='text-muted-foreground'>Insira uma etiqueta e adicione a quantidade para gerar a sequência.</span>
        </div>
        <form onSubmit={handleGenerateLabels} className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-grow">
            <Label htmlFor="packageId">Nº da Etiqueta do Pacote</Label>
            <Input
              type="text" id="packageId" value={packageId} onChange={(e) => setPackageId(e.target.value)}
              className="mt-1"
              placeholder='Insira a etiqueta do pacote'
            />
          </div>
          <div className="flex-shrink-0">
            <Label htmlFor="processQuantity">Quantidade</Label>
            <Input
              type="number" id="processQuantity" value={processQuantity} onChange={(e) => setProcessQuantity(Number(e.target.value))}
              min="1" className="mt-1"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" disabled={loading}>
              {loading && !generatedLabels.length ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</> : "Gerar etiquetas"}
            </Button>
            <Button type="button" onClick={handleClearAll} variant={'destructive'} title="Limpar campos e resultados" disabled={loading}>
              Limpar
            </Button>
          </div>
        </form>
      </div>
      
      {/* Seção de Conexão da Impressora */}
      {!printerConnected ? (
         <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6" role="alert">
            <p className="font-bold">Ação Necessária</p>
            <p className='mb-4'>Para impressão direta, conecte sua impressora Zebra via USB.</p>
            <Button onClick={handleConnectPrinter} disabled={loading} variant="outline">
              <Usb className="mr-2 h-4 w-4" />
              {loading ? 'Aguarde...' : 'Conectar à Impressora USB'}
            </Button>
          </div>
      ) : (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p className="font-bold">Impressora Conectada</p>
            <p>Você já pode imprimir diretamente nas etiquetas geradas.</p>
          </div>
      )}

      {/* Seção de Etiquetas Geradas */}
      {generatedLabels.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Etiquetas Geradas</h2>
            <div className='flex items-center justify-end gap-2'>
              <Button onClick={handleDownloadZplFile} variant="outline" disabled={loading}>
                <Download className="mr-2 h-4 w-4" /> Baixar .zpl
              </Button>
              <Button onClick={handlePrintAllWebUsb} disabled={loading || !printerConnected} title={!printerConnected ? "Você precisa conectar a impressora primeiro" : "Imprimir todas as etiquetas"}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Imprimindo...</> : `Imprimir Todas (${generatedLabels.length})`}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto border max-h-[568px] scrollbar-custom p-2 rounded-2xl border-border">
            {generatedLabels.map((label) => (
              <LabelCard 
                key={label} 
                labelId={label} 
                onPrint={handlePrintWebUsb}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}