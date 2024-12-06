import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';

import { EventCreateForm } from './EventCreateForm';
import { TextField } from './TextField';

type Props = {
  open: boolean;
  onOpenChange(open: boolean): void;
  onFilterChange(filter: string): void;
};

export function EventNavActions({ open, onOpenChange, onFilterChange }: Props) {
  const [tab, setTab] = useState('none');

  const handleTabPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.currentTarget.dataset.state === 'active') {
      // Prevent tab re-activation
      e.preventDefault();
      setTab('none');
    }
  };

  return (
    <div className="relative">
      {open ? (
        <Tabs.Root
          className="mb-6"
          defaultValue="none"
          value={tab}
          onValueChange={setTab}
        >
          <Tabs.List className="relative flex w-full h-10 bg-slate-350 dark:bg-slate-800">
            <>
              <Tabs.Trigger
                value="create"
                aria-label="Создать ивент"
                title="Создать ивент"
                className="data-[state=active]:bg-slate-300 hover:bg-slate-400 dark:data-[state=active]:bg-slate-900 dark:hover:bg-slate-700"
                onPointerDown={handleTabPointerDown}
              >
                <PlusIcon className="h-10 w-10 p-2" />
              </Tabs.Trigger>
              <Tabs.Trigger
                value="search"
                aria-label="Найти ивенты"
                title="Найти ивенты"
                className="data-[state=active]:bg-slate-300 hover:bg-slate-400 dark:data-[state=active]:bg-slate-900 dark:hover:bg-slate-700"
                onPointerDown={handleTabPointerDown}
              >
                <MagnifyingGlassIcon className="h-10 w-10 p-2 " />
              </Tabs.Trigger>
              <button
                aria-label="Скрыть боковую панель"
                title="Скрыть боковую панель"
                className="ml-auto hover:bg-slate-400 dark:hover:bg-slate-700"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                <DoubleArrowLeftIcon className="h-10 w-10 p-2" />
              </button>
            </>
          </Tabs.List>
          <Tabs.Content value="create" className="p-4">
            <EventCreateForm />
          </Tabs.Content>
          <Tabs.Content value="search" className="p-4">
            <TextField
              label="Искать по названию"
              onChange={(e) => onFilterChange(e.target.value)}
            />
          </Tabs.Content>
        </Tabs.Root>
      ) : (
        <button
          aria-label="Показать боковую панель"
          title="Показать боковую панель"
          className="absolute left-full bg-slate-350 hover:bg-slate-400 dark:bg-slate-900 dark:hover:bg-slate-700"
          type="button"
          onClick={() => onOpenChange(true)}
        >
          <DoubleArrowRightIcon className="h-10 w-10 p-2" />
        </button>
      )}
    </div>
  );
}
