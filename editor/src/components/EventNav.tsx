import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import clsx from 'clsx';
import { useState } from 'react';

import { EventList } from '@/components/EventList';

export function EventNav() {
  const [isOpen, setIsOpen] = useState(true);
  const [filterTerm, setFilterTerm] = useState('');

  return (
    <aside
      className={clsx(
        'relative flex flex-col bg-slate-300 dark:bg-slate-900',
        isOpen ? 'min-w-[400px]' : 'w-0'
      )}
    >
      {isOpen ? (
        <>
          <div className="flex">
            <button
              className="w-10 h-10 text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500"
              type="button"
            >
              <PlusIcon className="w-full h-full p-2" />
            </button>
            <div className="relative grow">
              <MagnifyingGlassIcon className="absolute h-full w-auto p-2" />
              <input
                type="search"
                className="w-full pl-10 pr-4 py-2 dark:bg-slate-600"
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
              />
            </div>
            <button
              className="w-10 h-10 text-white bg-slate-400 hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-400"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              <DoubleArrowLeftIcon className="w-full h-full p-2" />
            </button>
          </div>
          <EventList filter={filterTerm} />
        </>
      ) : (
        <button
          className="absolute left-[100%] w-10 h-10 text-white bg-slate-400 hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-400"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <DoubleArrowRightIcon className="w-full h-full p-2" />
        </button>
      )}
    </aside>
  );
}
