'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react'; 
import { polygon, sepolia } from '@reown/appkit/networks';
import React from 'react'; 
import { http, WagmiProvider, CreateConnectorFn } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { injected, metaMask, safe, walletConnect, coinbaseWallet } from 'wagmi/connectors'

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

const connectors = [];
connectors.push(injected({ shimDisconnect: true })); // Inyectado (por ejemplo, para Metamask directamente)
connectors.push(walletConnect({ projectId, metadata, showQrModal: false })); // Conector de WalletConnect
connectors.push(coinbaseWallet({ appName: metadata.name, appLogoUrl: metadata.icons[0] })); // Conector de Coinbase Wallet
connectors.push(metaMask({ shimDisconnect: true })); // Conector específico de MetaMask
connectors.push(safe()); // Conector Safe (Gnosis Safe)

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  transports: {
    [sepolia.id]: http(),
  },
  networks,
  connectors,
  projectId,
  ssr: true
});

export const config = wagmiAdapter.wagmiConfig;

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [sepolia],
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
