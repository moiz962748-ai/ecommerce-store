import React from 'react';
import { EyeIcon, EyeOffIcon, CheckIcon } from './icons';

export type IconName = 'eye' | 'eye-off' | 'check';

type Props = {
  name: IconName;
  variant?: 'outline' | 'filled';
  size?: number | string;
  className?: string;
};

export function Icon({ name, variant = 'outline', size = 18, className, ...rest }: Props) {
  switch (name) {
    case 'eye':
      return <EyeIcon variant={variant} size={size} className={className} {...rest} />;
    case 'eye-off':
      return <EyeOffIcon variant={variant} size={size} className={className} {...rest} />;
    case 'check':
      return <CheckIcon variant={variant} size={size} className={className} {...rest} />;
    default:
      return null;
  }
}

export default Icon;
