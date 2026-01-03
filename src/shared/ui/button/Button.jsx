import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const buttonVariants = {
  primary: 'btn-primary',
  secondary: 'bg-white/5 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-white/10 transition-all',
  ghost: 'text-slate-400 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:text-white hover:bg-white/5 transition-all',
  danger: 'bg-rose-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all',
  icon: 'icon-btn',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  as: Component = 'button',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClass = buttonVariants[variant] || buttonVariants.primary;
  const sizeClass = buttonSizes[size] || buttonSizes.md;

  const classes = clsx(
    baseClasses,
    variantClass,
    sizeClass,
    className
  );

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </>
  );

  const buttonProps = {
    ref,
    className: classes,
    disabled: disabled || loading,
    ...props,
  };

  if (variant === 'primary' && !disabled && !loading) {
    return (
      <motion.button
        {...buttonProps}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <Component {...buttonProps}>
      {content}
    </Component>
  );
});

Button.displayName = 'Button';

