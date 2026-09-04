import { MARQUEE_ITEMS } from "../data";

export const Marquee = () => (
  <div className="marquee-paused relative overflow-hidden border-y border-white/5 bg-[#050505] py-7">
    <div className="animate-marquee flex w-max whitespace-nowrap">
      {[0, 1].map((dup) => (
        <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
          {MARQUEE_ITEMS.map((item) => (
            <span key={`${dup}-${item}`} className="flex items-center">
              <span className="text-outline font-display text-3xl font-bold uppercase tracking-tight md:text-5xl">
                {item}
              </span>
              <span className="mx-8 h-2.5 w-2.5 rotate-45 bg-blaze md:mx-12" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
