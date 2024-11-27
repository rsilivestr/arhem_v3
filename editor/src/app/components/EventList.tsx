'use client';

import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { API_BASE_URL } from '@/config';
import { useSession } from '@/store/session';

import { SearchIcon } from './icons/SearchIcon';

type EventsRespose = Array<{
  guid: string;
  name: string;
  code_name: string;
  description: string | null;
  image: string | null;
  date_create: string;
  date_update: string;
  user: string;
}>;

export function EventList() {
  const { token } = useSession();

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      if (!token) {
        throw new Error('Нет токена');
      }
      return await ky
        .get<EventsRespose>(`${API_BASE_URL}/events`, {
          headers: { token },
        })
        .json();
    },
    enabled: !!token,
  });

  const [filterTerm, setFilterTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events || []);

  useEffect(() => {
    if (!events) {
      return;
    }
    const tid = setTimeout(() => {
      const term = filterTerm.trim().toLocaleLowerCase();
      setFilteredEvents(
        term.length > 0
          ? events.filter(
              ({ name, code_name }) =>
                name.toLocaleLowerCase().includes(term) ||
                code_name.toLocaleLowerCase().includes(term)
            )
          : events
      );
    }, 300);
    return () => {
      clearTimeout(tid);
    };
  }, [events, filterTerm]);

  return (
    <aside className="min-w-[400px]">
      <div className="relative">
        <SearchIcon className="absolute h-full w-auto p-2" />
        <input
          type="search"
          className="w-full pl-10 pr-4 py-2 dark:bg-slate-700"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
        />
      </div>
      <ul>
        {filteredEvents?.map((evt) => (
          <li
            key={evt.guid}
            className="border-b border-slate-200 dark:border-slate-700"
          >
            <Link
              href={{ query: { event: evt.guid } }}
              className="px-4 py-2 flex flex-col hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {evt.name}
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {evt.code_name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
