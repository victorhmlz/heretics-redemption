// config/index.js

import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { polygon, sepolia } from '@reown/appkit/networks';

// Obtener el projectId desde las variables de entorno
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

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
