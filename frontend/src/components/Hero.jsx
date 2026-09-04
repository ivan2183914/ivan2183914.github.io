import { motion, useScroll, useTransform } from "framer-motion";
import { IMAGES, CONTACTS } from "../data";
import { scrollToId } from "../lib/scroll";
import { easeExpo } from "./Reveal";

const BASE_DELAY = 2.0;
const LINES = [
  {
    text: "Сход-развал",
    cls: "text-white",
    size: "whitespace-nowrap text-[clamp(2.1rem,8.2vw,7.5rem)]",
  },
  {
    text: "по миллиметрам.",
    cls: "text-blaze",
    size: "whitespace-nowrap text-[clamp(1.35rem,5.6vw,6rem)]",
  },
];

export const Hero = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], [0, 220]);
  const bgScale = useTransform(scrollY, [0, 900], [1.06, 1.2]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Чёрный автомобиль в каплях воды"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-black/50" />
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-28 pt-28 sm:px-6 md:px-8"
      >
        <h1 className="font-display font-bold uppercase leading-[0.98] tracking-tight">
          {LINES.map((line, i) => (
            <span key={line.text} className="block overflow-hidden pb-1">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ delay: BASE_DELAY + i * 0.13, duration: 1, ease: easeExpo }}
                className={`block ${line.size} ${line.cls}`}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ delay: BASE_DELAY + 0.45, duration: 0.9, ease: easeExpo }}
              className="max-w-md text-base leading-relaxed text-white/70 md:text-lg"
            >
              Компьютерная регулировка углов колёс с распечаткой до и после.
              Ровный руль, живые шины, уверенная управляемость. Запись без
              очереди — оплата только после результата.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: BASE_DELAY + 0.6, duration: 0.8, ease: easeExpo }}
            className="flex flex-wrap items-center gap-4"
          >
            <motion.button
              data-testid="hero-calculator-btn"
              onClick={() => scrollToId("calculator")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="animate-pulse-glow rounded-full bg-blaze px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-[#050505] transition-colors duration-300 hover:bg-blaze-hover"
            >
              Рассчитать стоимость
            </motion.button>
            <motion.a
              data-testid="hero-call-btn"
              href={CONTACTS.phoneHref}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full border border-white/25 px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors duration-300 hover:border-blaze hover:text-blaze"
            >
              Позвонить
            </motion.a>
          </motion.div>
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BASE_DELAY + 1.2, duration: 1 }}
        className="absolute bottom-28 right-8 z-10 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3 text-white/35"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
            листайте
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-blaze to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};
