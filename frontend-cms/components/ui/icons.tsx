import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
  variant?: 'outline' | 'filled';
  size?: number | string;
};

export function EyeIcon({ variant = 'outline', size = 18, className, ...props }: IconProps) {
  const common = { width: size, height: size, className, ...props };
  if (variant === 'filled') {
    return (
      <svg {...common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
      </svg>
    );
  }

  return (
    <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon({ variant = 'outline', size = 18, className, ...props }: IconProps) {
  const common = { width: size, height: size, className, ...props };
  if (variant === 'filled') {
    return (
      <svg {...common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M2.1 3.51L1 4.62l5 5A9.94 9.94 0 0 0 1 12c1.73 3.89 6 7 11 7 2.13 0 4.12-.51 5.89-1.39l3.09 3.09 1.11-1.11L3.21 2.4 2.1 3.51zM9.88 9.88A3 3 0 0 0 14.12 14.12L9.88 9.88z" />
      </svg>
    );
  }

  return (
    <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7 1.02-2.28 2.69-4.19 4.72-5.45" />
      <path d="M1 1l22 22" />
      <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
    </svg>
  );
}

export function CheckIcon({ variant = 'outline', size = 18, className, ...props }: IconProps) {
  const common = { width: size, height: size, className, ...props };
  if (variant === 'filled') {
    return (
      <svg {...common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }

  return (
    <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default {
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
};
