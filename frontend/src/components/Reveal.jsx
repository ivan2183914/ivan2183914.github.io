import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export const Reveal = ({ children, delay = 0, y = 44, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.9, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const SectionHead = ({ index, label, title, accent, className = "" }) => (
  <div className={className}>
    <Reveal>
      <div className="flex items-center gap-4">
        <span className="font-display text-xs tracking-[0.25em] text-blaze">{index}</span>
        <span className="h-px w-12 bg-blaze/60" />
        <span className="text-xs uppercase tracking-[0.25em] text-white/40">{label}</span>
      </div>
    </Reveal>
    <Reveal delay={0.1}>
      <h2 className="mt-6 font-display text-4xl md:text-5xl font-bold uppercase tracking-tight leading-[1.05] text-white">
        {title} {accent && <span className="text-blaze">{accent}</span>}
      </h2>
    </Reveal>
  </div>
);

export const easeExpo = EASE;
