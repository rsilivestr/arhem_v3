import clsx from 'clsx';
import Link from 'next/link';

import { useEventDetails } from '@/hooks/useEventDetails';
import { EventsRespose } from '@/types';

import { SpinnerIcon } from './icons/SpinnerIcon';

type Props = {
  events?: EventsRespose;
};

export function EventList({ events }: Props) {
  const { id: selectedEventId } = useEventDetails();

  return events ? (
    <ul className="overflow-auto">
      {events.map((evt) => (
        <li
          key={evt.id}
          className={clsx(
            'border-b border-slate-200 dark:border-slate-700',
            evt.id === selectedEventId && 'bg-slate-200 dark:bg-slate-750'
          )}
        >
          <Link
            href={{ query: { event: evt.id } }}
            className={clsx(
              'px-4 py-2 flex flex-col border-l-4',
              evt.id === selectedEventId
                ? 'border-pink-900'
                : 'border-transparent hover:bg-slate-250 dark:hover:bg-slate-850'
            )}
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {evt.name}
            </span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {evt.code ?? '\xa0'}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <div className="w-full p-8 text-center">
      <SpinnerIcon className="inline w-8 h-8 animate-spin" />
    </div>
  );
}
