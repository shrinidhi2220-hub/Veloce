import React from 'react';

export function Badge({
  children,
  variant = 'terracotta', // 'terracotta' | 'sage' | 'eucalyptus' | 'charcoal' | 'outline'
  className = '',
  icon: Icon = null,
  ...props
}) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()} {...props}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

export default Badge;
