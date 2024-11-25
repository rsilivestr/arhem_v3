import '@pixi/events';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';

import './globals.css';
import { Providers } from './components/Providers';

const firaCode = localFont({
  src: './fonts/FiraCodeVF.woff2',
  variable: '--font-fira-code',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Arhm Editr',
  icons: ['favicon.svg'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`flex flex-col min-h-screen ${firaCode.variable} antialiased`}
      >
        <header className="p-4 flex text-white bg-pink-800">
          <Link href="/" className="text-lg font-bold">
            Arhm Editr
          </Link>
        </header>
        <Providers>
          <main className="h-0 grow bg-slate-100 dark:bg-slate-900">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
