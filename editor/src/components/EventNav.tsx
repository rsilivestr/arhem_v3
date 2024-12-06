import clsx from 'clsx';
import { useState } from 'react';

import { EventList } from '@/components/EventList';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';

import { EventNavActions } from './EventNavActions';

export function EventNav() {
  const [isOpen, setIsOpen] = useState(true);

  const { events, setFilterTerm } = useFilteredEvents();

  return (
    <aside
      className={clsx(
        'relative flex flex-col bg-slate-300 dark:bg-slate-900',
        isOpen ? 'min-w-[400px]' : 'w-0'
      )}
    >
      <EventNavActions
        open={isOpen}
        onOpenChange={setIsOpen}
        onFilterChange={setFilterTerm}
      />
      <EventList events={events} />
    </aside>
  );
}
