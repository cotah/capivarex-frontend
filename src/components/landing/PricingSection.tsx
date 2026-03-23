'use client';

/**
 * CAPIVAREX PricingSection — ARA Landing Page
 * Design: Temporal Drift — asymmetric pricing cards
 */

import { useEffect, useRef, useState } from "react";

const plans = [
  {
    name: "Starter",
    price: "€9.99",
    period: "/mo",
    description: "Everything you need to start your days smarter. ARA handles your morning before you even open your eyes.",
    features: [
      "Morning briefing — weather, calendar & news",
      "Smart reminders & notes",
      "Web search & translations",
      "Telegram & WebApp access",
      "50 deep research queries/month",
    ],
    cta: "Start Free Trial",
    ctaLink: "/register?plan=starter",
    highlighted: false,
    tag: "7-DAY FREE TRIAL",
  },
  {
    name: "Personal",
    price: "€19.99",
    period: "/mo",
    description: "For people who want ARA running their life, not just their mornings. The most popular choice.",
    features: [
      "Everything in Starter",
      "Email summaries & smart inbox",
      "Package tracking",
      "Maps, routes & traffic alerts",
      "150 deep research queries/month",
      "Voice responses (TTS)",
    ],
    cta: "Get Personal",
    ctaLink: "/register?plan=personal",
    highlighted: true,
    tag: "MOST POPULAR",
  },
  {
    name: "Power",
    price: "€34.99",
    period: "/mo",
    description: "Maximum usage, priority responses, and first access to every new feature as it launches.",
    features: [
      "Everything in Personal",
      "3x higher usage limits on all services",
      "Priority response speed",
      "Early access to new modules",
      "Direct support channel",
    ],
    cta: "Get Power",
    ctaLink: "/register?plan=power",
    highlighted: false,
    tag: "POWER USER",
  },
];

export default function PricingSection() {
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
      id="pricing"
      className="relative py-24 md:py-32"
      style={{ background: "#0D0D0D" }}
      ref={ref}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212, 160, 23, 0.15), transparent)",
        }}
      />

      <div className="landing-container">
        {/* Header */}
        <div
          className="mb-16 max-w-xl"
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
              marginBottom: "1rem",
            }}
          >
            PRICING
          </p>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              color: "#F8F8F8",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Start free.
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
              Scale as you grow.
            </span>
          </h2>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className="rounded-sm p-6 flex flex-col gap-5 transition-all duration-300"
              style={{
                background: plan.highlighted
                  ? "rgba(212, 160, 23, 0.06)"
                  : "rgba(255, 255, 255, 0.02)",
                border: plan.highlighted
                  ? "1px solid rgba(212, 160, 23, 0.35)"
                  : "1px solid rgba(255, 255, 255, 0.06)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `all 0.7s ease ${0.1 + i * 0.1}s`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Highlighted glow */}
              {plan.highlighted && (
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, #D4A017, transparent)",
                  }}
                />
              )}

              {/* Tag */}
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.6rem",
                  color: plan.highlighted
                    ? "#D4A017"
                    : "rgba(248, 248, 248, 0.3)",
                  letterSpacing: "0.15em",
                }}
              >
                {plan.tag}
              </span>

              {/* Name & Price */}
              <div>
                <h3
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#F8F8F8",
                    marginBottom: "0.5rem",
                  }}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontWeight: 800,
                      fontSize: "2.5rem",
                      color: plan.highlighted ? "#D4A017" : "#F8F8F8",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.8rem",
                      color: "rgba(248, 248, 248, 0.35)",
                    }}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.8rem",
                    color: "rgba(248, 248, 248, 0.4)",
                    marginTop: "0.5rem",
                    fontWeight: 300,
                  }}
                >
                  {plan.description}
                </p>
              </div>

              {/* Divider */}
              <div
                className="h-px"
                style={{
                  background: plan.highlighted
                    ? "rgba(212, 160, 23, 0.2)"
                    : "rgba(255, 255, 255, 0.06)",
                }}
              />

              {/* Features */}
              <ul className="flex flex-col gap-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span
                      style={{
                        color: plan.highlighted
                          ? "#D4A017"
                          : "rgba(212, 160, 23, 0.5)",
                        fontSize: "0.75rem",
                        marginTop: "2px",
                        flexShrink: 0,
                      }}
                    >
                      ✦
                    </span>
                    <span
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.825rem",
                        color: "rgba(248, 248, 248, 0.55)",
                        lineHeight: 1.5,
                        fontWeight: 300,
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.ctaLink}
                className={plan.highlighted ? "btn-gold" : "btn-outline-gold"}
                style={{ textAlign: "center", display: "block" }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Note */}
        <p
          className="text-center mt-8"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.6rem",
            color: "rgba(248, 248, 248, 0.2)",
            letterSpacing: "0.1em",
            opacity: visible ? 1 : 0,
            transition: "all 0.8s ease 0.5s",
          }}
        >
          7-DAY FREE TRIAL · NO CREDIT CARD REQUIRED · CANCEL ANYTIME · GDPR COMPLIANT
        </p>
      </div>
    </section>
  );
}
