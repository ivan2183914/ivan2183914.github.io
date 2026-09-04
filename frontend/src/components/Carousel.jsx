import { useEffect, useRef } from "react";

export const AutoScrollRow = ({ children, speed = 0.6, testid }) => {
  const ref = useRef(null);
  const paused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const step = () => {
      if (!paused.current && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return (
    <div
      ref={ref}
      data-testid={testid}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onPointerDown={() => (paused.current = true)}
      onPointerUp={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
      onTouchEnd={() => (paused.current = false)}
      className="flex cursor-grab overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex shrink-0 gap-5 pr-5">{children}</div>
      <div className="flex shrink-0 gap-5 pr-5" aria-hidden>
        {children}
      </div>
    </div>
  );
};
