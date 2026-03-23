'use client';

/**
 * CAPIVAREX CommunitySection — Landing Page (capivarex.com)
 * Design: Temporal Drift — Supreme Frontend Director
 *
 * Layout:
 *   1. Animated ticker bar (frases a deslizar lateralmente, estilo terminal dourado)
 *   2. Section header
 *   3. Capivara grid — fotos reais:
 *      - ARA: cor original, glow dourado pulsante, badge verde ACTIVE
 *      - Outros 7: grayscale(100%) brightness(0.32), cadeado SVG sempre visível
 *
 * Note: uses 'use client' because of useState/useEffect (Next.js App Router)
 */

import { useEffect, useRef, useState } from "react";

// ─── CDN URLs (CloudFront) ────────────────────────────────────────────────────
const CAP_IMGS: Record<string, string> = {
  ARA:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/capivara-smart_16fe9711.png",
  IVI:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/Untitleddesign(18)_01f1dfb7.png",
  OKA:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/Untitleddesign(14)_81a005b7.png",
  YARA: "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/Untitleddesign(16)_3aba5233.png",
  AYVU: "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/Untitleddesign(17)_4a2347f5.png",
  MBAE: "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/Untitleddesign(15)_bf125aa9.png",
  PORA: "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/Untitleddesign(19)_9015dfab.png",
  TUPA: "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/Untitleddesign(13)_40625213.png",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const capybaras = [
  { name: "ARA",  role: "Life & Time",  color: "#D4A017", glowColor: "rgba(212,160,23,0.6)",  active: true  },
  { name: "IVI",  role: "Finance",      color: "#2ECC71", glowColor: "rgba(46,204,113,0.5)",  active: false },
  { name: "OKA",  role: "Smart Home",   color: "#00BCD4", glowColor: "rgba(0,188,212,0.5)",   active: false },
  { name: "YARA", role: "Travel",       color: "#9B59B6", glowColor: "rgba(155,89,182,0.5)",  active: false },
  { name: "AYVU", role: "Voice",        color: "#E91E8C", glowColor: "rgba(233,30,140,0.5)",  active: false },
  { name: "MBAE", role: "Work & Code",  color: "#E67E22", glowColor: "rgba(230,126,34,0.5)",  active: false },
  { name: "PORA", role: "Creative",     color: "#2196F3", glowColor: "rgba(33,150,243,0.5)",  active: false },
  { name: "TUPA", role: "Security",     color: "#E53935", glowColor: "rgba(229,57,53,0.5)",   active: false },
];

const TICKER_ITEMS = [
  "ARA IS AWAKE",
  "MORNING BRIEFING READY",
  "YOUR DAY BEFORE IT BEGINS",
  "CAPIVAREX COMMUNITY",
  "8 CAPYBARAS",
  "PROACTIVE AI",
  "DIGITAL MEETS PHYSICAL",
  "BUILT IN DUBLIN",
  "INTELLIGENT BY DESIGN",
  "ALWAYS ONE STEP AHEAD",
];

// ─── Lock SVG — always visible on locked capivaras ───────────────────────────
function LockIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="5" y="11" width="14" height="10" rx="2"
        fill="rgba(0,0,0,0.75)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.2"
      />
      <path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.5" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

// ─── Ticker Bar ───────────────────────────────────────────────────────────────
function TickerBar() {
  // Triple the items for a perfectly seamless loop at any screen width
  const tripled = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="overflow-hidden"
      style={{
        borderTop: "1px solid rgba(212, 160, 23, 0.12)",
        borderBottom: "1px solid rgba(212, 160, 23, 0.12)",
        background: "rgba(212, 160, 23, 0.025)",
        padding: "14px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          /* 33.333% = one full copy → seamless loop */
          animation: "communityTicker 40s linear infinite",
        }}
      >
        {tripled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.62rem",
              color: "rgba(212, 160, 23, 0.55)",
              letterSpacing: "0.2em",
              whiteSpace: "nowrap",
              flexShrink: 0,
              paddingLeft: "3rem",
              paddingRight: "3rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "3rem",
            }}
          >
            {item}
            <span
              style={{
                color: "rgba(212, 160, 23, 0.25)",
                fontSize: "0.45rem",
                flexShrink: 0,
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function CommunitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="community"
      className="relative"
      style={{ background: "#0A0A0A" }}
      ref={ref}
    >
      {/* ── Ticker bar at the very top of the section ── */}
      <TickerBar />

      {/* ── Top ambient glow ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "60px",
          height: "200px",
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(212,160,23,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="landing-container py-20 md:py-28">
        {/* ── Section header ── */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.62rem",
              color: "rgba(212, 160, 23, 0.55)",
              letterSpacing: "0.22em",
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}
          >
            THE CAPYBARA COMMUNITY
          </p>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              color: "#F8F8F8",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "1.25rem",
            }}
          >
            Build your own
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #D4A017 0%, #F5C842 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI team.
            </span>
          </h2>
          <p
            className="max-w-lg mx-auto"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "1rem",
              color: "rgba(248, 248, 248, 0.4)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            ARA is live today. The other specialists are being activated one
            by one — each one expanding what your AI team can do for you.
          </p>
        </div>

        {/* ── Capivara grid ── */}
        <div
          className="capivara-grid grid gap-3 sm:gap-4"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {capybaras.map((cap, i) => {
            const isHovered = hoveredIdx === i;

            return (
              <div
                key={cap.name}
                className="flex flex-col items-center text-center"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? isHovered && !cap.active
                      ? "translateY(-4px)"
                      : "translateY(0)"
                    : "translateY(20px)",
                  transition: `opacity 0.6s ease ${0.2 + i * 0.06}s, transform 0.35s ease`,
                  cursor: cap.active ? "default" : "pointer",
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* ── Photo card ── */}
                <div
                  className="relative w-full rounded-2xl overflow-hidden mb-3"
                  style={{
                    aspectRatio: "1 / 1",
                    border: cap.active
                      ? "1.5px solid rgba(212,160,23,0.5)"
                      : "1.5px solid rgba(255,255,255,0.06)",
                    boxShadow: cap.active
                      ? "0 0 20px rgba(212,160,23,0.45), 0 0 50px rgba(212,160,23,0.2), inset 0 0 20px rgba(212,160,23,0.05)"
                      : isHovered
                      ? "0 4px 20px rgba(0,0,0,0.5)"
                      : "none",
                    transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                    background: "#111",
                  }}
                >
                  {/* Capivara photo */}
                  <img
                    src={CAP_IMGS[cap.name]}
                    alt={`${cap.name} — ${cap.role}`}
                    className="w-full h-full object-cover"
                    style={{
                      filter: cap.active
                        ? "none"
                        : "grayscale(100%) brightness(0.32)",
                      transition: "filter 0.4s ease",
                      mixBlendMode: "lighten",
                    }}
                  />

                  {/* ARA: pulsing green active dot */}
                  {cap.active && (
                    <div
                      className="absolute top-2 right-2 z-20"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#22C55E",
                        boxShadow: "0 0 0 0 rgba(34,197,94,0.7)",
                        animation: "activePulse 2s ease-out infinite",
                      }}
                    />
                  )}

                  {/* ARA: subtle gold shimmer overlay */}
                  {cap.active && (
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 30%, rgba(212,160,23,0.12) 0%, transparent 65%)",
                      }}
                    />
                  )}

                  {/* Locked: dark veil + lock icon always visible */}
                  {!cap.active && (
                    <>
                      <div
                        className="absolute inset-0 z-10"
                        style={{ background: "rgba(0,0,0,0.35)" }}
                      />
                      <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <div
                          style={{
                            background: "rgba(0,0,0,0.6)",
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(255,255,255,0.1)",
                            backdropFilter: "blur(4px)",
                            opacity: isHovered ? 1 : 0.75,
                            transition: "opacity 0.3s ease",
                          }}
                        >
                          <LockIcon />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Name */}
                <p
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.1em",
                    color: cap.active ? "#D4A017" : "rgba(248,248,248,0.3)",
                    transition: "color 0.3s ease",
                    marginBottom: "2px",
                  }}
                >
                  {cap.name}
                </p>

                {/* Role / status */}
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.6rem",
                    color: cap.active
                      ? "rgba(248,248,248,0.45)"
                      : "rgba(248,248,248,0.18)",
                    lineHeight: 1.3,
                    transition: "color 0.3s ease",
                  }}
                >
                  {cap.active ? cap.role : "Coming soon"}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Bottom concept note ── */}
        <div
          className="mt-14 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.7s",
          }}
        >
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.58rem",
              color: "rgba(212, 160, 23, 0.3)",
              letterSpacing: "0.14em",
            }}
          >
            ARA IS LIVE NOW → MORE MODULES ACTIVATING SOON → YOUR AI TEAM GROWS WITH YOU
          </p>
        </div>
      </div>

      {/* ── Bottom border ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212, 160, 23, 0.15), transparent)",
        }}
      />

      {/* ── Keyframes (inline — no extra CSS file needed) ── */}
      <style>{`
        @media (min-width: 640px) {
          .capivara-grid { grid-template-columns: repeat(8, 1fr) !important; }
        }
        @keyframes communityTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes activePulse {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.7); }
          70%  { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
      `}</style>
    </section>
  );
}
