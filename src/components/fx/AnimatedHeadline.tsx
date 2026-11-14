import type { CSSProperties } from 'react';

type Props = {
  lines: { text: string; className?: string; wordClassName?: string }[];
  className?: string;
  startDelay?: number;
  step?: number;
};

/** Headline that reveals word by word. Screen readers get the plain sentence. */
export default function AnimatedHeadline({ lines, className = '', startDelay = 150, step = 90 }: Props) {
  let i = 0;
  const full = lines.map((l) => l.text).join(' ');
  return (
    <h1 className={className} aria-label={full}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className={`block ${line.className ?? ''}`}>
          {line.text.split(' ').map((w, wi) => {
            const delay = startDelay + i++ * step;
            return (
              <span key={wi}>
                <span className={`word ${line.wordClassName ?? ''}`} style={{ '--word-delay': `${delay}ms` } as CSSProperties}>
                  {w}
                </span>{' '}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
