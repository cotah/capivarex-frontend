'use client';

/**
 * CAPIVAREX FeaturesSection — ARA Landing Page
 * Design: Temporal Drift — asymmetric grid, custom SVG icons (no emojis, no generic icons)
 */

import { useEffect, useRef, useState } from "react";

/* Custom SVG Icons — geometric, CAPIVAREX style */
function IconBriefing() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="6" width="22" height="16" rx="1.5" stroke="#D4A017" strokeWidth="1.2" fill="none"/>
      <line x1="3" y1="11" x2="25" y2="11" stroke="#D4A017" strokeWidth="1.2" opacity="0.5"/>
      <circle cx="14" cy="4" r="2" stroke="#D4A017" strokeWidth="1.2" fill="none"/>
      <line x1="8" y1="15" x2="20" y2="15" stroke="#D4A017" strokeWidth="1" opacity="0.6"/>
      <line x1="8" y1="18" x2="16" y2="18" stroke="#D4A017" strokeWidth="1" opacity="0.4"/>
      <circle cx="22" cy="20" r="3.5" fill="#0A0A0A" stroke="#D4A017" strokeWidth="1"/>
      <line x1="22" y1="18.5" x2="22" y2="20" stroke="#D4A017" strokeWidth="1" strokeLinecap="round"/>
      <line x1="22" y1="20" x2="23.2" y2="21" stroke="#D4A017" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="6" width="22" height="19" rx="1.5" stroke="#D4A017" strokeWidth="1.2" fill="none"/>
      <line x1="3" y1="12" x2="25" y2="12" stroke="#D4A017" strokeWidth="1.2" opacity="0.5"/>
      <line x1="9" y1="3" x2="9" y2="9" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19" y1="3" x2="19" y2="9" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="7" y="15" width="4" height="3" rx="0.5" fill="#D4A017" opacity="0.6"/>
      <rect x="12" y="15" width="4" height="3" rx="0.5" fill="#D4A017" opacity="0.3"/>
      <rect x="17" y="15" width="4" height="3" rx="0.5" fill="#D4A017" opacity="0.3"/>
    </svg>
  );
}
function IconWeather() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="11" r="5" stroke="#D4A017" strokeWidth="1.2" fill="none"/>
      <line x1="14" y1="3" x2="14" y2="5" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6" y1="11" x2="8" y2="11" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="11" x2="22" y2="11" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 21 Q10 18 14 20 Q18 22 22 20" stroke="#D4A017" strokeWidth="1" fill="none" opacity="0.5"/>
      <line x1="10" y1="23" x2="10" y2="25" stroke="#D4A017" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
      <line x1="14" y1="24" x2="14" y2="26" stroke="#D4A017" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
      <line x1="18" y1="23" x2="18" y2="25" stroke="#D4A017" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}
function IconVoice() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <rect x="10" y="3" width="8" height="14" rx="4" stroke="#D4A017" strokeWidth="1.2" fill="none"/>
      <path d="M5 15 C5 21 23 21 23 15" stroke="#D4A017" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <line x1="14" y1="21" x2="14" y2="25" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="25" x2="18" y2="25" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconReminder() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <path d="M14 3 C9 3 6 7 6 12 L6 18 L4 21 L24 21 L22 18 L22 12 C22 7 19 3 14 3Z" stroke="#D4A017" strokeWidth="1.2" fill="none"/>
      <path d="M11 24 Q14 27 17 24" stroke="#D4A017" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <line x1="14" y1="10" x2="14" y2="15" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="15" x2="17" y2="13" stroke="#D4A017" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function IconMarket() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <polyline points="3,20 8,13 13,16 18,8 25,11" stroke="#D4A017" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="13" r="1.5" fill="#D4A017" opacity="0.7"/>
      <circle cx="13" cy="16" r="1.5" fill="#D4A017" opacity="0.5"/>
      <circle cx="18" cy="8" r="1.5" fill="#D4A017" opacity="0.9"/>
      <circle cx="25" cy="11" r="1.5" fill="#D4A017" opacity="0.7"/>
      <line x1="3" y1="23" x2="25" y2="23" stroke="#D4A017" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

const features = [
  {
    icon: <IconBriefing />,
    tag: "PROACTIVITY",
    title: "Morning Briefing",
    description:
      "Every morning at your chosen time, ARA sends a complete briefing: weather, calendar, reminders, market data — before you ask.",
    accent: "#D4A017",
    size: "large",
  },
  {
    icon: <IconCalendar />,
    tag: "CALENDAR",
    title: "Smart Scheduling",
    description:
      "Connect Google Calendar. ARA manages your events, sends reminders, and warns you about conflicts proactively.",
    accent: "#D4A017",
    size: "small",
  },
  {
    icon: <IconWeather />,
    tag: "WEATHER",
    title: "Real-Time Weather",
    description:
      "Live weather for your location, updated every hour. ARA tells you what to wear before you check your phone.",
    accent: "#D4A017",
    size: "small",
  },
  {
    icon: <IconVoice />,
    tag: "VOICE + TEXT",
    title: "Natural Conversation",
    description:
      "Talk to ARA in natural language — text or voice. Set reminders, ask questions, get answers. No commands, no syntax.",
    accent: "#D4A017",
    size: "medium",
  },
  {
    icon: <IconReminder />,
    tag: "REMINDERS",
    title: "Intelligent Reminders",
    description:
      "ARA doesn't just remind you — it reminds you at the right moment, with context. 'Your meeting starts in 15 min. Traffic is heavy.'",
    accent: "#D4A017",
    size: "medium",
  },
  {
    icon: <IconMarket />,
    tag: "FINANCE",
    title: "Market Pulse",
    description:
      "Daily financial summary: your watchlist, crypto, and market movers — delivered with your morning briefing.",
    accent: "#D4A017",
    size: "small",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="surface-card rounded-sm p-6 transition-all duration-700 group cursor-default"
      style={{
        transitionDelay: `${index * 80}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className="flex flex-col gap-4 h-full">
        {/* Tag + Icon */}
        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.6rem",
              color: "rgba(212, 160, 23, 0.5)",
              letterSpacing: "0.15em",
            }}
          >
            {feature.tag}
          </span>
          <div
            className="p-2 rounded-sm"
            style={{
              background: "rgba(212, 160, 23, 0.06)",
              border: "1px solid rgba(212, 160, 23, 0.15)",
            }}
          >
            {feature.icon}
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: "1.15rem",
            color: "#F8F8F8",
            letterSpacing: "-0.02em",
          }}
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.875rem",
            color: "rgba(248, 248, 248, 0.45)",
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          {feature.description}
        </p>

        {/* Gold accent line */}
        <div
          className="mt-auto h-px transition-all duration-500"
          style={{
            background:
              "linear-gradient(to right, rgba(212, 160, 23, 0.3), transparent)",
          }}
        />
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      className="relative py-24 md:py-32"
      style={{ background: "#0A0A0A" }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212, 160, 23, 0.2), transparent)",
        }}
      />

      <div className="landing-container">
        {/* Section header */}
        <div
          ref={titleRef}
          className="mb-16 max-w-2xl"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.8s ease",
          }}
        >
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.65rem",
              color: "rgba(212, 160, 23, 0.6)",
              letterSpacing: "0.2em",
              marginBottom: "1rem",
            }}
          >
            WHAT ARA DOES
          </p>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "#F8F8F8",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            The AI that lives
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #D4A017 0%, #F5C842 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in your world.
            </span>
          </h2>
          <p
            className="mt-4"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "1rem",
              color: "rgba(248, 248, 248, 0.45)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            While every other AI lives on your screen, ARA reaches into your
            physical world — your home, your calendar, your commute, your
            morning routine.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
