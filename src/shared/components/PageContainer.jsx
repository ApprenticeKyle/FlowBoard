import { clsx } from 'clsx';

/**
 * 统一的页面容器组件
 * 确保所有页面都有相同的宽度和布局
 */
export const PageContainer = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'w-full max-w-[1600px] mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
