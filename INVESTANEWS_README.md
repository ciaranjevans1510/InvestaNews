# InvestaNews - Stock Insight Mobile App

A modern, beautifully designed stock insight app built with React, TypeScript, Tailwind CSS, and Supabase. Featuring claymorphism design, comprehensive stock discovery tools, and educational content.

## 🎯 Features

### 12 Comprehensive Screens

1. **Welcome Screen** - Hero landing with Get Started CTA
2. **Onboarding Carousel** - 3-slide tutorial introducing key features  
3. **Dashboard/Home** - Overview with favorites, streak counter, and market news
4. **Discovery Feed** - TikTok-style vertical swipe through stocks
5. **Search** - Full-featured stock search with filters and recent searches
6. **Stories** - 7-slide editorial content (Hook → What Happened → Why It Matters → Key Movers → Bigger Picture → What to Watch → Explore)
7. **Quiz** - Interactive market knowledge questions with instant feedback
8. **Rewards** - Points system, daily tasks, referral program, and shop
9. **Profile** - User stats, friends, messages, theme toggle, and settings
10. **Learning Hub** - Educational content categorized by difficulty
11. **Navigation Bar** - 5-tab bottom navigation (Home, Discover, Search, Rewards, Profile)

### Design System

- **Claymorphism** - Soft gradients, rounded corners (16-24px), subtle shadows
- **Dual Theme Support** - Light and dark modes with proper contrast
- **Color Palette**:
  - Primary: #6366f1 (Indigo) - Actions only
  - Sector Colors: Muted tones for stock categories
  - Smooth transitions and hover effects

### State Management

- **Theme Persistence** - localStorage-based light/dark mode
- **User Context** - Profile, points, and preferences
- **Favorites System** - Persistent stock watchlist
- **Daily Tasks** - Engagement tracking and rewards  
- **App State** - Global state for user interactions

### Data & Persistence

- **localStorage Keys**:
  - `investanews-theme` - Theme preference
  - `investanews-favourites` - Saved stocks
  - `investanews-tasks` - Daily task status
  - `investanews-tutorial-completed` - Onboarding flag
  - `investanews-user` - User profile
  - `investanews-points` - Accumulated rewards

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment (if needed)
# Add your Supabase config to .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
app/
├── components/
│   ├── ui/              # Reusable components (Card, Button, Navigation, etc.)
│   │   ├── Basic.tsx    # Card, Button, Badge
│   │   ├── Cards.tsx    # StockCard, Input
│   │   └── Navigation.tsx # NavigationBar, Toast, ConfirmDialog, ProgressBar
│   └── screens/         # 12 screen components
│       ├── Welcome.tsx
│       ├── Dashboard.tsx
│       ├── Discovery.tsx
│       ├── Search.tsx
│       ├── Rewards.tsx
│       ├── Profile.tsx
│       ├── Onboarding.tsx
│       ├── Quiz.tsx
│       ├── Stories.tsx
│       └── LearningHub.tsx
├── contexts/            # State management
│   ├── ThemeContext.tsx # Theme provider
│   └── AppContext.tsx   # App state (favorites, tasks, user)
├── types/
│   └── index.ts         # TypeScript interfaces
├── utils/
│   ├── colors.ts        # Color system and design tokens
│   ├── mockData.ts      # Sample stock and news data
│   └── helpers.ts       # Utility functions
├── InvestaNewsApp.tsx   # Main app component with routing
├── layout.tsx           # Root layout with providers
└── page.tsx             # Home page
```

## 🎨 Design Features

### Claymorphic Style
- Soft, rounded UI elements
- Gradients for depth
- Minimal shadows (except CTA buttons)
- Consistent spacing and padding

### Responsive Design
- Mobile-first approach
- Touch-friendly tap targets (44px minimum)
- Adapts to different screen sizes

### Accessibility
- Proper color contrast in both themes
- Clear typography hierarchy
- Semantic HTML structure
- Keyboard navigation support

## 🔧 Key Components

### UI Components

- **Card** - Container with theme-aware styling
- **Button** - Multiple variants (primary, secondary, ghost)
- **Badge** - For categories and tags
- **Input** - Search and form inputs
- **StockCard** - Stock display with favorites
- **NavigationBar** - 5-tab bottom navigation
- **Toast** - Notifications
- **ConfirmDialog** - Action confirmation
- **ProgressBar** - Progress visualization

### Screens

Each screen component handles:
- Theme awareness (light/dark mode)
- Navigation between screens
- User interactions
- Reward tracking
- Data display

## 📊 Mock Data

The app includes mock data for:
- 10 realistic stocks (NVDA, TSLA, JPM, JNJ, XOM, MSFT, AAPL, META, AMZN, GOOGL)
- Market news articles
- Detailed stories with 7-slide structure
- Quiz questions
- Learning content categories

## 🎓 Educational Focus

- **Learning Hub**: Articles categorized by difficulty
- **Quiz System**: Interactive market knowledge questions
- **Stories**: Editorial content explaining market movements
- **Onboarding**: User education on app features

## 💰 Rewards System

- **Daily Tasks**: Engagement-based point system
- **Streak Counter**: Track consecutive days
- **Referral Program**: Share unique code
- **Rewards Shop**: Unlock premium features

## 📝 Important Notes

- **Informational Only**: All content is for educational purposes
- **Not Financial Advice**: Clear disclaimers throughout
- **No Real Data**: Uses mock stock data for demonstration
- **Theme Persistence**: Automatically saves user preference
- **Offline Capable**: Works with browser cache

## 🔄 State Flow

```
App Start
   ↓
Check localStorage for theme
   ↓
Load saved preferences
   ↓
Show Welcome or Dashboard based on tutorial status
   ↓
Navigation between screens
   ↓
Update state (favorites, tasks, points)
   ↓
Persist to localStorage
```

## 🚀 Future Enhancements

- Real-time stock data via API
- Supabase integration for user accounts
- WebSocket for live price updates
- Mobile app with React Native
- Advanced charting with TradingView
- Social features (following friends)
- Portfolio tracking
- Detailed analytics

## 📦 Dependencies

- **Next.js 16.2.0** - React framework
- **React 19.2.4** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Supabase** - Backend services

## 📄 License

This is a prototype/demo application. All rights reserved.

## 🤝 Support

For questions or feedback about this app interface, refer to the included documentation and code comments.

---

**Built with ❤️ for stock enthusiasts**
