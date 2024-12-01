import type { AppProps } from 'next/app';
import localFont from 'next/font/local';

import { Layout } from '@/components/AppLayout';
import { Providers } from '@/components/Providers';

import './globals.css';

const firaCode = localFont({
  src: '../assets/fonts/FiraCodeVF.woff2',
  variable: '--font-fira-code',
  weight: '100 900',
});

export default function ArhmEditr({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Layout>
        <style jsx global>{`
          html {
            font-family: ${firaCode.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  );
}
