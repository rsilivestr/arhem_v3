export default function Login() {
  return (
    <div className="h-full py-64 flex justify-center">
      <form className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Логин</span>
          <input
            className="px-2 py-1 dark:bg-slate-700"
            type="text"
            name="username"
            autoComplete="username"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Пароль</span>
          <input
            className="px-2 py-1 dark:bg-slate-700"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button
          className="px-2 py-1 text-white bg-pink-800 hover:bg-pink-900"
          type="submit"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
