'use client';

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Bookmark } from 'lucide-react';
import { Card, Button, Badge } from '../ui/Basic';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { COLORS } from '../../utils/colors';

interface LearningHubScreenProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
}

const LEARNING_CONTENT = [
  {
    id: 1,
    title: 'What Are Stocks?',
    category: 'Beginner',
    description: 'Learn the basics of stock ownership and how markets work.',
    readTime: 5,
    bookmarked: false,
  },
  {
    id: 2,
    title: 'Understanding Stock Charts',
    category: 'Beginner',
    description: 'Interpret candlestick charts and identify trends.',
    readTime: 8,
    bookmarked: false,
  },
  {
    id: 3,
    title: 'Fundamental Analysis 101',
    category: 'Intermediate',
    description: 'Analyze company financials to make informed decisions.',
    readTime: 12,
    bookmarked: false,
  },
  {
    id: 4,
    title: 'Technical Analysis Patterns',
    category: 'Intermediate',
    description: 'Recognize chart patterns and support/resistance levels.',
    readTime: 15,
    bookmarked: false,
  },
  {
    id: 5,
    title: 'Portfolio Management Strategies',
    category: 'Advanced',
    description: 'Build and manage a diversified investment portfolio.',
    readTime: 20,
    bookmarked: false,
  },
];

const CATEGORIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const LearningHubScreen: React.FC<LearningHubScreenProps> = ({ onNavigate, onBack }) => {
  const { theme } = useTheme();
  const { recordArticleRead, hasReadArticle } = useAppContext();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [content, setContent] = useState(LEARNING_CONTENT);

  const filteredContent = selectedCategory === 'All'
    ? content
    : content.filter(item => item.category === selectedCategory);

  const toggleBookmark = (id: number) => {
    setContent(content.map(item =>
      item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
    ));
  };

  const handleReadArticle = (articleId: number) => {
    recordArticleRead(String(articleId));
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
            onNavigate?.('profile');
          }}
          className="p-1 rounded-lg"
          style={{ color: textSecondary }}
          aria-label="Back"
        >
          <ArrowLeft size={28} />
        </button>
        <div className="pt-6">
          <h1 className="text-6xl font-bold leading-none" style={{ color: textColor }}>
            Learning Hub
          </h1>
          <p className="text-sm mt-3" style={{ color: textSecondary }}>
            Master the markets at your own pace
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6 flex gap-2 overflow-x-auto">
        {CATEGORIES.map(category => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? 'primary' : 'secondary'}
            size="sm"
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Content List */}
      <div className="px-4 grid gap-4">
        {filteredContent.map(item => {
          const isRead = hasReadArticle(String(item.id));

          return (
            <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <Badge variant="sector" color={
                  item.category === 'Beginner' ? '#10b981' :
                  item.category === 'Intermediate' ? COLORS.primary :
                  '#f59e0b'
                } size="sm">
                  {item.category}
                </Badge>
              </div>
              <button
                onClick={() => toggleBookmark(item.id)}
                className="p-1"
              >
                <Bookmark
                  size={18}
                  fill={item.bookmarked ? COLORS.primary : 'none'}
                  color={item.bookmarked ? COLORS.primary : textSecondary}
                />
              </button>
            </div>

            <h3 className="font-bold text-lg mb-2" style={{ color: textColor }}>
              {item.title}
            </h3>

            <p className="text-sm mb-4" style={{ color: textSecondary }}>
              {item.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-xs" style={{ color: textSecondary }}>
                {isRead ? 'Read' : 'Unread'} • ⏱️ {item.readTime} mins
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleReadArticle(item.id)}>
                {isRead ? 'Read Again →' : 'Read Article →'}
              </Button>
            </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredContent.length === 0 && (
        <div className="px-4 text-center py-12">
          <BookOpen size={48} color={textSecondary} className="mx-auto mb-4 opacity-50" />
          <p style={{ color: textSecondary }}>
            No articles in this category yet.
          </p>
        </div>
      )}
    </div>
  );
};
