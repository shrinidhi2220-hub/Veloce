import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'terracotta' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon: Icon = null,
  ...props
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: '1em', height: '1em', border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
    </button>
  );
}

export default Button;
