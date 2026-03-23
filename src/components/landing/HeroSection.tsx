'use client';

/**
 * CAPIVAREX HeroSection — ARA Landing Page
 * Design: Temporal Drift — Kinetic Dark Luxury
 * Full viewport, asymmetric, animated clock, capybara floating
 */

import { useEffect, useState } from "react";

const HERO_CAPYBARA =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/ara-hero-capybara-aERYbPoqZb3GKm972obKsD.webp";
const CIRCUIT_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/ara-circuit-bg-2Wzubi7nTt47VS7eDv83pj.webp";

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div
      className="flex items-baseline gap-1"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      <span
        className="text-5xl md:text-7xl font-light"
        style={{ color: "#D4A017", letterSpacing: "-0.04em" }}
      >
        {hours}:{minutes}
      </span>
      <span
        className="text-xl md:text-2xl font-light animate-pulse-gold"
        style={{ color: "rgba(212, 160, 23, 0.5)" }}
      >
        :{seconds}
      </span>
    </div>
  );
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* Circuit background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${CIRCUIT_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(212, 160, 23, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #0A0A0A)",
        }}
      />

      <div className="landing-container relative z-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">
          {/* Left — Content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 self-start transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                background: "rgba(212, 160, 23, 0.08)",
                border: "1px solid rgba(212, 160, 23, 0.2)",
                borderRadius: "2px",
                padding: "0.375rem 0.875rem",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#D4A017" }}
              />
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.65rem",
                  color: "#D4A017",
                  letterSpacing: "0.1em",
                }}
              >
                PROACTIVE AI — ARA IS ALREADY AWAKE
              </span>
            </div>

            {/* Live clock */}
            <div
              className={`transition-all duration-700 delay-100 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <LiveClock />
              <p
                className="mt-1"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.65rem",
                  color: "rgba(212, 160, 23, 0.4)",
                  letterSpacing: "0.15em",
                }}
              >
                ARA IS ALREADY AWAKE
              </p>
            </div>

            {/* Headline */}
            <div
              className={`transition-all duration-700 delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h1
                className="leading-none"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  color: "#F8F8F8",
                  letterSpacing: "-0.03em",
                }}
              >
                Your day,
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #D4A017 0%, #F5C842 50%, #D4A017 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  before it begins.
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <p
              className={`max-w-md transition-all duration-700 delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "1.05rem",
                color: "rgba(248, 248, 248, 0.55)",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >

              Meet ARA — the AI that works while you sleep. Every morning,
              before you check your phone, ARA has already read your calendar,
              checked your emails, looked up the weather, and prepared your
              daily briefing.{" "}
              <span style={{ color: "#D4A017" }}>You don&apos;t ask. It just does.</span>
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 delay-400 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <a
                href="/register"
                className="btn-gold"
              >
                Try Free for 7 Days
              </a>
              <a
                href="#how-it-works"
                className="btn-outline-gold"
              >
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div
              className={`flex items-center gap-6 transition-all duration-700 delay-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex -space-x-2">
                {["#D4A017", "#8B6914", "#F5C842", "#6B4F10"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                      style={{
                        background: color,
                        borderColor: "#0A0A0A",
                        color: "#0A0A0A",
                        fontFamily: "Space Grotesk, sans-serif",
                      }}
                    >
                      {["H", "A", "M", "L"][i]}
                    </div>
                  )
                )}
              </div>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(248, 248, 248, 0.4)",
                }}
              >
                Join the early community
              </p>
            </div>
          </div>

          {/* Right — Capybara visual */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Glow behind capybara */}
            <div
              className="absolute"
              style={{
                width: "500px",
                height: "500px",
                background:
                  "radial-gradient(circle, rgba(212, 160, 23, 0.15) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />

            {/* Capybara image */}
            <div
              className={`relative animate-float transition-all duration-1000 delay-300 ${
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ maxWidth: "520px", width: "100%" }}
            >
              <img
                src={HERO_CAPYBARA}
                alt="ARA — AI Capybara Assistant"
                className="w-full h-auto"
                style={{
                  filter: "drop-shadow(0 0 40px rgba(212, 160, 23, 0.3))",
                }}
              />

              {/* Floating data cards */}
              <div
                className={`absolute top-8 -left-8 surface-card rounded p-3 transition-all duration-700 delay-600 ${
                  mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ minWidth: "160px" }}
              >
                <p
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.6rem",
                    color: "rgba(212, 160, 23, 0.6)",
                    letterSpacing: "0.1em",
                  }}
                >
                  MORNING BRIEFING
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.75rem",
                    color: "#F8F8F8",
                    marginTop: "4px",
                  }}
                >
                  Dublin, 12°C ☁️
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.75rem",
                    color: "rgba(248, 248, 248, 0.5)",
                  }}
                >
                  3 events today
                </p>
              </div>

              <div
                className={`absolute bottom-16 -right-6 surface-card rounded p-3 transition-all duration-700 delay-700 ${
                  mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
                style={{ minWidth: "150px" }}
              >
                <p
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.6rem",
                    color: "rgba(212, 160, 23, 0.6)",
                    letterSpacing: "0.1em",
                  }}
                >
                  REMINDER SET
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.75rem",
                    color: "#F8F8F8",
                    marginTop: "4px",
                  }}
                >
                  Team meeting
                </p>
                <p
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.65rem",
                    color: "#D4A017",
                  }}
                >
                  09:30 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <p
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.6rem",
            color: "rgba(212, 160, 23, 0.4)",
            letterSpacing: "0.2em",
          }}
        >
          SCROLL
        </p>
        <div
          className="w-px h-12 animate-pulse-gold"
          style={{ background: "linear-gradient(to bottom, #D4A017, transparent)" }}
        />
      </div>
    </section>
  );
}
