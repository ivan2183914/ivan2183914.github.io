import { motion } from "framer-motion";
import { Gift, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { scrollToId } from "../lib/scroll";

export const Promo = () => (
  <section id="promo" className="px-4 py-12 sm:px-6 md:px-8">
    <Reveal className="mx-auto max-w-7xl">
      <div className="relative overflow-hidden rounded-3xl bg-blaze p-8 md:p-16">
        <span className="text-outline-dark pointer-events-none absolute -right-6 -top-10 select-none font-display text-[10rem] font-bold leading-none md:text-[16rem]">
          300
        </span>

        <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <Gift size={18} className="text-[#050505]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#050505]/70">
                Акция месяца
              </span>
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-[#050505] md:text-5xl">
              Очистка кузова глиной — 1500₽
            </h2>
            <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-[#050505]/75">
              Закажите глубокую очистку кузова глиной и получите 300₽ подарком на
              следующие услуги. Глина снимает то, что не берёт обычная мойка.
            </p>
          </div>

          <motion.button
            data-testid="promo-booking-btn"
            onClick={() => scrollToId("booking")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group flex items-center gap-3 self-start rounded-full bg-[#050505] px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white md:self-auto"
          >
            Забрать подарок
            <ArrowRight size={18} className="text-blaze transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </Reveal>
  </section>
);
