'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, SHADOW_STYLES } from '../../utils/colors';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = isDark ? COLORS.dark.surface : COLORS.light.surface;
  const borderColor = isDark ? COLORS.dark.border : COLORS.light.border;
  const shadow = isDark ? SHADOW_STYLES.dark.md : SHADOW_STYLES.light.sm;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4 transition-all duration-200 ${className}`}
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  let buttonStyle: React.CSSProperties = {
    backgroundColor: COLORS.primary,
    color: '#ffffff',
  };

  if (variant === 'primary') {
    buttonStyle.boxShadow = isDark
      ? '0 0 0 2px rgba(99, 102, 241, 0.3)'
      : '0 10px 15px -3px rgba(99, 102, 241, 0.3)';
  } else if (variant === 'secondary') {
    buttonStyle.backgroundColor = isDark ? COLORS.dark.surface : COLORS.light.surface;
    buttonStyle.color = isDark ? COLORS.dark.text : COLORS.light.text;
    buttonStyle.border = `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`;
  } else if (variant === 'ghost') {
    buttonStyle.backgroundColor = 'transparent';
    buttonStyle.color = COLORS.primary;
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl font-medium transition-all duration-200 ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} ${className}`}
      style={buttonStyle}
    >
      {children}
    </button>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'sector';
  color?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'secondary', color, size = 'sm' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  let styles: React.CSSProperties = {};

  if (variant === 'primary') {
    styles = {
      backgroundColor: COLORS.primary,
      color: '#ffffff',
    };
  } else if (variant === 'sector' && color) {
    styles = {
      backgroundColor: isDark ? `${color}20` : `${color}15`,
      color: color,
    };
  } else {
    styles = {
      backgroundColor: isDark ? COLORS.dark.border : COLORS.light.border,
      color: isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
    };
  }

  return (
    <span
      className={`rounded-full font-medium ${sizeStyles[size]}`}
      style={styles}
    >
      {children}
    </span>
  );
};
