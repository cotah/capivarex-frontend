'use client';

/**
 * CAPIVAREX Footer + TickerBar — ARA Landing Page
 * Design: Temporal Drift — dark minimal footer with gold accents
 * FIX: ticker items properly spaced with flex-shrink-0 to prevent overlap
 */

function TickerBar() {
  const items = [
    "ARA IS AWAKE",
    "MORNING BRIEFING READY",
    "CAPIVAREX COMMUNITY",
    "8 CAPYBARAS",
    "DIGITAL MEETS PHYSICAL",
    "YOUR DAY BEFORE IT BEGINS",
    "PROACTIVE AI",
    "BUILT IN DUBLIN",
  ];

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden py-3 border-y"
      style={{
        borderColor: "rgba(212, 160, 23, 0.1)",
        background: "rgba(212, 160, 23, 0.03)",
      }}
    >
      <div
        className="animate-ticker"
        style={{
          display: "flex",
          width: "max-content",
          gap: "0",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.6rem",
              color: "rgba(212, 160, 23, 0.45)",
              letterSpacing: "0.18em",
              whiteSpace: "nowrap",
              flexShrink: 0,
              paddingLeft: "2.5rem",
              paddingRight: "2.5rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "2.5rem",
            }}
          >
            {item}
            <span style={{ color: "rgba(212, 160, 23, 0.2)", fontSize: "0.5rem" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "#0A0A0A" }}>
      <TickerBar />

      <div className="landing-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663191684519/Apr9Un2WM3LpTtemqgdqtD/capivarex-logo-horizontal_9f2876b3.png"
                alt="CAPIVAREX"
                style={{ height: "28px", width: "auto", objectFit: "contain" }}
              />
            </div>
            <p
              className="max-w-xs"
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.875rem",
                color: "rgba(248, 248, 248, 0.35)",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              The first AI community that lives in your world, not just on your
              screen. Built in Dublin, for the world.
            </p>
            <p
              className="mt-4"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.6rem",
                color: "rgba(212, 160, 23, 0.3)",
                letterSpacing: "0.1em",
              }}
            >
              capivarex.com
            </p>
          </div>

          {/* Product */}
          <div>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.6rem",
                color: "rgba(212, 160, 23, 0.5)",
                letterSpacing: "0.15em",
                marginBottom: "1rem",
              }}
            >
              PRODUCT
            </p>
            <ul className="flex flex-col gap-3">
              {["ARA", "IVI (Soon)", "OKA (Soon)", "TUPA (Soon)", "Pricing"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.825rem",
                        color: "rgba(248, 248, 248, 0.35)",
                        fontWeight: 300,
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "#D4A017")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "rgba(248, 248, 248, 0.35)")
                      }
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.6rem",
                color: "rgba(212, 160, 23, 0.5)",
                letterSpacing: "0.15em",
                marginBottom: "1rem",
              }}
            >
              COMPANY
            </p>
            <ul className="flex flex-col gap-3">
              {["About", "Privacy Policy", "Terms of Service", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.825rem",
                        color: "rgba(248, 248, 248, 0.35)",
                        fontWeight: 300,
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "#D4A017")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "rgba(248, 248, 248, 0.35)")
                      }
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
        >
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.6rem",
              color: "rgba(248, 248, 248, 0.2)",
              letterSpacing: "0.1em",
            }}
          >
            © 2026 CAPIVAREX LTD. DUBLIN, IRELAND. ALL RIGHTS RESERVED.
          </p>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.6rem",
              color: "rgba(212, 160, 23, 0.25)",
              letterSpacing: "0.1em",
            }}
          >
            BUILT WITH ♥ AND CIRCUIT GOLD
          </p>
        </div>
      </div>
    </footer>
  );
}
