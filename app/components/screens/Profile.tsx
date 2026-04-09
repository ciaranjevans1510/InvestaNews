'use client';

import React from 'react';
import { ArrowLeft, Moon, Sun, LogOut, Users, MessageSquare, BookOpen } from 'lucide-react';
import { Card, Button } from '../ui/Basic';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../utils/colors';

interface ProfileScreenProps {
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
  onBack?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, onLogout, onBack }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, userPoints, favourites, articlesReadCount } = useAppContext();
  const { authUser } = useAuth();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;
  const borderColor = isDark ? COLORS.dark.border : COLORS.light.border;

  const isGuest = !authUser;
  const displayName = isGuest
    ? "You're not currently signed in"
    : (authUser?.user_metadata?.display_name || user?.name || authUser?.email?.split('@')[0] || 'User');
  const displayEmail = isGuest ? 'Guest mode' : (authUser?.email || user?.email || '');
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div
      className="pb-24"
      style={{
        backgroundColor: bgColor,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-5 mb-6">
        <button
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }
            onNavigate?.('home');
          }}
          className="p-1 rounded-lg"
          style={{ color: textSecondary }}
          aria-label="Back"
        >
          <ArrowLeft size={28} />
        </button>
        <div className="pt-6">
          <h1 className="text-6xl font-bold leading-none" style={{ color: textColor }}>
            Profile
          </h1>
          <p className="text-sm mt-3" style={{ color: textSecondary }}>
            Your account, progress, and settings
          </p>
        </div>
      </div>

      {/* User Card */}
      <div className="px-4 mb-6">
        <Card className="p-6 text-center">
          {!isGuest && (
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: COLORS.primary }}
            >
              {avatarLetter}
            </div>
          )}
          <h2 className="text-xl font-bold mb-1" style={{ color: textColor }}>
            {displayName}
          </h2>
          <p className="text-sm" style={{ color: textSecondary }}>
            {displayEmail}
          </p>

          {isGuest && (
            <div className="mt-5 grid gap-2">
              <Button
                onClick={() => onNavigate?.('sign-up')}
                variant="primary"
                fullWidth
              >
                Create Account
              </Button>
              <Button
                onClick={() => onNavigate?.('sign-in')}
                variant="secondary"
                fullWidth
              >
                Sign In
              </Button>
            </div>
          )}
        </Card>
      </div>

      {!isGuest && (
        <div className="px-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                {favourites.length}
              </div>
              <div className="text-xs mt-2" style={{ color: textSecondary }}>
                Stocks
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                {articlesReadCount}
              </div>
              <div className="text-xs mt-2" style={{ color: textSecondary }}>
                Articles
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                {userPoints}
              </div>
              <div className="text-xs mt-2" style={{ color: textSecondary }}>
                Points
              </div>
            </Card>
          </div>
        </div>
      )}

      {!isGuest && (
        <div className="px-4 mb-6">
          <div className="text-lg font-bold mb-3" style={{ color: textColor }}>
            Friends
          </div>
          <Card className="p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Users size={20} color={COLORS.primary} />
                <div>
                  <div className="font-semibold" style={{ color: textColor }}>
                    Your Friends
                  </div>
                  <div className="text-sm" style={{ color: textSecondary }}>
                    3 friends
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} color={COLORS.primary} />
                <div>
                  <div className="font-semibold" style={{ color: textColor }}>
                    Messages
                  </div>
                  <div className="text-sm" style={{ color: textSecondary }}>
                    No unread messages
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Settings */}
      <div className="px-4 mb-6">
        <div className="text-lg font-bold mb-3" style={{ color: textColor }}>
          Settings
        </div>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor }}>
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
              <span style={{ color: textColor }}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-14 h-8 rounded-full transition-colors"
              style={{
                backgroundColor: isDark ? COLORS.primary : COLORS.light.border,
              }}
            >
              <div
                className="absolute top-1 w-6 h-6 bg-white rounded-full transition-transform"
                style={{
                  transform: isDark ? 'translateX(28px)' : 'translateX(2px)',
                }}
              />
            </button>
          </div>
        </Card>
      </div>

      {/* Learning Hub */}
      <div className="px-4 mb-6">
        <Button
          onClick={() => onNavigate?.('learning')}
          variant="secondary"
          fullWidth
          className="flex items-center justify-center gap-2"
        >
          <BookOpen size={18} />
          Learning Hub
        </Button>
      </div>

      {!isGuest && (
        <div className="px-4 mb-24">
          <Button
            onClick={onLogout}
            variant="secondary"
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};
