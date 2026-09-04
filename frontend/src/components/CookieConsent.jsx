import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

const KEY = "aaa_cookie_consent";

export const loadMetrica = () => {
  const id = process.env.REACT_APP_YM_ID;
  if (!id || window.__ymLoaded) return;
  window.__ymLoaded = true;
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  window.ym(Number(id), "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
};

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) {
      const t = setTimeout(() => setVisible(true), 2800);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (v) => {
    localStorage.setItem(KEY, v);
    setVisible(false);
    if (v === "accepted") loadMetrica();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="cookie-banner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 left-4 right-4 z-[70] md:left-8 md:right-auto md:max-w-md"
        >
          <div className="rounded-2xl border border-white/10 bg-[#121212]/95 p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blaze/15 text-blaze">
                <Cookie size={19} />
              </span>
              <div>
                <p className="text-sm leading-relaxed text-white/70">
                  Мы используем cookies и Яндекс.Метрику, чтобы сайт работал лучше.
                  Счётчик включается только после вашего согласия. Подробнее — в{" "}
                  <Link
                    data-testid="cookie-policy-link"
                    to="/privacy"
                    className="text-blaze transition-colors duration-300 hover:text-blaze-hover"
                  >
                    политике конфиденциальности
                  </Link>
                  .
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    data-testid="cookie-accept-btn"
                    onClick={() => decide("accepted")}
                    className="rounded-full bg-blaze px-5 py-2.5 text-sm font-bold text-[#050505] transition-colors duration-300 hover:bg-blaze-hover"
                  >
                    Принять
                  </button>
                  <button
                    data-testid="cookie-decline-btn"
                    onClick={() => decide("declined")}
                    className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/70 transition-colors duration-300 hover:border-white/40 hover:text-white"
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
