import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";
import { SERVICES } from "../data";
import { scrollToId } from "../lib/scroll";

export const Services = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-24">
      <SectionHead
        index="03"
        label="Сервис"
        title="Направления"
        accent="работы ААА"
        className="max-w-3xl"
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <div>
            {SERVICES.map((s, i) => (
              <button
                key={s.title}
                data-testid={`service-item-${i}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => scrollToId("calculator")}
                className="group block w-full border-b border-white/10 py-6 text-left md:py-7"
              >
                <div className="flex items-baseline gap-5 md:gap-8">
                  <span className="font-display text-xs text-white/30 transition-colors duration-300 group-hover:text-blaze">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-xl font-semibold uppercase tracking-tight text-white/40 transition-colors duration-300 group-hover:text-white sm:text-2xl md:text-4xl">
                    {s.title}
                  </h3>
                  {i === 0 && (
                    <span className="hidden shrink-0 rounded-full bg-blaze px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#050505] sm:inline">
                      Основное
                    </span>
                  )}
                  <ArrowUpRight
                    size={26}
                    className="ml-auto shrink-0 text-blaze opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </div>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="max-w-lg pt-4 pl-10 text-sm leading-relaxed text-white/50 md:pl-16">
                      {s.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-3 pl-10 md:pl-16">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-wider text-white/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 overflow-hidden rounded-xl pl-10 md:pl-16 lg:hidden">
                      <img
                        src={s.img}
                        alt={s.title}
                        loading="lazy"
                        className="aspect-[16/9] w-full rounded-xl object-cover"
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="relative hidden lg:block">
          <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-2xl border border-white/5">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={active}
                src={SERVICES[active].img}
                alt={SERVICES[active].title}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <span className="font-display text-xs tracking-[0.25em] text-blaze">
                0{active + 1} / 06
              </span>
              <p className="mt-2 font-display text-lg font-semibold uppercase text-white">
                {SERVICES[active].title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
