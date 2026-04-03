'use client';

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../utils/colors';

interface SignUpScreenProps {
  onBack?: () => void;
  onSignIn?: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onBack, onSignIn }) => {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    if (!displayName.trim() || !email.trim() || !password) {
      setError('Please fill in your name, email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error, confirmEmail: needsConfirm } = await signUp(email.trim(), password, displayName.trim());
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    if (needsConfirm) {
      setConfirmEmail(true);
    }
    // If no email confirmation required, AuthContext session update drives navigation.
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

  if (confirmEmail) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
        style={{ background: 'linear-gradient(135deg, #1a2847 0%, #2a3f6b 50%, #1a2847 100%)' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-8 text-4xl"
          style={{ backgroundColor: `${COLORS.primary}30` }}
        >
          ✉️
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Check your email</h1>
        <p className="text-base leading-relaxed" style={{ color: '#a0aec0' }}>
          We sent a confirmation link to <span className="text-white font-medium">{email}</span>.
          Click it to activate your account, then sign in.
        </p>
        <button
          onClick={onSignIn}
          className="mt-10 w-full py-4 rounded-full font-semibold text-lg text-white"
          style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #7c7cff)` }}
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen p-6"
      style={{ background: 'linear-gradient(135deg, #1a2847 0%, #2a3f6b 50%, #1a2847 100%)' }}
    >
      {/* Back */}
      {onBack && (
        <button onClick={onBack} className="mb-8 self-start p-2 -ml-2" style={{ color: '#a0aec0' }}>
          <ArrowLeft size={22} />
        </button>
      )}

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Create account</h1>
        <p className="text-base" style={{ color: '#a0aec0' }}>Start understanding the market</p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#90a0bf' }}>Display name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Alex Chen"
            autoComplete="name"
            style={inputStyle}
          />
        </div>

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
              placeholder="At least 6 characters"
              autoComplete="new-password"
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

        <div>
          <label className="block text-sm mb-2" style={{ color: '#90a0bf' }}>
            Invite code <span style={{ color: '#6a7a8f' }}>(optional)</span>
          </label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="FRIEND-CODE"
            autoComplete="off"
            style={{ ...inputStyle, letterSpacing: '0.08em' }}
          />
        </div>

        {error && (
          <p className="text-sm px-1" style={{ color: '#fc8181' }}>{error}</p>
        )}

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full py-4 rounded-full font-semibold text-lg text-white mt-2 transition-all"
          style={{
            background: loading ? '#4a5a7a' : `linear-gradient(135deg, ${COLORS.primary}, #7c7cff)`,
            boxShadow: loading ? 'none' : '0 10px 30px rgba(99,102,241,0.4)',
          }}
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="text-center text-sm mt-4" style={{ color: '#90a0bf' }}>
          Already have an account?{' '}
          <button onClick={onSignIn} className="font-semibold" style={{ color: COLORS.primary }}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
