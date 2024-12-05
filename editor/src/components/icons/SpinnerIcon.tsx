import { forwardRef, SVGAttributes } from 'react';

export const SpinnerIcon = forwardRef<SVGSVGElement, SVGAttributes<SVGElement>>(
  function SpinnerIcon({ color = 'currentColor', ...iconProps }, iconRef) {
    return (
      <svg
        width={20}
        height={20}
        fill="none"
        {...iconProps}
        ref={iconRef}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          opacity={0.5}
          strokeWidth="4"
        />
        <path
          fill={color}
          d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.824 3 7.94l3-2.647z"
        />
      </svg>
    );
  }
);
