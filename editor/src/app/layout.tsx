import '@pixi/events';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';

import { Providers } from './components/Providers';
import { UserMenu } from './components/UserMenu';
import './globals.css';

const firaCode = localFont({
  src: './fonts/FiraCodeVF.woff2',
  variable: '--font-fira-code',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Arhm Editr',
  icons: ['/editor/favicon.svg'],
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
        <header className="h-14 px-4 flex items-center text-white bg-pink-800">
          <Link href="/" className="text-lg font-bold">
            Arhm Editr
          </Link>
          <div className="ml-auto">
            <UserMenu />
          </div>
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
