'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardScreen } from './components/screens/Dashboard';
import { DiscoveryScreen } from './components/screens/Discovery';
import { SearchScreen } from './components/screens/Search';
import { RewardsScreen } from './components/screens/Rewards';
import { ProfileScreen } from './components/screens/Profile';
import { WelcomeScreen } from './components/screens/Welcome';
import { GetStartedScreen } from './components/screens/GetStarted';
import { OnboardingScreen } from './components/screens/Onboarding';
import { QuizScreen } from './components/screens/Quiz';
import { StoriesScreen } from './components/screens/Stories';
import { LearningHubScreen } from './components/screens/LearningHub';
import { CategoryStocksScreen } from './components/screens/CategoryStocks';
import { StockDetailsScreen } from './components/screens/StockDetails';
import { MoreTilesScreen } from './components/screens/MoreTiles';
import { SignInScreen } from './components/screens/SignIn';
import { SignUpScreen } from './components/screens/SignUp';
import { BetaScreen } from './components/screens/Beta';
import { InstallTutorialScreen } from './components/screens/InstallTutorial';
import { COLORS } from './utils/colors';
import type { Stock } from './types';

type NavigationTab = 'home' | 'discover' | 'search' | 'rewards' | 'profile';
type Screen = 'welcome' | 'sign-in' | 'sign-up' | 'get-started' | 'onboarding' | 'quiz' | 'stories' | 'learning' | 'category-stocks' | 'stock-details' | 'more-tiles' | 'beta' | 'install-tutorial' | NavigationTab;

const InvestaNewsAppContent: React.FC = () => {
  const { session, authLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [selectedSector, setSelectedSector] = useState('Technology');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stockNavigationList, setStockNavigationList] = useState<Stock[]>([]);
  const [startHomeTour, setStartHomeTour] = useState(false);
  const [screenHistory, setScreenHistory] = useState<Screen[]>([]);
  const [mounted, setMounted] = useState(false);
  // Track previously seen user ID so token refreshes don't reset navigation
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (authLoading) return;

    const currentUserId = session?.user?.id ?? null;

    if (prevUserIdRef.current === undefined) {
      // Initial load — determine start screen
      prevUserIdRef.current = currentUserId;
      const tutorialCompleted = localStorage.getItem('investanews-tutorial-completed');
      const welcomeCompleted = localStorage.getItem('investanews-welcome-completed');
      if (!currentUserId) {
        if (welcomeCompleted !== 'true') {
          setCurrentScreen('welcome');
        } else {
          setCurrentScreen(tutorialCompleted === 'true' ? 'home' : 'get-started');
        }
      } else {
        setCurrentScreen(tutorialCompleted === 'true' ? 'home' : 'get-started');
      }
      setMounted(true);
      return;
    }

    // Same user ID means a token refresh — don't disturb current screen
    if (prevUserIdRef.current === currentUserId) return;
    prevUserIdRef.current = currentUserId;

    // Real auth transition (sign-in or sign-out)
    if (!currentUserId) {
      const tutorialCompleted = localStorage.getItem('investanews-tutorial-completed');
      setCurrentScreen(tutorialCompleted === 'true' ? 'home' : 'get-started');
    } else {
      const tutorialCompleted = localStorage.getItem('investanews-tutorial-completed');
      setCurrentScreen(tutorialCompleted === 'true' ? 'home' : 'get-started');
    }
  }, [authLoading, session]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentScreen]);

  if (!mounted) return null;

  const isTabScreen = (screen: string): screen is NavigationTab => {
    return ['home', 'discover', 'search', 'rewards', 'profile'].includes(screen);
  };

  const openScreen = (screen: Screen, pushHistory = true) => {
    if (pushHistory) {
      setScreenHistory((prev) => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
    if (isTabScreen(screen)) {
      setCurrentTab(screen);
    }
  };

  const goBack = (fallback: Screen = 'home') => {
    setScreenHistory((prev) => {
      if (prev.length === 0) {
        setCurrentScreen(fallback);
        if (isTabScreen(fallback)) {
          setCurrentTab(fallback);
        }
        return prev;
      }

      const previous = prev[prev.length - 1];
      setCurrentScreen(previous);
      if (isTabScreen(previous)) {
        setCurrentTab(previous);
      }
      return prev.slice(0, -1);
    });
  };

  const navigate = (screen: string) => {
    openScreen(screen as Screen);
  };

  const handleGetStarted = () => {
    localStorage.setItem('investanews-welcome-completed', 'true');
    setCurrentScreen('get-started');
  };

  const handleOnboardingComplete = () => {
    setScreenHistory([]);
    setCurrentScreen('home');
    setCurrentTab('home');
    localStorage.setItem('investanews-tutorial-completed', 'true');
  };

  const handleOnboardingSkip = () => {
    setScreenHistory([]);
    setCurrentScreen('home');
    setCurrentTab('home');
    localStorage.setItem('investanews-tutorial-completed', 'true');
  };

  const handleExploreSolo = () => {
    setStartHomeTour(false);
    setScreenHistory([]);
    setCurrentScreen('home');
    setCurrentTab('home');
    localStorage.setItem('investanews-tutorial-completed', 'true');
  };

  const handleStartGuidedTour = () => {
    setStartHomeTour(true);
    setScreenHistory([]);
    setCurrentScreen('home');
    setCurrentTab('home');
  };

  const handleHomeTourComplete = () => {
    setStartHomeTour(false);
    localStorage.setItem('investanews-tutorial-completed', 'true');
  };

  const handleLogout = async () => {
    setScreenHistory([]);
    await signOut();
  };

  const handleTabChange = (tab: NavigationTab) => {
    openScreen(tab);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedSector(category);
    openScreen('category-stocks');
  };

  const handleSelectStock = (stock: Stock, adjacentStocks?: Stock[]) => {
    setSelectedStock(stock);
    if (adjacentStocks && adjacentStocks.length > 0) {
      setStockNavigationList(adjacentStocks);
    } else {
      setStockNavigationList([stock]);
    }
    openScreen('stock-details');
  };

  const handleSwitchStock = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const handleResetExperience = () => {
    localStorage.removeItem('investanews-welcome-completed');
    localStorage.removeItem('investanews-tutorial-completed');
    setScreenHistory([]);
    setCurrentTab('home');
    setCurrentScreen('welcome');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={handleGetStarted}
            onSignIn={() => openScreen('sign-in')}
          />
        );
      case 'sign-in':
        return (
          <SignInScreen
            onBack={() => goBack('welcome')}
            onSignUp={() => openScreen('sign-up')}
          />
        );
      case 'sign-up':
        return (
          <SignUpScreen
            onBack={() => goBack('welcome')}
            onSignIn={() => openScreen('sign-in')}
          />
        );
        case 'get-started':
          return (
            <GetStartedScreen
              onExplore={handleExploreSolo}
              onGuidedTour={handleStartGuidedTour}
            />
          );
      case 'onboarding':
        return (
          <OnboardingScreen
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        );
      case 'quiz':
        return <QuizScreen onComplete={() => navigate('home')} onBack={() => goBack('home')} />;
      case 'stories':
        return <StoriesScreen onNavigate={navigate} onBack={() => goBack('home')} />;
      case 'learning':
        return <LearningHubScreen onNavigate={navigate} onBack={() => goBack('profile')} />;
      case 'home':
        return <DashboardScreen onNavigate={navigate} onSelectStock={handleSelectStock} onResetExperience={handleResetExperience} onOpenBeta={() => openScreen('beta')} startTooltipTour={startHomeTour} onTooltipTourComplete={handleHomeTourComplete} />;
      case 'discover':
        return (
          <DiscoveryScreen
            onNavigate={navigate}
            onSelectCategory={handleSelectCategory}
            onBack={() => goBack('home')}
          />
        );
      case 'category-stocks':
        return (
          <CategoryStocksScreen
            sector={selectedSector}
            onBack={() => goBack('discover')}
            onNavigate={navigate}
            onSelectStock={handleSelectStock}
          />
        );
      case 'stock-details':
        if (!selectedStock) {
          return <SearchScreen onNavigate={navigate} onBack={() => goBack('home')} onSelectStock={handleSelectStock} />;
        }
        return (
          <StockDetailsScreen
            stock={selectedStock}
            stockList={stockNavigationList}
            onBack={() => goBack('discover')}
            onSelectStock={handleSwitchStock}
          />
        );
      case 'search':
        return <SearchScreen onNavigate={navigate} onBack={() => goBack('home')} onSelectStock={handleSelectStock} />;
      case 'more-tiles':
        return <MoreTilesScreen onBack={() => goBack('home')} />;
      case 'rewards':
        return <RewardsScreen onNavigate={navigate} onBack={() => goBack('home')} />;
      case 'profile':
        return <ProfileScreen onNavigate={navigate} onLogout={handleLogout} onBack={() => goBack('home')} />;
      case 'beta':
        return <BetaScreen onBack={() => goBack('home')} onToggleTheme={toggleTheme} onOpenInstallTutorial={() => openScreen('install-tutorial')} />;
      case 'install-tutorial':
        return <InstallTutorialScreen onBack={() => goBack('beta')} onToggleTheme={toggleTheme} />;
      default:
        return <DashboardScreen onNavigate={navigate} onSelectStock={handleSelectStock} onResetExperience={handleResetExperience} onOpenBeta={() => openScreen('beta')} startTooltipTour={startHomeTour} onTooltipTourComplete={handleHomeTourComplete} />;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(circle at 10% 12%, rgba(31, 111, 235, 0.2) 0%, rgba(31, 111, 235, 0) 34%), radial-gradient(circle at 92% 0%, rgba(132, 179, 255, 0.2) 0%, rgba(132, 179, 255, 0) 28%), linear-gradient(180deg, #f7fbff 0%, #edf3fc 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[460px] min-h-screen relative overflow-hidden border border-[#c6d7ee] shadow-[0_24px_70px_rgba(17,58,110,0.18)] md:max-w-none md:shadow-none">
        {currentScreen !== 'beta' && currentScreen !== 'install-tutorial' && (
          <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full transition-all"
              style={{ backgroundColor: COLORS.primary, color: 'white' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button
              onClick={() => navigate('profile')}
              className="p-3 rounded-full transition-all"
              style={{
                backgroundColor: theme === 'dark' ? COLORS.dark.surface : COLORS.light.surface,
                color: theme === 'dark' ? COLORS.dark.text : COLORS.light.text,
                border: `1px solid ${theme === 'dark' ? COLORS.dark.border : COLORS.light.border}`,
              }}
              aria-label="Open profile"
            >
              <User size={22} />
            </button>
          </div>
          </div>
        )}
        {renderScreen()}
      </div>
    </div>
  );
};

export const InvestaNewsApp: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppProvider>
          <InvestaNewsAppContent />
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
