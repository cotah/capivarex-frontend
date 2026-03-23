'use client';

/**
 * CAPIVAREX MorningBriefingSection — ARA Landing Page
 * Shows the morning briefing hero moment — the most powerful sales scene
 * Design: Temporal Drift — dark luxury, gold accents
 */

import { useEffect, useRef, useState } from "react";

const briefingItems = [
  {
    tag: "CALENDAR",
    icon: "▦",
    title: "2 events today",
    detail: "10:00 — Investor call (45 min)  ·  15:30 — Dentist, Stephen's Green",
    color: "#D4A017",
  },
  {
    tag: "EMAIL",
    icon: "◈",
    title: "3 important emails",
    detail: "Pending proposal from João  ·  AWS invoice overdue  ·  Contract to sign",
    color: "#D4A017",
  },
  {
    tag: "WEATHER",
    icon: "◎",
    title: "Dublin — 14°C, cloudy",
    detail: "Rain expected after 18:00. Good morning for walking to your 10:00 call.",
    color: "#D4A017",
  },
  {
    tag: "FINANCE",
    icon: "◇",
    title: "Portfolio — +2.1% today",
    detail: "AAPL +1.8%  ·  BTC stable  ·  3 watchlist alerts",
    color: "#1D9E75",
  },
  {
    tag: "SMART HOME",
    icon: "⬡",
    title: "Ready when you are",
    detail: "Shall I turn on the lights and start your morning playlist?",
    color: "#D4A017",
  },
];

export default function MorningBriefingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % briefingItems.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <section
      id="briefing"
      className="relative py-24 md:py-32"
      style={{ background: "#080808" }}
      ref={ref}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212, 160, 23, 0.25), transparent)",
        }}
      />

      <div className="landing-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Copy */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.8s ease",
            }}
          >
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                color: "rgba(212, 160, 23, 0.6)",
                letterSpacing: "0.2em",
                marginBottom: "1.25rem",
              }}
            >
              HOW YOUR MORNING CHANGES
            </p>

            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                color: "#F8F8F8",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              You wake up.
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #D4A017 0%, #F5C842 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ARA already did everything.
              </span>
            </h2>

            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "1rem",
                color: "rgba(248, 248, 248, 0.5)",
                lineHeight: 1.75,
                fontWeight: 300,
                marginBottom: "2rem",
                maxWidth: "460px",
              }}
            >
              While you slept, ARA read your calendar, scanned your inbox,
              checked the weather, monitored your portfolio, and prepared
              everything you need to know before your first coffee.
              No notifications. No scrolling. Just your day, ready.
            </p>

            <div className="flex flex-col gap-3">
              {[
                "Works while you sleep — briefing ready at wake-up time",
                "Reads your real calendar and real inbox",
                "Connects weather, traffic, and your schedule together",
                "Asks before acting — you always stay in control",
              ].map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-16px)",
                    transition: `all 0.6s ease ${0.3 + i * 0.1}s`,
                  }}
                >
                  <span
                    style={{
                      color: "#D4A017",
                      fontSize: "0.7rem",
                      marginTop: "3px",
                      flexShrink: 0,
                    }}
                  >
                    ✦
                  </span>
                  <span
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.875rem",
                      color: "rgba(248, 248, 248, 0.6)",
                      lineHeight: 1.5,
                    }}
                  >
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Briefing card mockup */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.9s ease 0.2s",
            }}
          >
            {/* Phone-like card */}
            <div
              className="mx-auto"
              style={{
                maxWidth: "360px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(212, 160, 23, 0.2)",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  background: "rgba(212, 160, 23, 0.07)",
                  borderBottom: "1px solid rgba(212, 160, 23, 0.15)",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.6rem",
                      color: "rgba(212, 160, 23, 0.6)",
                      letterSpacing: "0.15em",
                      margin: 0,
                    }}
                  >
                    ARA — MORNING BRIEFING
                  </p>
                  <p
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "#D4A017",
                      margin: "2px 0 0",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    07:14
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#22C55E",
                      boxShadow: "0 0 6px rgba(34,197,94,0.8)",
                      animation: "pulse 2s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.55rem",
                      color: "#22C55E",
                      letterSpacing: "0.1em",
                    }}
                  >
                    LIVE
                  </span>
                </div>
              </div>

              {/* Briefing items */}
              <div style={{ padding: "0.5rem 0" }}>
                {briefingItems.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "0.75rem 1.25rem",
                      borderBottom:
                        i < briefingItems.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                      background:
                        activeItem === i
                          ? "rgba(212, 160, 23, 0.05)"
                          : "transparent",
                      transition: "background 0.4s ease",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        background: "rgba(212,160,23,0.08)",
                        border: `1px solid ${
                          activeItem === i
                            ? "rgba(212,160,23,0.4)"
                            : "rgba(212,160,23,0.12)"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "14px",
                        color: item.color,
                        transition: "border-color 0.4s ease",
                      }}
                    >
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "3px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "0.5rem",
                            color: "rgba(212,160,23,0.45)",
                            letterSpacing: "0.12em",
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: "Space Grotesk, sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color:
                            activeItem === i
                              ? "#F8F8F8"
                              : "rgba(248,248,248,0.7)",
                          margin: "0 0 2px",
                          transition: "color 0.4s ease",
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.72rem",
                          color: "rgba(248,248,248,0.38)",
                          margin: 0,
                          lineHeight: 1.5,
                          fontWeight: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div
                style={{
                  padding: "0.875rem 1.25rem",
                  borderTop: "1px solid rgba(212,160,23,0.1)",
                  background: "rgba(212,160,23,0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.75rem",
                    color: "rgba(248,248,248,0.35)",
                    fontWeight: 300,
                  }}
                >
                  Good morning, have a great day.
                </span>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.55rem",
                    color: "#D4A017",
                    letterSpacing: "0.1em",
                  }}
                >
                  ARA 🐾
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
