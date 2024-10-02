import { Oxanium } from 'next/font/google';
import './globals.css';

const oxanium = Oxanium({ subsets: ['latin'] });

import { headers } from 'next/headers'; // agregado
import ContextProvider from '@/app/context/wagmiContext';

export const metadata = {
  title: 'Heretics Redemption',
  description: 'Metaversalwar Airdrop',
};

export default function RootLayout({ children }) {
  const cookies = headers().get('cookie');

  return (
    <html lang="en">
      <body className={oxanium.className}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}