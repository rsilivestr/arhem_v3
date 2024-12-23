import {
  MagnifyingGlassIcon,
  Pencil1Icon,
  PlusIcon,
} from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import { useEffect, useState } from 'react';

import { useEventDetails } from '@/hooks/useEventDetails';
import { useEditorGrid } from '@/store/editor/grid';

import { EventCreateForm } from './EventCreateForm';
import { EventEditForm } from './EventEditForm';
import { StepCreateForm } from './StepCreateForm';
import { TextField } from './TextField';

type Props = {
  filterTerm: string;
  onFilterChange(filter: string): void;
};

export function EventNavActions({ filterTerm, onFilterChange }: Props) {
  const { event } = useEventDetails();
  const { activeCell, activeStep } = useEditorGrid();
  const [tab, setTab] = useState('none');

  const handleTabPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.currentTarget.disabled) {
      e.preventDefault();
    }
    if (e.currentTarget.dataset.state === 'active') {
      // Prevent tab re-activation
      e.preventDefault();
      setTab('none');
    }
  };

  useEffect(() => {
    if (activeCell) {
      if (!activeStep) setTab('step-create');
    }
  }, [activeCell, activeStep]);

  // TODO reset tab on redirect from event

  return (
    <Tabs.Root defaultValue="none" value={tab} onValueChange={setTab}>
      <Tabs.List className="relative flex w-full h-10 bg-slate-350 dark:bg-slate-800">
        <Tabs.Trigger
          value="event-search"
          aria-label="Найти ивенты"
          title="Найти ивенты"
          className="data-[state=active]:bg-slate-300 hover:bg-slate-400 dark:data-[state=active]:bg-slate-900 dark:hover:bg-slate-700"
          onPointerDown={handleTabPointerDown}
        >
          <MagnifyingGlassIcon className="h-10 w-10 p-2 " />
        </Tabs.Trigger>
        <Tabs.Trigger
          value="event-create"
          aria-label="Создать ивент"
          title="Создать ивент"
          className="data-[state=active]:bg-slate-300 enabled:hover:bg-slate-400 dark:data-[state=active]:bg-slate-900 enabled:dark:hover:bg-slate-700 disabled:cursor-not-allowed"
          onPointerDown={handleTabPointerDown}
        >
          <PlusIcon className="h-10 w-10 p-2" />
        </Tabs.Trigger>
        <Tabs.Trigger
          disabled={!event}
          value="event-edit"
          aria-label={
            event ? 'Редактировать ивент' : 'Не выбран ивент для редактирования'
          }
          title={
            event ? 'Редактировать ивент' : 'Не выбран ивент для редактирования'
          }
          className="data-[state=active]:bg-slate-300 enabled:hover:bg-slate-400 dark:data-[state=active]:bg-slate-900 enabled:dark:hover:bg-slate-700 disabled:cursor-not-allowed"
          onPointerDown={handleTabPointerDown}
        >
          <Pencil1Icon className="h-10 w-10 p-2 " />
        </Tabs.Trigger>
        <Tabs.Trigger
          disabled={!event}
          value="step-create"
          aria-label="Создать шаг"
          title="Создать шаг"
          className="data-[state=active]:bg-slate-300 enabled:hover:bg-slate-400 dark:data-[state=active]:bg-slate-900 enabled:dark:hover:bg-slate-700 disabled:cursor-not-allowed"
          onPointerDown={handleTabPointerDown}
        >
          <PlusIcon className="h-10 w-10 p-2" />
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="event-create" className="p-4">
        <EventCreateForm />
      </Tabs.Content>
      <Tabs.Content value="event-edit" className="p-4">
        <EventEditForm event={event!} />
      </Tabs.Content>
      <Tabs.Content value="event-search" className="p-4">
        <TextField
          label="Искать по названию и коду"
          value={filterTerm}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </Tabs.Content>
      <Tabs.Content value="step-create" className="p-4">
        <StepCreateForm />
      </Tabs.Content>
    </Tabs.Root>
  );
}
