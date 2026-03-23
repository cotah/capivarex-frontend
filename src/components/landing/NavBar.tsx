'use client';

/**
 * CAPIVAREX NavBar — ARA Landing Page
 * Design: Temporal Drift — Dark Luxury
 * Sticky, real logo, gold accent, asymmetric
 */

import { useEffect, useState } from "react";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/logo-horizontal-v2_9680221e.png";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10, 10, 10, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(212, 160, 23, 0.1)" : "none",
      }}
    >
      <div className="landing-container flex items-center justify-between h-16">
        {/* Real Logo */}
        <a href="/" className="flex items-center group">
          <img
            src={LOGO_URL}
            alt="CAPIVAREX"
            style={{
              height: "44px",
              width: "auto",
              maxWidth: "200px",
              objectFit: "contain",
              filter: "brightness(1)",
            }}
          />
        </a>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Community", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm transition-colors duration-200"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "rgba(248, 248, 248, 0.5)",
                fontSize: "0.8rem",
                letterSpacing: "0.05em",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#D4A017")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color =
                  "rgba(248, 248, 248, 0.5)")
              }
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="/chat"
            className="hidden md:block btn-outline-gold text-xs"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="btn-gold text-xs"
          >
            Try Free — 7 Days
          </a>
        </div>
      </div>
    </nav>
  );
}
