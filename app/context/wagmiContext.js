'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react'; 
import { polygon, sepolia } from '@reown/appkit/networks';
import React from 'react'; 
import { WagmiProvider } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID; 

// 2. Create a metadata object - optional
const metadata = {
    name: 'Primaris Metaversalwar',
    description: 'Heretics Redemption - $PRIMARIS AIRDROP',
    url: 'https://airdrop.metaversalwar.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 3. Set the networks
const networks = [ sepolia ]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export default function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
