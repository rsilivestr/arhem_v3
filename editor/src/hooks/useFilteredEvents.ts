import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { useEffect, useState } from 'react';

import { API_BASE_URL } from '@/config';
import { useSession } from '@/store/session';
import { EventsRespose } from '@/types';

export function useFilteredEvents() {
  const { token } = useSession();

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      if (!token) {
        throw new Error('Залогиньтесь');
      }
      return await ky
        .get(`${API_BASE_URL}/events`, {
          headers: { token },
        })
        .json<EventsRespose>();
    },
    enabled: !!token,
  });

  const [filterTerm, setFilterTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);

  useEffect(() => {
    if (!events) {
      return;
    }
    const tid = setTimeout(() => {
      const term = filterTerm.trim().toLocaleLowerCase();
      setFilteredEvents(
        term.length > 0
          ? events.filter(
              ({ name, code }) =>
                name.toLocaleLowerCase().includes(term) ||
                code?.toLocaleLowerCase().includes(term)
            )
          : events
      );
    }, 300);
    return () => {
      clearTimeout(tid);
    };
  }, [events, filterTerm]);

  return {
    events: filteredEvents,
    setFilterTerm,
  };
}
