'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react'; 
import { polygon } from '@reown/appkit/networks';
import React from 'react'; 
import { WagmiProvider } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { walletConnect } from 'wagmi/connectors';

const queryClient = new QueryClient();

// 1. Obtener projectId de WalletConnect Cloud
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const metadata = {
    name: 'Primaris Metaversalwar',
    description: 'Heretics Redemption - $PRIMARIS AIRDROP',
    url: 'https://airdrop.metaversalwar.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 2. Solo habilitar WalletConnect como conector
const connectors = [];
connectors.push(walletConnect({ projectId, metadata, showQrModal: true }));  // Muestra el modal QR

// 3. Establecer la red (Polygon o la que necesites)
export const networks = [polygon];

// 4. Crear el adaptador de Wagmi
export const wagmiAdapter = new WagmiAdapter({
  storage: undefined,
  connectors,   // Solo WalletConnect
  projectId,
  networks
});

export const config = wagmiAdapter.wagmiConfig;

// 5. Crear AppKit con solo WalletConnect
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  features: {
    analytics: true // Opcional
  }
});

// 6. Función que provee el contexto
export default function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
