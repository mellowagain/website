"use client";

export function NierBackground() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.45]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="grid"
          x="0"
          y="0"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="120"
            stroke="#7a7468"
            strokeWidth="0.4"
          />
          <line
            x1="0"
            y1="0"
            x2="120"
            y2="0"
            stroke="#7a7468"
            strokeWidth="0.4"
          />
        </pattern>
      </defs>

      {/* Faint structural grid */}
      <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />

      {/* Concentric circles - top right */}
      <circle
        cx="85%"
        cy="10%"
        r="260"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.8"
      />
      <circle
        cx="85%"
        cy="10%"
        r="200"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.7"
      />
      <circle
        cx="85%"
        cy="10%"
        r="145"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.6"
      />
      <circle
        cx="85%"
        cy="10%"
        r="95"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.5"
      />
      <circle
        cx="85%"
        cy="10%"
        r="50"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.5"
      />
      <circle
        cx="85%"
        cy="10%"
        r="15"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.4"
      />

      {/* Concentric circles - bottom left */}
      <circle
        cx="8%"
        cy="85%"
        r="130"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.6"
      />
      <circle
        cx="8%"
        cy="85%"
        r="85"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.5"
      />
      <circle
        cx="8%"
        cy="85%"
        r="45"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.4"
      />

      {/* Diagonal lines sweeping across */}
      <line
        x1="55%"
        y1="0%"
        x2="100%"
        y2="70%"
        stroke="#6b6358"
        strokeWidth="0.6"
      />
      <line
        x1="60%"
        y1="0%"
        x2="100%"
        y2="60%"
        stroke="#6b6358"
        strokeWidth="0.5"
      />
      <line
        x1="50%"
        y1="5%"
        x2="95%"
        y2="85%"
        stroke="#6b6358"
        strokeWidth="0.6"
      />
      <line
        x1="65%"
        y1="0%"
        x2="100%"
        y2="45%"
        stroke="#6b6358"
        strokeWidth="0.4"
      />
      <line
        x1="0%"
        y1="70%"
        x2="40%"
        y2="100%"
        stroke="#6b6358"
        strokeWidth="0.4"
      />
      <line
        x1="45%"
        y1="0%"
        x2="85%"
        y2="100%"
        stroke="#6b6358"
        strokeWidth="0.3"
      />

      {/* Vertical/horizontal accents */}
      <line
        x1="30%"
        y1="0%"
        x2="30%"
        y2="100%"
        stroke="#6b6358"
        strokeWidth="0.3"
        strokeDasharray="3 10"
      />
      <line
        x1="70%"
        y1="0%"
        x2="70%"
        y2="100%"
        stroke="#6b6358"
        strokeWidth="0.3"
        strokeDasharray="3 10"
      />
      <line
        x1="0%"
        y1="40%"
        x2="100%"
        y2="40%"
        stroke="#6b6358"
        strokeWidth="0.3"
        strokeDasharray="3 10"
      />
      <line
        x1="0%"
        y1="65%"
        x2="100%"
        y2="65%"
        stroke="#6b6358"
        strokeWidth="0.2"
        strokeDasharray="2 14"
      />

      {/* Small square markers */}
      <rect
        x="72%"
        y="44%"
        width="5"
        height="5"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.7"
      />
      <rect
        x="25%"
        y="30%"
        width="4"
        height="4"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.6"
      />
      <rect
        x="82%"
        y="74%"
        width="5"
        height="5"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.7"
      />
      <rect
        x="15%"
        y="65%"
        width="4"
        height="4"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.6"
      />
      <rect
        x="50%"
        y="88%"
        width="4"
        height="4"
        fill="none"
        stroke="#6b6358"
        strokeWidth="0.5"
        transform="rotate(45 50 88)"
      />

      {/* Cross marks */}
      <line
        x1="71.5%"
        y1="45%"
        x2="73.5%"
        y2="45%"
        stroke="#6b6358"
        strokeWidth="0.8"
      />
      <line
        x1="72.5%"
        y1="44%"
        x2="72.5%"
        y2="46%"
        stroke="#6b6358"
        strokeWidth="0.8"
      />
      <line
        x1="39.5%"
        y1="20%"
        x2="41.5%"
        y2="20%"
        stroke="#6b6358"
        strokeWidth="0.8"
      />
      <line
        x1="40.5%"
        y1="19%"
        x2="40.5%"
        y2="21%"
        stroke="#6b6358"
        strokeWidth="0.8"
      />

      {/* Accent dots */}
      <circle cx="65%" cy="30%" r="2" fill="#6b6358" />
      <circle cx="78%" cy="55%" r="2" fill="#6b6358" />
      <circle cx="90%" cy="80%" r="2" fill="#6b6358" />
      <circle cx="20%" cy="50%" r="1.5" fill="#6b6358" />
      <circle cx="45%" cy="75%" r="1.5" fill="#6b6358" />
      <circle cx="35%" cy="15%" r="1.5" fill="#6b6358" />
    </svg>
  );
}
