import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageCircle, Send, ArrowUpRight } from "lucide-react";
import { scrollToId } from "../lib/scroll";
import { CONTACTS } from "../data";

const NAV = [
  { id: "trust", label: "Почему мы", desc: "Без предоплаты — оплата после результата" },
  { id: "calculator", label: "Калькулятор", desc: "Точная цена за 30 секунд" },
  { id: "services", label: "Направления", desc: "Сход-развал, шиномонтаж, мойка" },
  { id: "reviews", label: "Отзывы", desc: "4.7 — более 1200 оценок" },
  { id: "contacts", label: "Контакты", desc: "Московский пр., 191А · 9:00–21:00" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const go = (id) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 350 : 0);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050505]/70 backdrop-blur-md">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">
          <button
            data-testid="logo-btn"
            onClick={() => go("top")}
            className="font-display text-xl font-bold uppercase tracking-tight text-white"
          >
            ААА<span className="text-blaze">.</span>
            <span className="ml-2 hidden text-[10px] font-medium tracking-[0.3em] text-white/40 sm:inline">
              сход-развал
            </span>
          </button>

          <div className="flex items-center gap-3">
            <a
              data-testid="header-phone-link"
              href={CONTACTS.phoneHref}
              className="hidden items-center gap-2 text-sm font-semibold text-white/80 transition-colors duration-300 hover:text-blaze md:flex"
            >
              <Phone size={15} className="text-blaze" />
              {CONTACTS.phone}
            </a>
            <motion.button
              data-testid="header-booking-btn"
              onClick={() => go("calculator")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="hidden rounded-full bg-blaze px-5 py-2.5 text-sm font-bold text-[#050505] transition-colors duration-300 hover:bg-blaze-hover sm:block"
            >
              Записаться
            </motion.button>
            <button
              data-testid="menu-btn"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-blaze hover:text-blaze"
              aria-label="Меню"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[90] flex flex-col bg-[#050505]/[0.98] backdrop-blur-xl"
          >
            <div className="flex h-[70px] items-center justify-between border-b border-white/5 px-4 sm:px-6 md:px-8">
              <span className="font-display text-xl font-bold uppercase text-white">
                ААА<span className="text-blaze">.</span>
              </span>
              <button
                data-testid="menu-close-btn"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-blaze hover:text-blaze"
                aria-label="Закрыть меню"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-5 sm:px-6 md:px-16">
              {NAV.map((n, i) => (
                <div key={n.id} className="overflow-hidden border-b border-white/5">
                  <motion.button
                    data-testid={`menu-${n.id}`}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => go(n.id)}
                    className="group flex w-full items-center justify-between gap-4 py-4 text-left md:py-5"
                  >
                    <span className="flex min-w-0 items-baseline gap-4">
                      <span className="shrink-0 font-display text-xs text-blaze">0{i + 1}</span>
                      <span className="truncate font-display text-2xl font-bold uppercase tracking-tight text-white/60 transition-all duration-300 group-hover:text-white sm:text-4xl md:text-5xl">
                        {n.label}
                      </span>
                    </span>
                    <span className="hidden max-w-[240px] shrink-0 text-right text-xs leading-snug text-white/35 md:block">
                      {n.desc}
                    </span>
                    <ArrowUpRight
                      size={22}
                      className="shrink-0 text-white/25 transition-all duration-300 group-hover:rotate-45 group-hover:text-blaze md:hidden"
                    />
                  </motion.button>
                </div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/5 px-6 py-6 text-sm text-white/50 md:px-16"
            >
              <a data-testid="menu-phone-link" href={CONTACTS.phoneHref} className="flex items-center gap-2 transition-colors duration-300 hover:text-blaze">
                <Phone size={15} className="text-blaze" /> {CONTACTS.phone}
              </a>
              <a data-testid="menu-whatsapp-link" href={`https://wa.me/${CONTACTS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors duration-300 hover:text-blaze">
                <MessageCircle size={15} className="text-blaze" /> WhatsApp
              </a>
              <a data-testid="menu-telegram-link" href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors duration-300 hover:text-blaze">
                <Send size={15} className="text-blaze" /> Telegram
              </a>
              <span className="text-white/30">{CONTACTS.hours}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
