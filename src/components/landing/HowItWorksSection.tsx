'use client';

/**
 * CAPIVAREX HowItWorksSection — ARA Landing Page
 * Design: Temporal Drift — step-by-step with phone mockup (no background)
 */

import { useEffect, useRef, useState } from "react";

const MOCKUP_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/ara-morning-mockup-5hdJDL872X9KncXw5qtLdR.webp";

const steps = [
  {
    number: "01",
    title: "Connect your world",
    description:
      "Link Google Calendar, set your location, and choose your briefing time. Takes 2 minutes.",
  },
  {
    number: "02",
    title: "ARA works while you sleep",
    description:
      "Every night, ARA prepares your morning: checks weather, reads your calendar, monitors your watchlist.",
  },
  {
    number: "03",
    title: "Wake up informed",
    description:
      "At 7:58 AM (or your chosen time), ARA sends your complete briefing — before you even check your phone.",
  },
  {
    number: "04",
    title: "Talk naturally all day",
    description:
      "Ask ARA anything throughout the day. Set reminders, get answers, control your smart home — all in conversation.",
  },
];

export default function HowItWorksSection() {
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
    <section
      id="how-it-works"
      className="relative py-24 md:py-32"
      style={{ background: "#0D0D0D" }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212, 160, 23, 0.15), transparent)",
        }}
      />

      <div className="landing-container" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Steps */}
          <div>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                color: "rgba(212, 160, 23, 0.6)",
                letterSpacing: "0.2em",
                marginBottom: "1rem",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.7s ease",
              }}
            >
              HOW IT WORKS
            </p>
            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                color: "#F8F8F8",
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                marginBottom: "3rem",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.7s ease 0.1s",
              }}
            >
              From midnight
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
                to your first coffee.
              </span>
            </h2>

            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  className="flex gap-5"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-24px)",
                    transition: `all 0.7s ease ${0.2 + i * 0.1}s`,
                  }}
                >
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(212, 160, 23, 0.1)",
                        border: "1px solid rgba(212, 160, 23, 0.25)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.7rem",
                          color: "#D4A017",
                          fontWeight: 500,
                        }}
                      >
                        {step.number}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className="w-px flex-1 min-h-8"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(212, 160, 23, 0.2), transparent)",
                        }}
                      />
                    )}
                  </div>

                  <div className="pb-4">
                    <h3
                      style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#F8F8F8",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.875rem",
                        color: "rgba(248, 248, 248, 0.45)",
                        lineHeight: 1.7,
                        fontWeight: 300,
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Phone mockup — background removed via mix-blend-mode */}
          <div
            className="flex justify-center lg:justify-end"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.9s ease 0.3s",
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* Soft gold glow underneath */}
              <div
                className="absolute"
                style={{
                  width: "300px",
                  height: "300px",
                  background:
                    "radial-gradient(circle, rgba(212, 160, 23, 0.12) 0%, transparent 70%)",
                  borderRadius: "50%",
                  filter: "blur(40px)",
                }}
              />
              <img
                src={MOCKUP_IMG}
                alt="ARA Morning Briefing"
                className="relative animate-float"
                style={{
                  maxWidth: "300px",
                  width: "100%",
                  /* mix-blend-mode lighten removes dark backgrounds on dark canvas */
                  mixBlendMode: "lighten",
                  filter:
                    "drop-shadow(0 0 30px rgba(212, 160, 23, 0.25))",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
