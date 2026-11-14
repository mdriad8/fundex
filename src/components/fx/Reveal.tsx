import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from 'react';

type Props = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: 'up' | 'left' | 'right' | 'zoom';
  className?: string;
};

/** Fades and slides its content in the first time it scrolls into view. */
export default function Reveal({ children, as: Tag = 'div', delay = 0, variant = 'up', className = '' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-variant={variant}
      className={`reveal ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
