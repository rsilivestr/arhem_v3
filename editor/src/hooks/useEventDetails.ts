import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { API_BASE_URL } from '@/config';
import { useEditorGrid } from '@/store/editor/grid';
import { useSession } from '@/store/session';
import { EventDetailsResponse } from '@/types';

export function useEventDetails() {
  const query = useSearchParams();
  const eventId = query.get('event');
  const { token } = useSession();
  const { setEvent, setSteps } = useEditorGrid();

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

  useEffect(() => {
    if (data) {
      setEvent(data.event);
      setSteps(data.steps);
      console.log(data.steps);
    }
  }, [data]);

  return {
    ...data,
    id: eventId,
  };
}
