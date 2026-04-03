'use client';

import React from 'react';
import { ArrowLeft, Sparkles, Star, UsersRound, HelpCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { COLORS } from '../../utils/colors';

interface MoreTilesScreenProps {
  onBack: () => void;
}

const PURCHASE_OPTIONS = [
  { tiles: 1, priceLabel: '£0.99', badge: '' },
  { tiles: 3, priceLabel: '£1.99', badge: 'Popular' },
  { tiles: 5, priceLabel: '£2.99', badge: 'Best Value' },
];

export const MoreTilesScreen: React.FC<MoreTilesScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const {
    favouriteTileCount,
    referralInvites,
    expandFavouriteTiles,
    recordReferralInvite,
  } = useAppContext();

  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : '#f1f5f9';
  const textSecondary = isDark ? COLORS.dark.textSecondary : '#cbd5e1';
  const cardText = '#334155';

  const invitesNeeded = Math.max(0, 3 - (referralInvites % 3));

  return (
    <div
      className="px-4 pb-28"
      style={{
        minHeight: '100vh',
        background: isDark
          ? 'linear-gradient(180deg, #111827 0%, #1f2352 100%)'
          : 'linear-gradient(180deg, #eaf0ff 0%, #1a2d69 24%, #122257 100%)',
      }}
    >
      <div className="mx-auto max-w-[430px] pt-5 md:max-w-none">
        <button
          onClick={onBack}
          className="p-1 rounded-lg"
          style={{ color: textSecondary }}
          aria-label="Back"
        >
          <ArrowLeft size={28} />
        </button>

        <div className="pt-6">
          <h1 className="text-6xl font-bold leading-none" style={{ color: textColor }}>
            More Tiles
          </h1>
          <p className="text-sm mt-3" style={{ color: textSecondary }}>
            Expand your favourites
          </p>
          <p className="text-sm mt-2" style={{ color: textSecondary }}>
            You currently have {favouriteTileCount} favourite tiles.
          </p>
        </div>

        <div
          className="mt-6 rounded-[2.2rem] p-5"
          style={{
            background: 'linear-gradient(135deg, #f2e2b2 0%, #f6d7d8 100%)',
            border: '1px solid rgba(255,255,255,0.38)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg" style={{ color: cardText }}>
                Friends Invited
              </div>
              <div className="text-4xl leading-none mt-2" style={{ color: '#1e293b' }}>
                {referralInvites}
              </div>
            </div>

            <button
              className="rounded-full px-4 py-2 text-base font-medium flex items-center gap-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.55)', color: cardText }}
              aria-label="How referrals work"
              type="button"
            >
              <HelpCircle size={20} />
              How it works
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            {[0, 1, 2].map((index) => {
              const active = index < (referralInvites % 3);
              return (
                <div
                  key={index}
                  className="h-16 w-16 rounded-[1.2rem] flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.52)' }}
                >
                  <Star size={34} color={active ? '#64748b' : '#94a3b8'} />
                </div>
              );
            })}
          </div>

          <p className="text-center text-xl mt-5" style={{ color: cardText }}>
            Invite {invitesNeeded} more friend{invitesNeeded === 1 ? '' : 's'} to earn 1 free tile
          </p>

          <button
            onClick={recordReferralInvite}
            className="mt-5 w-full rounded-full py-4 text-2xl font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: '#eceff3', color: '#334155' }}
          >
            <UsersRound size={24} />
            Invite Friends
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-4xl font-semibold" style={{ color: textColor }}>
            Purchase Tiles
          </h2>
          <div className="text-base flex items-center gap-2" style={{ color: '#9a8cf8' }}>
            <Sparkles size={18} />
            Charity pledge
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          {PURCHASE_OPTIONS.map((option) => (
            <div
              key={option.tiles}
              className="rounded-[2rem] p-4"
              style={{
                background: option.tiles === 1
                  ? 'linear-gradient(90deg, #938de0 0%, #a9a8dc 100%)'
                  : option.tiles === 3
                    ? 'linear-gradient(90deg, #73b0ea 0%, #a0c8eb 100%)'
                    : 'linear-gradient(90deg, #8fd2ca 0%, #b6dfc9 100%)',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-5xl leading-none" style={{ color: '#f1f5f9' }}>
                    {option.tiles}
                  </div>
                  <div className="text-2xl mt-2" style={{ color: '#e2e8f0' }}>
                    Favourite {option.tiles === 1 ? 'Tile' : 'Tiles'}
                  </div>
                </div>

                <div className="text-right">
                  {option.badge && (
                    <div
                      className="inline-block rounded-full px-3 py-1 text-sm mb-2"
                      style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#f8fafc' }}
                    >
                      {option.badge}
                    </div>
                  )}
                  <div className="text-5xl leading-none" style={{ color: '#f8fafc' }}>
                    {option.priceLabel}
                  </div>
                </div>
              </div>

              <button
                onClick={() => expandFavouriteTiles(option.tiles)}
                className="mt-4 w-full rounded-full py-3 text-xl font-semibold"
                style={{ backgroundColor: '#ecf2f8', color: '#334155' }}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
