import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { API_BASE_URL } from '@/config';
import { useSession } from '@/store/session';

function isAdminPage(pathname: string) {
  return pathname.startsWith('/editor');
}

export function useTokenVerification() {
  const { token, put: setSession } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  const { data: isValid } = useQuery({
    queryKey: ['token'],
    queryFn: async () => {
      if (!token) {
        return false;
      }
      if (isAdminPage(pathname)) {
        return await ky
          .post(`${API_BASE_URL}/check_token`, { json: { token } })
          .json<boolean>();
      }
      return await ky
        .post(`${API_BASE_URL}/check_token`, { json: { token } })
        .json<boolean>();
    },
  });

  useEffect(() => {
    if (pathname === '/login') {
      return;
    }
    if (!token) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, token]);

  useEffect(() => {
    if (typeof isValid === 'undefined') {
      return;
    }
    setIsVerified(true);
    if (!isValid) {
      setSession({ username: null, token: null });
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  return isVerified;
}
