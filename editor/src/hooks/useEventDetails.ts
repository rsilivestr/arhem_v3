import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { useSearchParams } from 'next/navigation';

import { API_BASE_URL } from '@/config';
import { useSession } from '@/store/session';
import { EventDetailsResponse } from '@/types';

export function useEventDetails() {
  const query = useSearchParams();
  const eventId = query.get('event');
  const { token } = useSession();

  const { data } = useQuery({
    queryKey: ['events', eventId],
    enabled: !!(eventId && token),
    queryFn: async () => {
      if (!eventId || !token) {
        return;
      }
      return await ky
        .get(`${API_BASE_URL}/event_shema/${eventId}`, {
          headers: { token },
        })
        .json<EventDetailsResponse>();
    },
    staleTime: 10_000,
  });

  return {
    ...data,
    id: eventId,
  };
}
