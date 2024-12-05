import Link from 'next/link';

import { UserMenu } from '@/components/UserMenu';
import { useTokenVerification } from '@/hooks/useRedirect';

import { SpinnerIcon } from './icons/SpinnerIcon';

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  const isVerified = useTokenVerification();

  return (
    <div className="flex flex-col min-h-screen bg-slate-200 dark:bg-slate-900 text-slate-950 dark:text-white">
      <header className="h-14 px-4 flex items-center text-white bg-pink-800">
        <Link href="/" className="text-lg font-bold">
          Arhm Editr
        </Link>
        <div className="ml-auto">
          <UserMenu />
        </div>
      </header>
      <main className="h-0 grow">
        {isVerified ? (
          children
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <SpinnerIcon width={80} height={80} className="animate-spin" />
          </div>
        )}
      </main>
    </div>
  );
}
