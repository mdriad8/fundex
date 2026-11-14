import { type ElementType, type ReactNode, type PointerEvent } from 'react';

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

/** A card whose background and border light up around the cursor. */
export default function Spotlight({ children, as: Tag = 'div', className = '' }: Props) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };
  return (
    <Tag onPointerMove={onMove} className={`spotlight ${className}`}>
      {children}
    </Tag>
  );
}
