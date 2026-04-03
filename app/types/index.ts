export type Theme = 'light' | 'dark';

export interface Stock {
  id: string;
  symbol: string;
  company: string;
  price: number;
  change: number; // percentage
  percentChange: number;
  sector: string;
  sectorColor: string;
  image?: string;
  industry?: string;
  marketCap?: number | string;
  marketCapLabel?: string;
  description?: string;
  infoUrl?: string;
}

export interface Favourite {
  id: string;
  stock: Stock;
  addedAt: Date;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  summary: string;
  image?: string;
  timestamp: Date;
  relatedStocks: string[];
}

export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  completedAt?: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: Date;
  stocksTracked: number;
  articlesRead: number;
  points: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface StorySlide {
  id: string;
  slideType: 'hook' | 'what-happened' | 'why-it-matters' | 'key-movers' | 'bigger-picture' | 'what-to-watch' | 'explore';
  title: string;
  content: string;
  stocks?: Stock[];
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  slides: StorySlide[];
  image?: string;
  createdAt: Date;
  readTime: number;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: 'slot' | 'feature';
}
