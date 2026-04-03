export const COLORS = {
  primary: 'var(--accent-primary)',
  secondary: '#47658f',
  light: {
    bg: '#eef4fc',
    surface: '#ffffff',
    border: '#c8d8ee',
    text: '#0c1f3d',
    textSecondary: '#456187',
    shadow: 'rgba(24, 68, 128, 0.12)',
  },
  dark: {
    bg: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    shadow: 'transparent',
    outline: 'rgba(99, 102, 241, 0.3)', // Indigo outline
  },
  sectors: {
    technology: '#8b5cf6', // Purple
    healthcare: '#ec4899', // Pink
    finance: '#3b82f6', // Blue
    energy: '#f59e0b', // Amber
    retail: '#10b981', // Emerald
    telecommunications: '#06b6d4', // Cyan
  },
};

export const SHADOW_STYLES = {
  light: {
    sm: '0 2px 4px rgba(16, 52, 104, 0.08)',
    md: '0 8px 20px rgba(16, 52, 104, 0.1)',
    lg: '0 14px 30px rgba(16, 52, 104, 0.14)',
    xl: '0 22px 45px rgba(16, 52, 104, 0.2)',
  },
  dark: {
    sm: 'inset 0 0 0 1px rgba(99, 102, 241, 0.1)',
    md: 'inset 0 0 0 1px rgba(99, 102, 241, 0.2)',
    lg: 'inset 0 0 0 1px rgba(99, 102, 241, 0.3)',
    xl: 'inset 0 0 0 2px rgba(99, 102, 241, 0.3)',
  },
};

export const GRADIENTS = {
  light: {
    background: 'linear-gradient(140deg, #f8fbff 0%, #e7effb 100%)',
    primarySoft: 'linear-gradient(145deg, #dce9ff 0%, #eef5ff 100%)',
  },
  dark: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1a1f35 100%)',
    primarySoft: 'linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%)',
  },
};
