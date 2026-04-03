'use client';

import React, { useState } from 'react';
import { ArrowLeft, Star, Share2, Gift } from 'lucide-react';
import { Card, Button, Badge } from '../ui/Basic';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { COLORS } from '../../utils/colors';

interface RewardsScreenProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({ onNavigate, onBack }) => {
  const { theme } = useTheme();
  const { userPoints, dailyTasks, completeTask } = useAppContext();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;

  const [copied, setCopied] = useState(false);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('INVEST2024');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            Rewards
          </h1>
          <p className="text-sm mt-3" style={{ color: textSecondary }}>
            Earn points and unlock perks
          </p>
        </div>
      </div>

      {/* Points Card */}
      <div className="px-4 mb-6">
        <Card
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}dd)`,
          }}
          className="p-6 text-white text-center"
        >
          <div className="text-sm opacity-90 mb-1">Your Points</div>
          <div className="text-4xl font-bold mb-2">{userPoints}</div>
          <div className="text-sm opacity-90">Keep exploring to earn more</div>
        </Card>
      </div>

      {/* Daily Tasks */}
      <div className="px-4 mb-6">
        <div className="text-lg font-bold mb-4" style={{ color: textColor }}>
          Daily Tasks
        </div>
        <div className="grid gap-3">
          {dailyTasks.map(task => (
            <Card key={task.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold" style={{ color: textColor }}>
                    {task.title}
                  </div>
                  <div className="text-sm mt-1" style={{ color: textSecondary }}>
                    {task.description}
                  </div>
                </div>
                <Badge variant="primary" size="sm">
                  +{task.points}
                </Badge>
              </div>
              {!task.completed && (
                <Button
                  onClick={() => completeTask(task.id)}
                  variant="secondary"
                  size="sm"
                  className="mt-3 w-full"
                >
                  Complete
                </Button>
              )}
              {task.completed && (
                <div className="mt-3 text-sm text-green-600">✓ Completed</div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Referral Program */}
      <div className="px-4 mb-6">
        <div className="text-lg font-bold mb-4" style={{ color: textColor }}>
          Invite Friends
        </div>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Share2 size={20} color={COLORS.primary} />
            <div>
              <div className="font-semibold" style={{ color: textColor }}>
                Referral Program
              </div>
              <div className="text-sm" style={{ color: textSecondary }}>
                Share your code
              </div>
            </div>
          </div>
          <Card
            style={{
              backgroundColor: isDark ? COLORS.dark.bg : COLORS.light.bg,
            }}
            className="p-3 mb-3 text-center"
          >
            <code className="font-mono font-bold" style={{ color: COLORS.primary }}>
              INVEST2024
            </code>
          </Card>
          <Button
            onClick={handleCopyReferral}
            variant="primary"
            size="sm"
            fullWidth
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
        </Card>
      </div>

      {/* Rewards Shop */}
      <div className="px-4 mb-6">
        <div className="text-lg font-bold mb-4" style={{ color: textColor }}>
          Rewards Shop
        </div>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Gift size={20} color={COLORS.primary} />
            <div className="flex-1">
              <div className="font-semibold" style={{ color: textColor }}>
                Extra Stock Slot
              </div>
              <div className="text-sm" style={{ color: textSecondary }}>
                Add more stocks to track
              </div>
            </div>
            <Badge variant="primary">500 pts</Badge>
          </div>
          <Button variant="secondary" size="sm" fullWidth className="mt-3">
            Redeem
          </Button>
        </Card>
      </div>
    </div>
  );
};
