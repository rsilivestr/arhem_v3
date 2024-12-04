import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      ...colors,
      slate: extendColor(colors.slate),
    },
  },
  plugins: [],
} satisfies Config;

function extendColor(color: Record<number, string>) {
  return {
    ...color,
    150: calcMediumHex(color[100], color[200]),
    250: calcMediumHex(color[200], color[300]),
    350: calcMediumHex(color[300], color[400]),
    450: calcMediumHex(color[400], color[500]),
    550: calcMediumHex(color[500], color[600]),
    650: calcMediumHex(color[600], color[700]),
    750: calcMediumHex(color[700], color[800]),
    850: calcMediumHex(color[800], color[900]),
  };
}

function calcMediumHex(hex1: string, hex2: string) {
  const rgb100 = hexToRgb(hex1);
  const rgb200 = hexToRgb(hex2);
  const rgbMiddle = rgb100.map((value, index) =>
    Math.floor((value + rgb200[index]) / 2)
  );
  const hexMiddle =
    '#' +
    rgbMiddle
      .map((value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');
  return hexMiddle;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
