import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Left column — text */}
        <div className="text-left">
          <p className="text-sm font-medium text-accent uppercase tracking-[0.15em] mb-4">
            Campus Micro-Leasing
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text leading-[1.1]">
            Borrow what you need.<br />Share what you don&apos;t.
          </h1>
          <p className="mt-4 text-base text-secondary leading-relaxed max-w-md">
            DormShare connects students to borrow, lease, and share campus essentials — no need to buy everything new.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <Link
              to="/marketplace"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 hover:bg-accent-hover transition-all duration-200"
            >
              Browse Marketplace
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-text hover:bg-accent-light transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Right column — illustration */}
        <div className="relative flex justify-center">
          <svg viewBox="0 0 440 380" className="w-full max-w-md" fill="none">
            <defs>
              <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Ambient orbs behind illustration */}
            <circle cx="220" cy="190" r="170" fill="url(#glow)" />
            <circle cx="120" cy="100" r="80" fill="#0d9488" fillOpacity="0.04" />
            <circle cx="340" cy="300" r="90" fill="#0d9488" fillOpacity="0.04" />

            {/* Connecting lines */}
            <path d="M115 160 Q170 130 215 125" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" fill="none" />
            <path d="M315 155 Q290 140 260 130" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" fill="none" />
            <path d="M130 280 Q175 300 220 310" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" fill="none" />
            <path d="M300 270 Q280 290 255 305" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" fill="none" />

            {/* Phone mockup frame */}
            <rect x="155" y="45" width="130" height="290" rx="22" fill="white" stroke="#e7e5e4" strokeWidth="1.5" />
            <rect x="205" y="60" width="30" height="6" rx="3" fill="#e7e5e4" />

            {/* App header bar */}
            <rect x="175" y="84" width="90" height="10" rx="5" fill="#0d9488" />

            {/* App card rows */}
            <rect x="175" y="110" width="90" height="36" rx="8" fill="#f0fdfa" stroke="#ccfbf1" strokeWidth="1" />
            <rect x="175" y="156" width="90" height="36" rx="8" fill="#f0fdfa" stroke="#ccfbf1" strokeWidth="1" />
            <rect x="175" y="202" width="90" height="36" rx="8" fill="#f0fdfa" stroke="#ccfbf1" strokeWidth="1" />
            <rect x="175" y="248" width="90" height="36" rx="8" fill="#f0fdfa" stroke="#ccfbf1" strokeWidth="1" />

            {/* Card content dots */}
            <circle cx="191" cy="128" r="6" fill="#0d9488" fillOpacity="0.15" />
            <rect x="203" y="123" width="46" height="10" rx="3" fill="#0d9488" fillOpacity="0.1" />
            <circle cx="191" cy="174" r="6" fill="#0d9488" fillOpacity="0.15" />
            <rect x="203" y="169" width="46" height="10" rx="3" fill="#0d9488" fillOpacity="0.1" />
            <circle cx="191" cy="220" r="6" fill="#0d9488" fillOpacity="0.15" />
            <rect x="203" y="215" width="46" height="10" rx="3" fill="#0d9488" fillOpacity="0.1" />
            <circle cx="191" cy="266" r="6" fill="#0d9488" fillOpacity="0.15" />
            <rect x="203" y="261" width="46" height="10" rx="3" fill="#0d9488" fillOpacity="0.1" />

            {/* Floating item — books */}
            <g transform="translate(60, 100)">
              <rect x="0" y="0" width="42" height="56" rx="4" fill="#0d9488" fillOpacity="0.08" />
              <rect x="6" y="8" width="30" height="40" rx="3" fill="white" stroke="#0d9488" strokeWidth="1.5" />
              <rect x="12" y="14" width="10" height="26" rx="1" fill="#0d9488" fillOpacity="0.15" />
              <rect x="26" y="18" width="5" height="20" rx="1" fill="#0d9488" />
            </g>

            {/* Floating item — lamp */}
            <g transform="translate(330, 140)">
              <rect x="10" y="24" width="4" height="30" rx="2" fill="#0d9488" fillOpacity="0.25" />
              <path d="M0 4 Q12-6 24 4 L22 12 Q12 2 2 12 Z" fill="#0d9488" fillOpacity="0.12" stroke="#0d9488" strokeWidth="1" />
              <circle cx="12" cy="30" r="2.5" fill="#0d9488" />
            </g>

            {/* Floating item — mini fridge */}
            <g transform="translate(340, 240)">
              <rect x="0" y="0" width="44" height="60" rx="5" fill="white" stroke="#e7e5e4" strokeWidth="1.5" />
              <rect x="8" y="10" width="28" height="38" rx="3" fill="#f0fdfa" stroke="#ccfbf1" strokeWidth="1" />
              <rect x="10" y="12" width="10" height="12" rx="2" fill="#0d9488" fillOpacity="0.1" />
              <rect x="10" y="28" width="10" height="12" rx="2" fill="#0d9488" fillOpacity="0.1" />
              <rect x="36" y="36" width="4" height="4" rx="1" fill="#0d9488" />
            </g>

            {/* Floating item — plant */}
            <g transform="translate(65, 240)">
              <rect x="14" y="30" width="12" height="16" rx="2" fill="#0d9488" fillOpacity="0.15" />
              <path d="M12 30 Q20 18 28 30" fill="#0d9488" fillOpacity="0.2" />
              <path d="M8 24 Q16 14 24 24" fill="#0d9488" fillOpacity="0.15" />
              <path d="M16 20 Q20 10 24 20" fill="#0d9488" fillOpacity="0.12" />
              <circle cx="14" cy="28" r="2" fill="#0d9488" fillOpacity="0.3" />
              <circle cx="26" cy="28" r="2" fill="#0d9488" fillOpacity="0.3" />
            </g>

            {/* Floating item — calendar/badge */}
            <g transform="translate(60, 190)">
              <circle cx="14" cy="14" r="14" fill="#0d9488" fillOpacity="0.08" />
              <rect x="6" y="6" width="16" height="16" rx="3" fill="white" stroke="#0d9488" strokeWidth="1" />
              <rect x="8" y="10" width="12" height="2" rx="1" fill="#0d9488" />
              <rect x="8" y="14" width="8" height="2" rx="1" fill="#0d9488" fillOpacity="0.3" />
            </g>

            {/* Tiny decorative dots */}
            <circle cx="400" cy="80" r="3" fill="#0d9488" fillOpacity="0.1" />
            <circle cx="50" cy="340" r="4" fill="#0d9488" fillOpacity="0.08" />
            <circle cx="390" cy="340" r="2" fill="#0d9488" fillOpacity="0.15" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default Hero;
