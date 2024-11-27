import * as React from 'react';

export const ExitIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGElement>
>(function ExitIcon({ color = 'currentColor', ...iconProps }, iconRef) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={iconRef}
      {...iconProps}
    >
      <path
        d="M3 1C2.45 1 2 1.45 2 2V13C2 13.55 2.45 14 3 14H10.5C10.78 14 11 13.78 11 13.5C11 13.22 10.78 13 10.5 13H3V2L10.5 2C10.78 2 11 1.78 11 1.5C11 1.22 10.78 1 10.5 1H3ZM12.6 4.9C12.41 4.7 12.09 4.7 11.9 4.9C11.7 5.09 11.7 5.41 11.9 5.6L13.29 7H6.5C6.22 7 6 7.22 6 7.5C6 7.78 6.22 8 6.5 8H13.29L11.9 9.4C11.7 9.59 11.7 9.91 11.9 10.1C12.09 10.3 12.41 10.3 12.6 10.1L14.85 7.85C15.05 7.66 15.05 7.34 14.85 7.15L12.6 4.9Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
});
