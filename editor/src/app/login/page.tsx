'use client';

import { useMutation } from '@tanstack/react-query';
import ky from 'ky';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { API_BASE_URL } from '@/config';
import { setToken, setUsername } from '@/utils/storage';

type UserCredentials = {
  username: string;
  password: string;
};

type UserLoginResponse = {
  token: string;
  message: string;
};

export default function Login() {
  const router = useRouter();

  const { isError, mutate: login } = useMutation({
    mutationFn: async (json: UserCredentials) => {
      return await ky
        .post(`${API_BASE_URL}/admin_login`, { json })
        .json<UserLoginResponse>();
    },
    onSuccess: ({ token }, { username }) => {
      setToken(token);
      setUsername(username);
      router.push('/');
    },
  });

  const { register, handleSubmit } = useForm<UserCredentials>();

  return (
    <div className="h-full py-64 flex justify-center">
      <form
        className="w-[300px] flex flex-col gap-4"
        onSubmit={handleSubmit((cred) => login(cred))}
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Логин</span>
          <input
            className="px-2 py-1 dark:bg-slate-700"
            type="text"
            autoComplete="username"
            {...register('username', { required: true })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Пароль</span>
          <input
            className="px-2 py-1 dark:bg-slate-700"
            type="password"
            autoComplete="current-password"
            {...register('password', { required: true })}
          />
        </label>
        <button
          className="px-2 py-1 text-white bg-pink-800 hover:bg-pink-900"
          type="submit"
        >
          Войти
        </button>
        {isError && (
          <p className="text-red-600 dark:text-red-400">
            Неверное имя пользователя или пароль
          </p>
        )}
      </form>
    </div>
  );
}
