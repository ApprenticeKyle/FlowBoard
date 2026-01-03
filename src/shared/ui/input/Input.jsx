import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Search } from 'lucide-react';

export const Input = forwardRef(({
  type = 'text',
  className,
  icon: Icon,
  iconPosition = 'left',
  error,
  ...props
}, ref) => {
  const baseClasses = 'w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 text-sm text-slate-200 transition-all placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/30';
  const errorClasses = error ? 'border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500/50' : '';
  const iconPadding = Icon || type === 'search' ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : 'px-4';

  const classes = clsx(baseClasses, errorClasses, iconPadding, className);

  const InputIcon = Icon || (type === 'search' ? Search : null);

  return (
    <div className="relative group">
      {InputIcon && iconPosition === 'left' && (
        <InputIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary-400 transition-colors pointer-events-none" />
      )}
      <input
        ref={ref}
        type={type}
        className={classes}
        {...props}
      />
      {InputIcon && iconPosition === 'right' && (
        <InputIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary-400 transition-colors pointer-events-none" />
      )}
      {error && (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

