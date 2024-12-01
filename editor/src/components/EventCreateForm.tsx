import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
import { useForm } from 'react-hook-form';

import { TextField } from './TextField';

type EventCreateFields = {
  id: string;
  name: string;
  description: string;
  image?: string;
  max_cols: number;
  max_rows: number;
};

export function EventCreateForm() {
  const { handleSubmit, register } = useForm<EventCreateFields>();
  const queryClient = useQueryClient();

  const { mutate: createEvent } = useMutation({
    async mutationFn(json: EventCreateFields) {
      return await ky.post('/api/events', { json });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const onSubmit = handleSubmit(async (json) => {
    await createEvent(json);
  });

  return (
    <form onSubmit={onSubmit}>
      <TextField label="id" value={'abcd'} {...register('id')} readOnly />
    </form>
  );
}
