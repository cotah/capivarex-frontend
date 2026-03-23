'use client';

/**
 * CAPIVAREX CTASection — ARA Landing Page
 * Design: Temporal Drift — final CTA with capybara glow
 */

import { useEffect, useRef, useState } from "react";

export default function CTASection() {
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
      className="relative py-32 overflow-hidden"
      style={{ background: "#0A0A0A" }}
      ref={ref}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212, 160, 23, 0.2), transparent)",
        }}
      />

      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212, 160, 23, 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="landing-container relative z-10 text-center">
        <p
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.65rem",
            color: "rgba(212, 160, 23, 0.6)",
            letterSpacing: "0.2em",
            marginBottom: "1.5rem",
            opacity: visible ? 1 : 0,
            transition: "all 0.7s ease",
          }}
        >
          START TODAY
        </p>

        <h2
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "#F8F8F8",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: "1.5rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.8s ease 0.1s",
          }}
        >
          Tomorrow morning,
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
            ARA will be ready.
          </span>
        </h2>

        <p
          className="max-w-lg mx-auto mb-10"
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "1.05rem",
            color: "rgba(248, 248, 248, 0.45)",
            lineHeight: 1.7,
            fontWeight: 300,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.8s ease 0.2s",
          }}
        >
          Set up takes 2 minutes. No credit card required for your 7-day trial.
          Connect your calendar tonight — wake up tomorrow with your first
          briefing already waiting.
        </p>

        <div
          className="flex flex-wrap gap-4 justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.8s ease 0.3s",
          }}
        >
          <a
            href="/register"
            className="btn-gold"
            style={{ fontSize: "0.8rem", padding: "1rem 3rem" }}
          >
            Start Your Free Trial — 7 Days
          </a>
        </div>

        {/* Decorative circuit line */}
        <div
          className="mt-16 flex items-center justify-center gap-4"
          style={{
            opacity: visible ? 0.3 : 0,
            transition: "all 1s ease 0.5s",
          }}
        >
          <div
            className="h-px flex-1 max-w-32"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(212, 160, 23, 0.5))",
            }}
          />
          <div
            className="w-2 h-2 rounded-full animate-pulse-gold"
            style={{ background: "#D4A017" }}
          />
          <div
            className="h-px flex-1 max-w-32"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(212, 160, 23, 0.5))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
