import { motion } from "framer-motion";
import { Coffee, Wifi, Tv, Star } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";
import { TRUST_POINTS } from "../data";

const NUM_GRADIENTS = [
  "from-[#FF7A00] to-[#FFC800]",
  "from-white to-white/40",
  "from-[#FF9A33] to-[#FF5500]",
];

const TrustCardPlaceholder = null;

export const Manifesto = () => (
  <section id="trust" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-24">
    <SectionHead
      index="01"
      label="Доверие"
      title="Сначала результат."
      accent="Потом деньги."
      className="max-w-3xl"
    />

    <div className="mt-12 grid gap-5 md:grid-cols-3">
      {TRUST_POINTS.map((p, i) => (
        <Reveal key={p.num} delay={i * 0.1}>
          <motion.div
            data-testid={`trust-card-${i}`}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full flex-col justify-between rounded-2xl border border-white/5 bg-[#121212] p-8 transition-colors duration-300 hover:border-blaze/50"
          >
            <span
              className={`bg-gradient-to-br ${NUM_GRADIENTS[i % 3]} bg-clip-text font-display text-6xl font-bold text-transparent md:text-7xl`}
            >
              {p.num}
            </span>
            <div className="mt-10">
              <h3 className="font-display text-xl font-semibold uppercase tracking-tight text-white md:text-2xl">
                {p.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/50">{p.desc}</p>
            </div>
          </motion.div>
        </Reveal>
      ))}
    </div>

    <div className="mt-5 grid gap-5 md:grid-cols-[2fr_1fr]">
      <Reveal delay={0.1}>
        <motion.div
          data-testid="lounge-card"
          whileHover={{ y: -6 }}
          transition={{ duration: 0.35 }}
          className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-white/5 bg-gradient-to-br from-[#1A1A1A] to-[#0d0d0d] p-8 transition-colors duration-300 hover:border-blaze/50 md:flex-row md:items-end"
        >
          <div className="max-w-md">
            <h3 className="font-display text-xl font-semibold uppercase tracking-tight text-white md:text-2xl">
              Пока мы работаем — вы отдыхаете
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Комната ожидания с кофе, телевизором и Wi-Fi. Сход-развал занимает
              30–40 минут — проведите их с комфортом.
            </p>
          </div>
          <div className="flex gap-6">
            <span className="flex flex-col items-center gap-2 text-white/60">
              <Coffee size={22} className="text-blaze" />
              <span className="text-xs">Кофе</span>
            </span>
            <span className="flex flex-col items-center gap-2 text-white/60">
              <Tv size={22} className="text-blaze" />
              <span className="text-xs">ТВ</span>
            </span>
            <span className="flex flex-col items-center gap-2 text-white/60">
              <Wifi size={22} className="text-blaze" />
              <span className="text-xs">Wi-Fi</span>
            </span>
          </div>
        </motion.div>
      </Reveal>
      <Reveal delay={0.2}>
        <motion.div
          data-testid="rating-card"
          whileHover={{ y: -6 }}
          transition={{ duration: 0.35 }}
          className="flex h-full flex-col justify-between rounded-2xl border border-blaze/40 bg-blaze p-8 text-[#050505]"
        >
          <Star size={26} className="fill-[#050505]" />
          <div className="mt-8">
            <div className="font-display text-5xl font-bold md:text-6xl">4.7</div>
            <p className="mt-3 text-sm font-semibold leading-snug">
              средний рейтинг — более 1200 отзывов на Google, 2ГИС и Yell
            </p>
          </div>
        </motion.div>
      </Reveal>
    </div>
  </section>
);
