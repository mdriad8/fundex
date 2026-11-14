import { Check } from 'lucide-react';

/**
 * One illustrative document that evolves with the journey:
 * situation summary → 90-day plan → delivery tracker → measures dashboard.
 * Purely illustrative (labelled as such); contains no real client data or figures.
 */
const TITLES = ['Situation summary', '90-day plan', 'Delivery tracker', 'Measures that matter'];
const KICKERS = ['Discover', 'Focus', 'Execute', 'Grow'];
const PRIORITIES = ['Sharpen the offer', 'Open a new channel', 'Set the delivery rhythm'];

export default function EvolvingArtifact({ stage }: { stage: number }) {
  return (
    <div
      className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      aria-hidden="true"
    >
      {/* header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-teal-300 transition-all duration-500">{KICKERS[stage]}</p>
          <p key={stage} className="mt-1 text-xl text-white fade-up" style={{ animationDuration: '0.5s' }}>
            {TITLES[stage]}
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${i <= stage ? 'bg-teal-400' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {/* body: the same three rows evolve from notes → priorities → tasks → measures */}
      <div className="space-y-3">
        {PRIORITIES.map((p, i) => (
          <div
            key={p}
            className="relative flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 transition-all duration-500"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            {/* leading marker */}
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold transition-all duration-500 ${
                stage === 2 && i < 2
                  ? 'bg-teal-500 text-slate-950'
                  : stage >= 1
                    ? 'border border-teal-400/50 text-teal-200'
                    : 'border border-white/15 text-transparent'
              }`}
            >
              {stage === 2 && i < 2 ? <Check size={14} strokeWidth={3} /> : stage >= 1 ? i + 1 : ''}
            </span>

            {/* content */}
            <div className="min-w-0 flex-1">
              {stage === 0 ? (
                <div className="space-y-1.5">
                  <span className="block h-2 rounded-full bg-white/15" style={{ width: `${88 - i * 14}%` }} />
                  <span className="block h-2 rounded-full bg-white/10" style={{ width: `${62 - i * 8}%` }} />
                </div>
              ) : stage === 3 ? (
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-slate-300 w-40 shrink-0 truncate">{p}</span>
                  <span className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-300 transition-all duration-700"
                      style={{ width: `${[72, 54, 86][i]}%` }}
                    />
                  </span>
                </div>
              ) : (
                <span className={`block text-sm transition-colors duration-500 ${stage === 2 && i < 2 ? 'text-slate-400 line-through decoration-teal-400/60' : 'text-slate-200'}`}>
                  {p}
                </span>
              )}
            </div>

            {/* trailing meta */}
            {stage === 1 && <span className="text-[11px] text-slate-400">Month {i + 1}</span>}
            {stage === 2 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  i < 2 ? 'bg-teal-500/15 text-teal-200' : 'bg-amber-400/10 text-amber-200'
                }`}
              >
                {i < 2 ? 'Done' : 'In progress'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* footer chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {(stage === 0
          ? ['Goals', 'Constraints', 'Opportunities']
          : stage === 1
            ? ['Owners', 'Milestones']
            : stage === 2
              ? ['Weekly check-in', 'Next actions']
              : ['Reviewed monthly', 'Adjust & scale']
        ).map((c) => (
          <span key={`${stage}-${c}`} className="rounded-full border border-teal-400/20 bg-teal-400/5 px-3 py-1 text-xs text-teal-100 fade-up" style={{ animationDuration: '0.5s' }}>
            {c}
          </span>
        ))}
      </div>

      <p className="mt-5 text-[11px] text-slate-500">Illustrative example only</p>
    </div>
  );
}
