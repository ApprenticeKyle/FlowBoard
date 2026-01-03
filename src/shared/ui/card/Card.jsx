import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className,
  variant = 'default',
  hover = false,
  ...props
}) => {
  const variants = {
    default: 'glass-card',
    outlined: 'bg-transparent border border-white/10',
    elevated: 'glass-card shadow-2xl',
  };

  const classes = clsx(
    'rounded-3xl p-6 w-full',
    variants[variant],
    hover && 'transition-all hover:bg-white/[0.04]',
    className
  );

  if (hover) {
    return (
      <motion.div
        className={classes}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Card.Header = ({ children, className, ...props }) => (
  <div className={clsx('mb-6', className)} {...props}>
    {children}
  </div>
);

Card.Title = ({ children, className, ...props }) => (
  <h3 className={clsx('text-xl font-bold text-white', className)} {...props}>
    {children}
  </h3>
);

Card.Description = ({ children, className, ...props }) => (
  <p className={clsx('text-slate-400 text-sm', className)} {...props}>
    {children}
  </p>
);

Card.Content = ({ children, className, ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className, ...props }) => (
  <div className={clsx('mt-6 pt-6 border-t border-white/5', className)} {...props}>
    {children}
  </div>
);

