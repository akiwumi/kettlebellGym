const Base = ({ children }) => (
    <div className="w-full rounded-2xl bg-white/70 ring-1 ring-black/5 p-3 dark:bg-white/5 dark:ring-white/10">
      <svg viewBox="0 0 220 120" className="w-full h-24">
        <defs>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.2" />
          </filter>
        </defs>
        <g filter="url(#soft)">{children}</g>
      </svg>
    </div>
  );
  
  function Person({ cx = 70, cy = 40, className = "" }) {
    return (
      <g className={className} transform={`translate(${cx},${cy})`}>
        <circle cx="0" cy="-12" r="8" fill="currentColor" opacity="0.9" />
        <line x1="0" y1="-4" x2="0" y2="28" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
        <line x1="0" y1="6" x2="-18" y2="18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
        <line x1="0" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
        <line x1="0" y1="28" x2="-12" y2="52" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
        <line x1="0" y1="28" x2="12" y2="52" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
      </g>
    );
  }
  
  export default function ExerciseAnimation({ type = "squat" }) {
    // We keep animations simple and reusable (flat UX).
    // Each animation is a small transform loop on the person + optional “tool”.
  return (
      <Base>
        {/* floor */}
        <line x1="20" y1="104" x2="200" y2="104" stroke="currentColor" opacity="0.2" strokeWidth="6" strokeLinecap="round" />
  
        {/* choose animation */}
        {type === "squat" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
          </>
        )}
  
        {type === "hingeSwing" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            {/* kettlebell-ish dot */}
            <g>
              <circle cx="120" cy="78" r="10" fill="currentColor" opacity="0.25" />
              <path d="M112 74 Q120 62 128 74" fill="none" stroke="currentColor" opacity="0.25" strokeWidth="4" strokeLinecap="round" />
            </g>
          </>
        )}
  
        {type === "pushup" && (
          <>
            <g transform="translate(40,54) rotate(90)">
              <Person className="text-ink/80 dark:text-white/80" />
            </g>
          </>
        )}
  
        {type === "row" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            <line x1="120" y1="62" x2="170" y2="62" stroke="currentColor" opacity="0.25" strokeWidth="6" strokeLinecap="round" />
            <line
              x1="120"
              y1="62"
              x2="170"
              y2="62"
              stroke="currentColor"
              opacity="0.25"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="10 8"
            />
          </>
        )}
  
        {type === "press" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            <g>
              <rect x="128" y="20" width="18" height="44" rx="9" fill="currentColor" opacity="0.2" />
            </g>
          </>
        )}
  
        {type === "lunge" && (
          <>
            <g transform="translate(0,0)">
              <Person className="text-ink/80 dark:text-white/80" />
              <circle cx="64" cy="98" r="5" fill="currentColor" opacity="0.2" />
              <circle cx="86" cy="92" r="5" fill="currentColor" opacity="0.2" />
            </g>
          </>
        )}
  
        {type === "halo" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            <circle cx="70" cy="20" r="18" fill="none" stroke="currentColor" opacity="0.2" strokeWidth="6" strokeLinecap="round" />
          </>
        )}
  
        {type === "twist" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            <circle cx="120" cy="78" r="8" fill="currentColor" opacity="0.2" />
          </>
        )}
  
        {type === "carryMarch" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            <circle cx="48" cy="70" r="7" fill="currentColor" opacity="0.18" />
            <circle cx="92" cy="70" r="7" fill="currentColor" opacity="0.18" />
          </>
        )}
  
        {/* bodyweight extras */}
        {type === "bridge" && (
          <>
            <g transform="translate(40,70)">
              <path d="M10 30 Q35 0 60 30" fill="none" stroke="currentColor" opacity="0.8" strokeWidth="10" strokeLinecap="round" className="text-ink/80 dark:text-white/80" />
              <circle cx="10" cy="30" r="8" fill="currentColor" opacity="0.8" className="text-ink/80 dark:text-white/80" />
            </g>
          </>
        )}
  
        {type === "plank" && (
          <>
            <g transform="translate(35,74)">
              <line x1="0" y1="20" x2="110" y2="20" stroke="currentColor" opacity="0.85" strokeWidth="10" strokeLinecap="round" className="text-ink/80 dark:text-white/80" />
              <circle cx="0" cy="20" r="8" fill="currentColor" opacity="0.85" className="text-ink/80 dark:text-white/80" />
            </g>
          </>
        )}
  
        {type === "climbers" && (
          <>
            <g transform="translate(35,74)" className="text-ink/80 dark:text-white/80">
              <line x1="0" y1="20" x2="110" y2="20" stroke="currentColor" opacity="0.85" strokeWidth="10" strokeLinecap="round" />
              <circle cx="0" cy="20" r="8" fill="currentColor" opacity="0.85" />
            </g>
          </>
        )}
  
        {type === "burpee" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
          </>
        )}
  
        {type === "deadbug" && (
          <>
            <g transform="translate(60,78)" className="text-ink/80 dark:text-white/80">
              <circle cx="0" cy="-10" r="8" fill="currentColor" opacity="0.85" />
              <line x1="0" y1="-2" x2="0" y2="22" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
              <line x1="-28" y1="10" x2="-6" y2="0" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
              <line x1="28" y1="10" x2="6" y2="0" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
            </g>
          </>
        )}
  
        {type === "sideplank" && (
          <>
            <g transform="translate(40,70) rotate(-10)" className="text-ink/80 dark:text-white/80">
              <line x1="0" y1="20" x2="110" y2="20" stroke="currentColor" opacity="0.85" strokeWidth="10" strokeLinecap="round" />
              <circle cx="0" cy="20" r="8" fill="currentColor" opacity="0.85" />
            </g>
          </>
        )}
  
        {type === "highknees" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
          </>
        )}
  
        {/* band-specific extras */}
        {type === "pullApart" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            <line x1="44" y1="54" x2="96" y2="54" stroke="currentColor" opacity="0.25" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 8" />
          </>
        )}
  
        {type === "facePull" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            <line x1="96" y1="46" x2="170" y2="46" stroke="currentColor" opacity="0.25" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 8" />
          </>
        )}
  
        {type === "pallof" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            <line x1="96" y1="62" x2="170" y2="62" stroke="currentColor" opacity="0.25" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 8" />
          </>
        )}
  
        {type === "curl" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            <circle cx="106" cy="66" r="8" fill="currentColor" opacity="0.2" />
          </>
        )}
  
        {type === "pressdown" && (
          <>
            <Person className="text-ink/80 dark:text-white/80" />
            <rect x="124" y="52" width="16" height="30" rx="8" fill="currentColor" opacity="0.2" />
          </>
        )}
      </Base>
    );
  }