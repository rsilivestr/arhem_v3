import { useEffect, useState } from 'react';
import colors from 'tailwindcss/colors';

type WidenPrimitiveValues<O extends object> = {
  [K in keyof O]: O[K] extends string
    ? string
    : O[K] extends number
      ? number
      : O[K] extends object
        ? WidenPrimitiveValues<O[K]>
        : never;
};

const dark = {
  bg: colors.cyan[950],
  cell: {
    main: colors.sky[900],
    hover: colors.sky[800],
    icon: colors.sky[900],
    border: colors.sky[600],
  },
};

type ThemeColors = WidenPrimitiveValues<typeof dark>;

const light: ThemeColors = {
  bg: colors.gray[100],
  cell: {
    main: colors.blue[200],
    hover: colors.blue[300],
    icon: colors.blue[200],
    border: colors.blue[400],
  },
};

export function useTheme() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(prefersDark.matches ? 'dark' : 'light');
    const hanldeModeChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };
    prefersDark.addEventListener('change', hanldeModeChange);
    return () => {
      prefersDark.removeEventListener('change', hanldeModeChange);
    };
  }, []);

  return {
    mode,
    colors: {
      dark,
      light,
    }[mode],
  };
}
