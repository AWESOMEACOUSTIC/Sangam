function ScreenDisplay() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <svg
        viewBox="0 0 600 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glow filter for the arc */}
          <filter id="screenGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial gradient for the subtle fill beneath the arc */}
          <radialGradient
            id="screenRadial"
            cx="50%"
            cy="0%"
            rx="55%"
            ry="100%"
            fx="50%"
            fy="0%"
          >
            <stop offset="0%" stopColor="rgba(56,189,248,0.08)" />
            <stop offset="70%" stopColor="rgba(56,189,248,0.02)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0)" />
          </radialGradient>

          {/* Gradient along the arc stroke for natural fade at edges */}
          <linearGradient id="arcStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(56,189,248,0.1)" />
            <stop offset="15%" stopColor="rgba(56,189,248,0.7)" />
            <stop offset="50%" stopColor="rgba(96,210,255,1)" />
            <stop offset="85%" stopColor="rgba(56,189,248,0.7)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.1)" />
          </linearGradient>
        </defs>

        {/* Subtle radial fill area under the curve */}
        <path
          d="M 30 58 Q 300 2 570 58 L 570 80 L 30 80 Z"
          fill="url(#screenRadial)"
        />

        {/* Main glowing arc */}
        <path
          d="M 30 58 Q 300 2 570 58"
          stroke="url(#arcStroke)"
          strokeWidth="4.5"
          strokeLinecap="round"
          filter="url(#screenGlow)"
        />

        {/* SCREEN label */}
        <text
          x="300"
          y="68"
          textAnchor="middle"
          fill="rgba(148,163,184,0.5)"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          letterSpacing="6"
        >
          SCREEN
        </text>
      </svg>
    </div>
  );
}

export default ScreenDisplay;