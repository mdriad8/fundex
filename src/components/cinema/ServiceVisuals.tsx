/**
 * Abstract animated visuals for each service (decorative, aria-hidden).
 * Pure SVG + CSS; animations stop for reduced motion via the .cine-anim class.
 */

export function AdvisoryVisual() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="adv-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="60" fill="url(#adv-core)" />
      {[90, 130, 170].map((r, i) => (
        <g key={r} className="cine-anim" style={{ transformOrigin: '200px 200px', animation: `cine-spin ${18 + i * 10}s linear infinite ${i % 2 ? 'reverse' : ''}` }}>
          <circle cx="200" cy="200" r={r} fill="none" stroke="rgba(94,234,212,0.35)" strokeDasharray={i === 1 ? '2 10' : '60 18'} />
          <circle cx={200 + r} cy="200" r={5 - i} fill="#99f6e4" />
        </g>
      ))}
      <g className="cine-anim" style={{ transformOrigin: '200px 200px', animation: 'cine-needle 6s ease-in-out infinite' }}>
        <path d="M200 120 L212 200 L200 280 L188 200 Z" fill="rgba(45,212,191,0.9)" />
        <path d="M200 200 L212 200 L200 280 L188 200 Z" fill="rgba(15,23,42,0.6)" />
      </g>
      <circle cx="200" cy="200" r="6" fill="#ecfeff" />
    </svg>
  );
}

export function PlanningVisual() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <g
          key={i}
          className="cine-anim"
          style={{
            transformOrigin: '200px 320px',
            animation: `cine-fan-${i} 7s ease-in-out infinite`,
          }}
        >
          <rect x="110" y="70" width="180" height="240" rx="16" fill={i === 2 ? 'rgba(20,184,166,0.18)' : 'rgba(255,255,255,0.05)'} stroke="rgba(94,234,212,0.45)" />
          {i === 2 && (
            <>
              <rect x="135" y="100" width="90" height="10" rx="5" fill="#5eead4" />
              {[130, 152, 174, 196].map((y, k) => (
                <rect key={y} x="135" y={y} width={k % 2 ? 100 : 130} height="6" rx="3" fill="rgba(204,251,241,0.45)" className="cine-anim" style={{ transformOrigin: '135px 0', animation: `cine-line 3.5s ease-in-out ${k * 0.25}s infinite` }} />
              ))}
              <polyline points="135,280 170,255 200,265 235,230 265,240" fill="none" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" className="cine-anim" style={{ animation: 'cine-draw 3.5s ease-in-out infinite' }} />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

export function PartnershipsVisual() {
  const left = [
    [90, 140],
    [70, 210],
    [110, 270],
  ];
  const right = [
    [310, 130],
    [330, 200],
    [295, 275],
  ];
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      {left.map(([x1, y1], i) =>
        right.map(([x2, y2], j) => (
          <line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(94,234,212,0.12)" />
        )),
      )}
      {[
        [left[0], right[1]],
        [left[1], right[0]],
        [left[2], right[2]],
      ].map(([[x1, y1], [x2, y2]], k) => (
        <line
          key={k}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#5eead4"
          strokeWidth="2.5"
          strokeDasharray="8 14"
          className="cine-anim"
          style={{ animation: `cine-flow ${2.2 + k * 0.4}s linear infinite` }}
        />
      ))}
      {left.concat(right).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="22" fill="rgba(20,184,166,0.12)" className="cine-anim" style={{ transformOrigin: `${x}px ${y}px`, animation: `cine-pulse 3s ease-in-out ${i * 0.35}s infinite` }} />
          <circle cx={x} cy={y} r="9" fill={i < 3 ? '#2dd4bf' : '#67e8f9'} />
        </g>
      ))}
      <circle cx="200" cy="205" r="34" fill="rgba(15,23,42,0.85)" stroke="#5eead4" strokeWidth="1.5" />
      <path d="M186 205 l9 9 l19 -19" fill="none" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
