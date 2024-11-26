import React, { forwardRef } from 'react';

export const SearchIcon = forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGElement>
>(function SearchIcon({ color = 'currentColor', ...iconProps }, iconRef) {
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
        d="M10 6.5C10 8.43 8.43 10 6.5 10C4.57 10 3 8.43 3 6.5C3 4.57 4.57 3 6.5 3C8.43 3 10 4.57 10 6.5ZM9.31 10.02C8.54 10.63 7.56 11 6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 7.56 10.63 8.54 10.02 9.31L12.85 12.15C13.05 12.34 13.05 12.66 12.85 12.85C12.66 13.05 12.34 13.05 12.15 12.85L9.31 10.02Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
});
