// src/services/webUsbService.ts

// Variáveis para manter o estado da conexão globalmente neste módulo
let device: USBDevice | null = null;
let endpointNumber: number | null = null;

// O Vendor ID (VID) para a maioria das impressoras Zebra é 0x0A5F.
// Isso filtra a lista de dispositivos que o navegador mostra ao usuário.
const ZEBRA_VENDOR_ID = 0x0A5F;

/**
 * Conecta-se à impressora Zebra. Pede permissão ao usuário, abre o dispositivo,
 * seleciona a configuração e reivindica a interface para uso.
 */
export const connectToPrinter = async (): Promise<void> => {
  try {
    // Solicita ao usuário que escolha um dispositivo USB que corresponda ao filtro
    device = await navigator.usb.requestDevice({
      filters: [{ vendorId: ZEBRA_VENDOR_ID }],
    });

    await device.open(); // Abre a conexão com o dispositivo
    await device.selectConfiguration(1); // Seleciona a configuração do dispositivo
    await device.claimInterface(0); // Reivindica a interface da impressora para uso exclusivo

    // Encontra o endpoint de saída (OUT) para enviar os dados
    const anInterface = device.configuration?.interfaces[0];
    const anEndpoint = anInterface?.alternate.endpoints.find(e => e.direction === 'out');
    
    if (!anEndpoint) {
      throw new Error("Não foi possível encontrar o endpoint de saída da impressora.");
    }

    endpointNumber = anEndpoint.endpointNumber;
    console.log("Impressora Zebra conectada e pronta para uso.", device);

  } catch (error) {
    console.error("Falha ao conectar com a impressora WebUSB:", error);
    // Garante que o estado seja limpo em caso de erro
    device = null;
    endpointNumber = null;
    throw error; // Propaga o erro para ser tratado pela UI
  }
};

/**
 * Envia uma string de comando ZPL para a impressora conectada.
 */
export const sendZplToPrinter = async (zpl: string): Promise<void> => {
  if (!device || !endpointNumber) {
    throw new Error("Impressora não está conectada. Por favor, conecte-se primeiro.");
  }

  try {
    // Converte a string ZPL em um formato binário (Uint8Array) que a API WebUSB pode enviar
    const encoder = new TextEncoder();
    const zplData = encoder.encode(zpl);

    // Envia os dados para o endpoint de saída da impressora
    await device.transferOut(endpointNumber, zplData);
    
  } catch (error) {
    console.error("Falha ao enviar ZPL para a impressora:", error);
    throw error;
  }
};

/**
 * Retorna se a impressora está atualmente conectada e configurada.
 */
export const isPrinterConnected = (): boolean => {
  return device !== null && endpointNumber !== null;
};