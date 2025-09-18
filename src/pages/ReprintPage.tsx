// src/pages/ReprintPage.tsx
import { LabelCard } from '../components/global';
import { useReprintLabel } from '../hooks/useReprintLabel';
import { Button, Label, Textarea } from '@/components/ui';
import { Download, Loader2, Usb } from 'lucide-react';

export function ReprintPage() {
  const {
    labelsToReprint,
    setLabelsToReprint,
    generatedLabels,
    loading,
    printerConnected,
    handlePrepareLabels,
    handleClearAll,
    handleConnectPrinter,
    handlePrintWebUsb,
    handlePrintAllWebUsb,
    handleDownloadZplFile
  } = useReprintLabel();

  return (
    <>
      <div className="bg-background rounded-lg shadow-md p-6 mb-6">
        <div className='mb-6'>
          <h1 className="text-2xl font-bold">Reimprimir etiquetas</h1>
          <span className='text-muted-foreground'>Insira uma ou mais etiquetas (uma por linha) para reimprimir.</span>
        </div>
        <form onSubmit={handlePrepareLabels} className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-grow">
            <Label htmlFor="labelsToReprint">Etiquetas para Reimprimir</Label>
             <Textarea
                id="labelsToReprint"
                value={labelsToReprint}
                onChange={(e) => setLabelsToReprint(e.target.value)}
                
                // 2. Adicionamos uma altura mínima para o campo ficar mais visível
                className="mt-1 min-h-[100px]"
                
                // 3. Melhoramos o placeholder para guiar o usuário
                placeholder='9001941457766-TJSP001&#10;9001941457766-TJSP002&#10;9001941457766-TJSP003'
              />
          </div>
          <div className="flex space-x-2 self-end">
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparando...</> : "Preparar"}
            </Button>
            <Button type="button" onClick={handleClearAll} variant={'destructive'} title="Limpar campos e resultados" disabled={loading}>
              Limpar
            </Button>
          </div>
        </form>
      </div>
      
      {/* O resto da página (conexão e lista de etiquetas) é IDÊNTICO à GeneratePage */}
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

     {generatedLabels.length > 0 && (
       <>
         <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold">Etiquetas para Reimpressão</h2>
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