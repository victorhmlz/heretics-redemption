// config/index.js

import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { polygon, sepolia } from '@reown/appkit/networks';

// Obtener el projectId desde las variables de entorno
export const projectId = "f9eb89d91dd8f8d0e0352d2badf20f5d";

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Definir las redes (networks)
const networks = [polygon, sepolia];

// Configurar el adaptador de Wagmi
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
});

// Exportar la configuración de Wagmi
export const config = wagmiAdapter.wagmiConfig;
