import { motion } from "framer-motion";

export const CarPass = ({
  size = "md",
  delay = 0.3,
  duration = 1.5,
  repeat = 0,
  repeatDelay = 0,
  className = "",
}) => (
  <motion.div
    data-testid="car-pass"
    initial={{ x: "-95vw" }}
    animate={{ x: "115vw" }}
    transition={{ delay, duration, ease: [0.35, 0.7, 0.2, 1], repeat, repeatDelay }}
    className={`pointer-events-none ${className}`}
  >
    <div className={`relative ${size === "lg" ? "w-[86vw] max-w-[950px]" : "w-[64vw] max-w-[620px]"}`}>
      <div className="absolute -left-28 top-0 hidden h-full flex-col justify-center gap-3 md:flex">
        {[130, 95, 65].map((w, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.9, 0.25, 0.9] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.13 }}
            className="h-[3px] rounded-full bg-gradient-to-l from-[#FF7A00] to-transparent"
            style={{ width: w }}
          />
        ))}
      </div>

      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <img
          src="/car-cutout-alpha.png"
          alt="Чёрный спорткар с оранжевыми полосами"
          className="w-full"
        />
        <div className="absolute bottom-[2%] left-[22%] right-[18%] h-5 rounded-full bg-[#FF7A00]/50 blur-xl" />
      </motion.div>
    </div>
  </motion.div>
);
