import { Oxanium } from 'next/font/google';
import './globals.css';
import { Web3Provider } from '@/app/context/web3Context'; // Importar Web3Provider

const oxanium = Oxanium({ subsets: ['latin'] });

export const metadata = {
  title: 'Heretics Redemption',
  description: 'Metaversalwar Airdrop',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={oxanium.className}>
        {/* Envolver la aplicación dentro del Web3Provider */}
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
