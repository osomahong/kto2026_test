"use client";

export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 360 220"
      role="img"
      aria-label="데이터 분석 대시보드 일러스트"
      className="w-full rounded-xl"
      style={{ background: "linear-gradient(135deg, #eef3fb 0%, #dde7f7 100%)" }}
    >
      <defs>
        <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#a5c4f7" />
          <stop offset="100%" stopColor="#00cc33" />
        </linearGradient>
        <linearGradient id="greenGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#b2f0d8" />
          <stop offset="100%" stopColor="#45c4a0" />
        </linearGradient>
        <filter id="cardShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Monitor frame */}
      <rect x="60" y="20" width="240" height="150" rx="12" fill="#fff" filter="url(#cardShadow)" />
      <rect x="60" y="20" width="240" height="28" rx="12" fill="#f0f4fa" />
      <rect x="60" y="40" width="240" height="8" fill="#f0f4fa" />
      {/* Traffic lights */}
      <circle cx="78" cy="34" r="4" fill="#ff6b6b" />
      <circle cx="90" cy="34" r="4" fill="#ffd93d" />
      <circle cx="102" cy="34" r="4" fill="#6bcb77" />

      {/* Bar chart */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 80 + i * 28;
        const heights = [50, 72, 38, 85, 60];
        const h = heights[i];
        return (
          <rect key={i} x={x} y={145 - h} width="18" rx="4" fill="url(#barGrad)" height="0">
            <animate
              attributeName="height"
              from="0"
              to={String(h)}
              dur="0.8s"
              begin={`${0.3 + i * 0.15}s`}
              fill="freeze"
              calcMode="spline"
              keySplines="0.34 1.56 0.64 1"
              keyTimes="0;1"
            />
            <animate
              attributeName="y"
              from="145"
              to={String(145 - h)}
              dur="0.8s"
              begin={`${0.3 + i * 0.15}s`}
              fill="freeze"
              calcMode="spline"
              keySplines="0.34 1.56 0.64 1"
              keyTimes="0;1"
            />
          </rect>
        );
      })}

      {/* Donut chart */}
      <circle cx="258" cy="100" r="30" fill="none" stroke="#d0ffd6" strokeWidth="10" />
      <circle
        cx="258"
        cy="100"
        r="30"
        fill="none"
        stroke="url(#greenGrad)"
        strokeWidth="10"
        strokeDasharray="0 188.5"
        strokeLinecap="round"
        transform="rotate(-90 258 100)"
      >
        <animate
          attributeName="stroke-dasharray"
          from="0 188.5"
          to="132 188.5"
          dur="1.2s"
          begin="0.5s"
          fill="freeze"
          calcMode="spline"
          keySplines="0.4 0 0.2 1"
          keyTimes="0;1"
        />
      </circle>
      <text x="258" y="104" textAnchor="middle" fontSize="14" fontWeight="700" fill="#2d3748">
        70%
      </text>

      {/* AI node connections */}
      {[
        { x1: 220, y1: 68, x2: 246, y2: 68 },
        { x1: 198, y1: 90, x2: 228, y2: 90 },
      ].map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x1}
          y2={line.y2}
          stroke="#a5c4f7"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        >
          <animate
            attributeName="x2"
            from={String(line.x1)}
            to={String(line.x2)}
            dur="0.6s"
            begin={`${1 + i * 0.2}s`}
            fill="freeze"
          />
        </line>
      ))}

      {/* Small floating data points */}
      {[
        { cx: 210, cy: 65, delay: 1.5 },
        { cx: 195, cy: 88, delay: 1.7 },
        { cx: 230, cy: 120, delay: 1.9 },
      ].map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r="3" fill="#00cc33" opacity="0">
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.1;0.8;1"
            dur="3s"
            begin={`${dot.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Monitor stand */}
      <rect x="160" y="170" width="40" height="8" rx="2" fill="#d0d8e4" />
      <rect x="145" y="178" width="70" height="6" rx="3" fill="#d0d8e4" />

      {/* "AI" label */}
      <rect x="240" y="55" width="36" height="18" rx="4" fill="#00cc33" opacity="0">
        <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.4s" fill="freeze" />
      </rect>
      <text x="258" y="68" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" opacity="0">
        AI
        <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.4s" fill="freeze" />
      </text>
    </svg>
  );
}
