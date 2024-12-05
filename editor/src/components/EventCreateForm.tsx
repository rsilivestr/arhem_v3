import cuid from '@bugsnag/cuid';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
import { useForm, ValidationRule } from 'react-hook-form';

import { useSession } from '@/store/session';

import { SpinnerIcon } from './icons/SpinnerIcon';
import { TextField } from './TextField';

type EventCreateFields = {
  name: string;
  code: string;
  description: string;
  image?: string;
  max_cols: number;
  max_rows: number;
};

const required: ValidationRule<boolean> = {
  value: true,
  message: 'Поле обязательно',
};

export function EventCreateForm() {
  const { token } = useSession();
  const { handleSubmit, register, reset } = useForm<EventCreateFields>();
  const queryClient = useQueryClient();

  const {
    error,
    isError,
    isPending,
    isSuccess,
    mutate: createEvent,
  } = useMutation({
    mutationFn: async (data: EventCreateFields) => {
      if (!token) {
        throw new Error('Залогиньтесь');
      }
      return await ky.post('/api/events', {
        headers: { token },
        json: {
          ...data,
          id: cuid(),
        },
      });
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const onSubmit = handleSubmit((json) => {
    createEvent(json);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 items-stretch">
      <TextField label="Название" {...register('name', { required })} />
      <TextField label="Код" {...register('code', { required })} />
      <TextField label="Описание" {...register('description')} />
      <TextField
        label="Колонок в сетке"
        type="number"
        step={1}
        min={1}
        max={999}
        defaultValue={5}
        {...register('max_cols', { valueAsNumber: true })}
      />
      <TextField
        label="Строк в сетке"
        type="number"
        step={1}
        min={1}
        max={999}
        defaultValue={5}
        {...register('max_rows', { valueAsNumber: true })}
      />
      <button
        className="mt-5 h-8 flex items-center justify-center gap-2 text-white bg-green-600 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-700"
        disabled={isPending}
        type="submit"
      >
        {isPending ? (
          <SpinnerIcon className="inline animate-spin" />
        ) : (
          <>
            {isSuccess && <CheckIcon className="w-5 h-5" />}
            {isError && <Cross2Icon className="w-5 h-5" />}
            <span>Создать</span>
          </>
        )}
      </button>
      {isError && (
        <p className="max-w-[368px] text-sm mt-5 text-red-500">
          {error.message}
        </p>
      )}
    </form>
  );
}
