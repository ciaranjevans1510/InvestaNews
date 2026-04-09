'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Stock, Favourite, DailyTask, UserProfile } from '../types';

interface AppContextType {
  favourites: Favourite[];
  addFavourite: (stock: Stock) => boolean;
  removeFavourite: (stockId: string) => void;
  isFavourite: (stockId: string) => boolean;
  favouriteTileCount: number;
  canAddFavourite: boolean;
  expandFavouriteTiles: (count: number) => void;
  referralInvites: number;
  recordReferralInvite: () => void;
  
  dailyTasks: DailyTask[];
  completeTask: (taskId: string) => void;
  getTodaysTasks: () => DailyTask[];
  
  userPoints: number;
  addPoints: (points: number) => void;
  articlesReadCount: number;
  recordArticleRead: (articleId: string) => void;
  hasReadArticle: (articleId: string) => boolean;
  
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  
  tutorialCompleted: boolean;
  completeTutorial: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_TASKS: DailyTask[] = [
  {
    id: '1',
    title: 'View 2 stocks',
    description: 'Explore different stocks on the discovery feed',
    points: 10,
    completed: false,
  },
  {
    id: '2',
    title: 'Complete daily quiz',
    description: 'Test your market knowledge',
    points: 20,
    completed: false,
  },
  {
    id: '3',
    title: 'Read an article',
    description: 'Check out the learning hub',
    points: 15,
    completed: false,
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [favouriteTileCount, setFavouriteTileCount] = useState(3);
  const [referralInvites, setReferralInvites] = useState(0);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [readArticleIds, setReadArticleIds] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedFavourites = localStorage.getItem('investanews-favourites');
    const savedTasks = localStorage.getItem('investanews-tasks');
    const savedPoints = localStorage.getItem('investanews-points');
    const savedReadArticleIds = localStorage.getItem('investanews-read-articles');
    const savedTileCount = localStorage.getItem('investanews-favourite-tiles');
    const savedReferralInvites = localStorage.getItem('investanews-referral-invites');
    const savedTutorial = localStorage.getItem('investanews-tutorial-completed');
    const savedUser = localStorage.getItem('investanews-user');

    if (savedFavourites) setFavourites(JSON.parse(savedFavourites));
    if (savedTasks) setDailyTasks(JSON.parse(savedTasks));
    if (savedPoints) setUserPoints(parseInt(savedPoints, 10));
    if (savedReadArticleIds) setReadArticleIds(JSON.parse(savedReadArticleIds));
    if (savedTileCount) setFavouriteTileCount(Math.max(3, parseInt(savedTileCount, 10) || 3));
    if (savedReferralInvites) setReferralInvites(parseInt(savedReferralInvites, 10) || 0);
    if (savedTutorial) setTutorialCompleted(JSON.parse(savedTutorial));
    if (savedUser) setUser(JSON.parse(savedUser));

    if (!savedTasks) setDailyTasks(MOCK_TASKS);

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('investanews-favourites', JSON.stringify(favourites));
    localStorage.setItem('investanews-tasks', JSON.stringify(dailyTasks));
    localStorage.setItem('investanews-points', userPoints.toString());
    localStorage.setItem('investanews-read-articles', JSON.stringify(readArticleIds));
    localStorage.setItem('investanews-favourite-tiles', favouriteTileCount.toString());
    localStorage.setItem('investanews-referral-invites', referralInvites.toString());
    localStorage.setItem('investanews-tutorial-completed', JSON.stringify(tutorialCompleted));
    if (user) localStorage.setItem('investanews-user', JSON.stringify(user));
    else localStorage.removeItem('investanews-user');
  }, [favourites, dailyTasks, userPoints, readArticleIds, favouriteTileCount, referralInvites, tutorialCompleted, user, mounted]);

  const addFavourite = (stock: Stock) => {
    const exists = favourites.some(fav => fav.stock.id === stock.id);
    if (exists) return true;
    if (favourites.length >= favouriteTileCount) return false;

    setFavourites(prev => [
      ...prev,
      {
        id: `fav-${stock.id}`,
        stock,
        addedAt: new Date(),
      },
    ]);
    return true;
  };

  const removeFavourite = (stockId: string) => {
    setFavourites(prev => prev.filter(fav => fav.stock.id !== stockId));
  };

  const isFavourite = (stockId: string) => {
    return favourites.some(fav => fav.stock.id === stockId);
  };

  const expandFavouriteTiles = (count: number) => {
    if (!Number.isFinite(count) || count <= 0) return;
    setFavouriteTileCount((prev) => prev + Math.floor(count));
  };

  const recordReferralInvite = () => {
    setReferralInvites((prev) => {
      const next = prev + 1;
      // Every 3 invites grants one extra favourite tile.
      if (next % 3 === 0) {
        setFavouriteTileCount((slots) => slots + 1);
      }
      return next;
    });
  };

  const completeTask = (taskId: string) => {
    setDailyTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, completed: true, completedAt: new Date() }
          : task,
      ),
    );
    // Award points
    const task = dailyTasks.find(t => t.id === taskId);
    if (task) addPoints(task.points);
  };

  const getTodaysTasks = () => dailyTasks;

  const addPoints = (points: number) => {
    setUserPoints(prev => prev + points);
  };

  const recordArticleRead = (articleId: string) => {
    if (!articleId) return;
    setReadArticleIds((prev) => (
      prev.includes(articleId) ? prev : [...prev, articleId]
    ));
  };

  const hasReadArticle = (articleId: string) => {
    return readArticleIds.includes(articleId);
  };

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const completeTutorial = () => {
    setTutorialCompleted(true);
  };

  return (
    <AppContext.Provider
      value={{
        favourites,
        addFavourite,
        removeFavourite,
        isFavourite,
        favouriteTileCount,
        canAddFavourite: favourites.length < favouriteTileCount,
        expandFavouriteTiles,
        referralInvites,
        recordReferralInvite,
        dailyTasks,
        completeTask,
        getTodaysTasks,
        userPoints,
        addPoints,
        articlesReadCount: readArticleIds.length,
        recordArticleRead,
        hasReadArticle,
        user,
        setUser: updateUser,
        tutorialCompleted,
        completeTutorial,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
