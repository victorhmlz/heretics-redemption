'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { polygon } from '@reown/appkit/networks';
import React from 'react'; 
import { WagmiProvider, cookieToInitialState } from 'wagmi';
import { wagmiAdapter } from '../config/wagmiConfig';

const queryClient = new QueryClient();

// 1. Obtener projectId de WalletConnect Cloud
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const metadata = {
    name: 'Primaris Metaversalwar',
    description: 'Heretics Redemption - $PRIMARIS AIRDROP',
    url: 'https://airdrop.metaversalwar.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};


// 5. Crear AppKit con solo WalletConnect
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [polygon],
  defaultNetwork: polygon,
  metadata: metadata,
  features: {
    analytics: true 
  }
});

function ContextProvider({ children, cookies }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider
