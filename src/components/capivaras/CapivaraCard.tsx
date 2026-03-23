'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/i18n';
import { Lock, Check, ChevronDown, Shield } from 'lucide-react';
import Image from 'next/image';
import type { CapivaraDefinition, PlanType } from '@/lib/types';
import { CAPIVARA_IMAGES } from './capivarasData';

interface CapivaraCardProps {
  capivara: CapivaraDefinition;
  isActive: boolean;
  userPlan?: PlanType;
}

const MAX_VISIBLE_PILLS = 4;

export default function CapivaraCard({ capivara, isActive, userPlan }: CapivaraCardProps) {
  const t = useT();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const isTupa = capivara.id === 'tupa';
  const isUltimate = userPlan === 'capivarex_ultimate';
  const isDisabled = capivara.status === 'disabled';
  const isComingSoon = !isActive && capivara.status === 'coming_soon';

  // TUPA special logic: active only for Ultimate users
  const tupaActive = isTupa && isUltimate;
  const tupaLocked = isTupa && !isUltimate;

  // Final state
  const showActive = isTupa ? tupaActive : isActive;
  const showLocked = isTupa ? tupaLocked : (!isActive && !isComingSoon && !isDisabled);

  const imageSrc = CAPIVARA_IMAGES[capivara.id] || '';
  const extraCount = Math.max(0, capivara.capabilities.length - MAX_VISIBLE_PILLS);

  // Card classes by state
  const cardClass = isDisabled
    ? 'border-white/[0.03] opacity-[0.35] cursor-default'
    : showActive
      ? 'border-[1px] opacity-100'
      : isComingSoon
        ? 'border-white/5 opacity-[0.45] cursor-default'
        : tupaLocked
          ? 'border-red-900/20 opacity-75'
          : 'border-white/10 opacity-75';

  const hoverClass = isDisabled || isComingSoon
    ? ''
    : 'hover:scale-[1.02] hover:shadow-lg';

  const tupaStyle = isTupa ? 'bg-black/30' : '';

  return (
    <div
      className={`glass rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 ${cardClass} ${hoverClass} ${tupaStyle}`}
      style={{
        borderColor: showActive ? `${capivara.color}30` : undefined,
        boxShadow: showActive ? `0 0 24px ${capivara.color}15` : undefined,
      }}
    >
      {/* Capivara image */}
      <div className="relative w-[100px] h-[100px] mb-4 flex-shrink-0">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={capivara.name}
            width={100}
            height={100}
            className={`rounded-full object-cover transition-all duration-500 ${
              showActive ? '' : isDisabled ? 'grayscale brightness-[0.25]' : 'grayscale brightness-[0.4]'
            }`}
          />
        )}
        {(showLocked || tupaLocked) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Lock size={24} className="text-white/60" />
          </div>
        )}
      </div>

      {/* Name + Badge */}
      <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
        <h3 className="text-lg font-bold text-text">{capivara.name}</h3>
        {showActive && !isTupa && (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${capivara.color}20`, color: capivara.color }}
          >
            {t('capivaras.badge_active')}
          </span>
        )}
        {tupaActive && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-900/20 text-red-400 flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            Active — Watching
          </span>
        )}
        {tupaLocked && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-900/20 text-red-400/70">
            🔒 Ultimate Only
          </span>
        )}
        {isComingSoon && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-text-muted">
            {t('capivaras.badge_coming_soon')}
          </span>
        )}
        {isDisabled && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-text-muted/60">
            {t('capivaras.badge_disabled')}
          </span>
        )}
      </div>

      {/* Full name */}
      <p className="text-xs text-text-muted mb-1">{capivara.fullName}</p>

      {/* Short description */}
      <p className="text-sm text-text-muted mb-3">{capivara.description}</p>

      {/* Capability pills + accordion (not shown for disabled) */}
      {!isDisabled && (
        <>
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {capivara.capabilities.slice(0, MAX_VISIBLE_PILLS).map((cap) => (
              <span
                key={cap.name}
                className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted"
              >
                {cap.icon} {cap.name}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
                +{extraCount} more
              </span>
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors mb-3"
          >
            {t('capivaras.see_inside')}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>

          {expanded && (
            <div className="w-full border-t border-white/5 pt-3 mb-3 space-y-2 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              {capivara.capabilities.map((cap) => (
                <div key={cap.name} className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0">{cap.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-text">{cap.name}</p>
                    <p className="text-[11px] text-text-muted">{cap.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Disabled — minimal message */}
      {isDisabled && (
        <p className="text-[11px] text-text-muted/50 italic mb-3">
          {t('capivaras.disabled_message')}
        </p>
      )}

      {/* Action buttons */}
      {showActive && !isTupa && (
        <button
          disabled
          className="w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 cursor-default"
          style={{ backgroundColor: `${capivara.color}15`, color: capivara.color }}
        >
          <Check size={14} />
          {t('capivaras.active_cta')}
        </button>
      )}
      {tupaActive && (
        <button
          onClick={() => router.push('/settings')}
          className="w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 bg-red-900/20 text-red-400 hover:bg-red-900/30 transition-colors"
        >
          <Shield size={14} />
          View Security Dashboard
        </button>
      )}
      {tupaLocked && (
        <button
          onClick={() => router.push('/pricing')}
          className="w-full py-2 rounded-xl text-sm font-medium bg-red-900/20 text-red-300 hover:bg-red-900/30 transition-colors"
        >
          Unlock with Ultimate
        </button>
      )}
      {showLocked && !isTupa && (
        <button
          onClick={() => router.push('/pricing')}
          className="w-full py-2 rounded-xl text-sm font-medium bg-accent text-black hover:bg-accent/90 transition-colors"
        >
          {t('capivaras.unlock_cta', { price: capivara.price.toFixed(2) })}
        </button>
      )}
    </div>
  );
}
