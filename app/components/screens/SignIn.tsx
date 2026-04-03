'use client';

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../utils/colors';

interface SignInScreenProps {
  onBack?: () => void;
  onSignUp?: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onBack, onSignUp }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) setError(error);
    // On success the AuthContext session update triggers routing automatically.
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '14px',
    padding: '14px 16px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
  };

  return (
    <div
      className="flex flex-col min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #1a2847 0%, #2a3f6b 50%, #1a2847 100%)',
      }}
    >
      {/* Back */}
      {onBack && (
        <button onClick={onBack} className="mb-8 self-start p-2 -ml-2" style={{ color: '#a0aec0' }}>
          <ArrowLeft size={22} />
        </button>
      )}

      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-base" style={{ color: '#a0aec0' }}>Sign in to your account</p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#90a0bf' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#90a0bf' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
              style={{ ...inputStyle, paddingRight: '48px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm px-1" style={{ color: '#fc8181' }}>{error}</p>
        )}

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full py-4 rounded-full font-semibold text-lg text-white mt-2 transition-all"
          style={{
            background: loading ? '#4a5a7a' : `linear-gradient(135deg, ${COLORS.primary}, #7c7cff)`,
            boxShadow: loading ? 'none' : '0 10px 30px rgba(99,102,241,0.4)',
          }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="text-center text-sm mt-4" style={{ color: '#90a0bf' }}>
          Don&apos;t have an account?{' '}
          <button onClick={onSignUp} className="font-semibold" style={{ color: COLORS.primary }}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};
