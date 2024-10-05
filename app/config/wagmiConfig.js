import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { walletConnect } from 'wagmi/connectors';
import { polygon } from '@reown/appkit/networks';

// Obtener el projectId desde las variables de entorno

/*NEXT_PUBLIC_PRIMARIS_TOKEN_ADDRESS=0x529515C23c44C0d4057e13427cb54A2f52dC5c61
NEXT_PUBLIC_AIRDROP_ADDRESS=0xd6c0B010fbB8E33aE8fFf99c3209c18fF4eD0066 */

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Definir las redes (networks)
const networks = [polygon];

const metadata = {
    name: 'Primaris Metaversalwar',
    description: 'Heretics Redemption - $PRIMARIS AIRDROP',
    url: 'https://airdrop.metaversalwar.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const connectors = [
  walletConnect({
    projectId,
    metadata,
    showQrModal: true,
  })
];

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
