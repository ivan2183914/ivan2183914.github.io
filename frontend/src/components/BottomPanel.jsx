import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Phone, MessageCircle, Send, Home, Star, MapPin, Wrench } from "lucide-react";
import { CONTACTS } from "../data";
import { scrollToId } from "../lib/scroll";

const OPTIONS = [
  { id: "call", icon: Phone, label: "Позвонить", href: CONTACTS.phoneHref, accent: true },
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${CONTACTS.whatsapp}` },
  { id: "telegram", icon: Send, label: "Telegram", href: CONTACTS.telegram },
];

export const BottomPanel = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="messenger-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[55]"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 left-4 z-[60]">
        <motion.button
          data-testid="panel-calculator-btn"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 2.6, type: "spring", stiffness: 260, damping: 16 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => scrollToId("calculator")}
          aria-label="Калькулятор"
          className="animate-pulse-glow flex h-14 w-14 items-center justify-center rounded-full bg-blaze text-[#050505]"
        >
          <Calculator size={22} />
        </motion.button>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center">
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ delay: 2.75, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-[#0d0d0d]/90 p-1.5 backdrop-blur-md"
        >
          {[
            { id: "top", icon: Home, label: "Главная", testid: "navpill-home-btn" },
            { id: "services", icon: Wrench, label: "Направления", testid: "navpill-services-btn" },
            { id: "reviews", icon: Star, label: "Отзывы", testid: "navpill-reviews-btn" },
            { id: "contacts", icon: MapPin, label: "Контакты", testid: "navpill-contacts-btn" },
          ].map((item) => (
            <button
              key={item.id}
              data-testid={item.testid}
              onClick={() => scrollToId(item.id)}
              aria-label={item.label}
              title={item.label}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-all duration-300 hover:bg-blaze/15 hover:text-blaze"
            >
              <item.icon size={17} />
            </button>
          ))}
        </motion.div>
      </div>

      <div className="fixed bottom-5 right-4 z-[60]">
        <AnimatePresence>
          {open && (
            <motion.div
              data-testid="messenger-popover"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-full right-0 mb-4 flex flex-col items-end gap-3"
            >
              {OPTIONS.map((o, i) => (
                <motion.a
                  key={o.id}
                  data-testid={`messenger-${o.id}`}
                  href={o.href}
                  target={o.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 14, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center gap-3"
                >
                  <span className="rounded-full border border-white/10 bg-[#121212]/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/70 backdrop-blur-md">
                    {o.label}
                  </span>
                  <span
                    className={`flex items-center justify-center rounded-full border backdrop-blur-md transition-transform duration-300 group-hover:scale-110 ${
                      o.accent
                        ? "border-blaze bg-blaze text-[#050505]"
                        : "border-white/15 bg-[#121212]/95 text-blaze"
                    }`}
                    style={{ width: 52, height: 52 }}
                  >
                    <o.icon size={21} />
                  </span>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          data-testid="panel-call-btn"
          initial={{ scale: 0, rotate: 30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 2.6, type: "spring", stiffness: 260, damping: 16 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen(!open)}
          aria-label="Связаться"
          className={`animate-ring flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 ${
            open ? "border-blaze bg-blaze/15 text-blaze" : "border-white/15 bg-[#0d0d0d]/90 text-white"
          }`}
        >
          <Phone size={22} className="text-blaze" />
        </motion.button>
      </div>
    </>
  );
};
