/** Chunky isometric blocks (MLH-style), drawn in the Fundex palette. Decorative only. */
type Cube = { x: number; y: number; z: number; tone: 'teal' | 'slate' | 'white' | 'cyan' };

const TONES = {
  teal: ['#5eead4', '#14b8a6', '#0f766e'],
  cyan: ['#a5f3fc', '#22d3ee', '#0e7490'],
  slate: ['#475569', '#1e293b', '#0f172a'],
  white: ['#ffffff', '#e2e8f0', '#94a3b8'],
};

function cubePolys(c: Cube, s: number) {
  // isometric projection of grid position (x, y, z) to 2D
  const ox = (c.x - c.y) * s * 0.866;
  const oy = (c.x + c.y) * s * 0.5 - c.z * s;
  const top = [
    [ox, oy - s],
    [ox + s * 0.866, oy - s * 0.5],
    [ox, oy],
    [ox - s * 0.866, oy - s * 0.5],
  ];
  const left = [
    [ox - s * 0.866, oy - s * 0.5],
    [ox, oy],
    [ox, oy + s],
    [ox - s * 0.866, oy + s * 0.5],
  ];
  const right = [
    [ox, oy],
    [ox + s * 0.866, oy - s * 0.5],
    [ox + s * 0.866, oy + s * 0.5],
    [ox, oy + s],
  ];
  const pts = (p: number[][]) => p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');
  return { top: pts(top), left: pts(left), right: pts(right), depth: c.x + c.y + c.z };
}

const STACK: Cube[] = [
  { x: 0, y: 0, z: 0, tone: 'slate' },
  { x: 1, y: 0, z: 0, tone: 'teal' },
  { x: 2, y: 0, z: 0, tone: 'slate' },
  { x: 0, y: 1, z: 0, tone: 'teal' },
  { x: 1, y: 1, z: 0, tone: 'white' },
  { x: 0, y: 2, z: 0, tone: 'slate' },
  { x: 0, y: 0, z: 1, tone: 'white' },
  { x: 1, y: 0, z: 1, tone: 'slate' },
  { x: 0, y: 1, z: 1, tone: 'cyan' },
  { x: 0, y: 0, z: 2, tone: 'teal' },
  { x: 2, y: 2, z: 0, tone: 'cyan' },
];

export default function Blocks({ className = '', size = 46 }: { className?: string; size?: number }) {
  const cubes = STACK.map((c) => ({ c, p: cubePolys(c, size) })).sort((a, b) => a.p.depth - b.p.depth || a.c.z - b.c.z);
  const w = size * 6;
  return (
    <svg viewBox={`${-w / 2} ${-size * 3.6} ${w} ${size * 6}`} className={className} aria-hidden="true">
      {cubes.map(({ c, p }, i) => {
        const [t, l, r] = TONES[c.tone];
        return (
          <g key={i} className="hk-block" style={{ animationDelay: `${i * 0.25}s` }}>
            <polygon points={p.top} fill={t} stroke="#020617" strokeWidth="2" strokeLinejoin="round" />
            <polygon points={p.left} fill={l} stroke="#020617" strokeWidth="2" strokeLinejoin="round" />
            <polygon points={p.right} fill={r} stroke="#020617" strokeWidth="2" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
}
