import '@pixi/events';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';

const firaCode = localFont({
  src: './fonts/FiraCodeVF.woff2',
  variable: '--font-fira-code',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Arhm Editr',
  icons: ['favicon.svg']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${firaCode.variable} antialiased`}>{children}</body>
    </html>
  );
}
