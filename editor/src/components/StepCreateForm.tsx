import cuid from '@bugsnag/cuid';
import { CheckIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { API_BASE_URL } from '@/config';
import { required } from '@/constants';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEditorGrid } from '@/store/editor/grid';
import { useSession } from '@/store/session';
import { StepData } from '@/types';

import { SpinnerIcon } from './icons/SpinnerIcon';
import { TextareaField } from './TextareaField';
import { TextField } from './TextField';

type StepCreateFields = Omit<StepData, 'id' | 'event_id' | 'image'>;

export function StepCreateForm() {
  const { activeCell } = useEditorGrid();
  const {
    isError,
    isIdle,
    isPending,
    isSuccess,
    mutate: createStep,
  } = useStepCreateMutation();
  const { handleSubmit, register } = useStepCreateForm();

  const onSubmit = handleSubmit((data) => {
    createStep(data);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 items-stretch">
      <TextField label="Название" {...register('name', { required })} />
      <TextField label="Код" {...register('code', { required })} />
      <TextareaField label="Текст" {...register('text')} />
      <label className="self-start">
        <input type="checkbox" {...register('start')} />
        <span className="pl-2 text-xs font-bold">Стартовый</span>
      </label>
      <div className="flex gap-2">
        <TextField
          className="grow"
          label="Колонка"
          type="number"
          step={1}
          min={1}
          max={999}
          defaultValue={activeCell?.col}
          {...register('col', { valueAsNumber: true })}
        />
        <TextField
          className="grow"
          label="Строка"
          type="number"
          step={1}
          min={1}
          max={999}
          defaultValue={activeCell?.row}
          {...register('row', { valueAsNumber: true })}
        />
        <button
          className="h-8 pl-8 pr-2 self-end relative flex items-center justify-center gap-2 text-white bg-green-600 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-700"
          disabled={isPending}
          type="submit"
        >
          <span className="absolute left-2">
            {isIdle && <PlusIcon className="w-5 h-5" />}
            {isPending && <SpinnerIcon className="w-5 h-5 animate-spin" />}
            {isSuccess && <CheckIcon className="w-5 h-5" />}
            {isError && <Cross2Icon className="w-5 h-5" />}
          </span>
          <span>Создать</span>
        </button>
      </div>
    </form>
  );
}

function useStepCreateMutation() {
  const queryClient = useQueryClient();
  const { event } = useEventDetails();
  const { token } = useSession();

  return useMutation({
    mutationFn: async (data: StepCreateFields) => {
      if (!token) {
        throw new Error('Залогиньтесь');
      }
      if (!event) {
        throw new Error('Нельзя создать шаг без ивента');
      }
      return await ky.post(`${API_BASE_URL}/event_step`, {
        headers: { token },
        json: {
          id: cuid(),
          event_id: event.id,
          image: null,
          ...data,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', event!.id] });
    },
  });
}

function useStepCreateForm() {
  const { activeCell } = useEditorGrid();
  const formMethods = useForm<StepCreateFields>();
  const { setValue } = formMethods;

  useEffect(() => {
    if (activeCell?.col) {
      setValue('col', activeCell.col);
    }
  }, [activeCell?.col, setValue]);

  useEffect(() => {
    if (activeCell?.row) {
      setValue('row', activeCell.row);
    }
  }, [activeCell?.row, setValue]);

  return formMethods;
}
