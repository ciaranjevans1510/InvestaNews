'use client';

import React from 'react';
import { Home, Compass, Search, Gift, User, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, SHADOW_STYLES } from '../../utils/colors';

interface NavigationBarProps {
  currentTab: 'home' | 'discover' | 'search' | 'rewards' | 'profile';
  onTabChange: (tab: 'home' | 'discover' | 'search' | 'rewards' | 'profile') => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ currentTab, onTabChange }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = isDark ? COLORS.dark.surface : COLORS.light.surface;
  const borderColor = isDark ? COLORS.dark.border : COLORS.light.border;

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'discover', icon: Compass, label: 'Discover' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'profile', icon: User, label: 'Profile' },
  ] as const;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t"
      style={{
        width: 'min(100vw, 460px)',
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)',
        backgroundColor: bgColor,
        borderColor: borderColor,
        boxShadow: isDark ? SHADOW_STYLES.dark.md : SHADOW_STYLES.light.md,
      }}
    >
      <div className="flex justify-around items-center rounded-t-[1.4rem] overflow-hidden">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = currentTab === id;
          const iconColor = isActive ? COLORS.primary : isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;

          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex-1 py-4 flex flex-col items-center gap-1 transition-colors"
              style={{ color: iconColor }}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  React.useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      icon: CheckCircle,
      bgColor: '#10b98120',
      textColor: '#059669',
    },
    error: {
      icon: AlertCircle,
      bgColor: '#ef444420',
      textColor: '#dc2626',
    },
    info: {
      icon: AlertCircle,
      bgColor: COLORS.primary + '20',
      textColor: COLORS.primary,
    },
  };

  const { icon: Icon, bgColor, textColor } = typeStyles[type];

  return (
    <div
      className="fixed bottom-24 left-4 right-4 rounded-lg p-4 flex items-center gap-3 z-50 max-w-md mx-auto"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <Icon size={20} />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-1">
        <X size={16} />
      </button>
    </div>
  );
};

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = isDark ? COLORS.dark.surface : COLORS.light.surface;
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl p-6 max-w-sm w-full"
        style={{
          backgroundColor: bgColor,
        }}
      >
        <h3 className="text-lg font-bold mb-2" style={{ color: textColor }}>
          {title}
        </h3>
        <p className="text-sm mb-6" style={{ color: textSecondary }}>
          {description}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border transition-colors"
            style={{
              borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
              color: textColor,
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: isDangerous ? '#ef4444' : COLORS.primary,
              color: '#ffffff',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProgressBarProps {
  progress: number;
  total: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total, showLabel = true }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const percentage = (progress / total) * 100;

  return (
    <div>
      <div
        className="w-full rounded-full h-2 overflow-hidden"
        style={{
          backgroundColor: isDark ? COLORS.dark.border : COLORS.light.border,
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: COLORS.primary,
          }}
        />
      </div>
      {showLabel && (
        <div className="text-xs mt-1" style={{ color: isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary }}>
          {progress} of {total}
        </div>
      )}
    </div>
  );
};
