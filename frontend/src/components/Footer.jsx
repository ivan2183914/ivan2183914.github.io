import { Link } from "react-router-dom";
import { CONTACTS } from "../data";
import { scrollToId } from "../lib/scroll";

export const Footer = () => (
  <footer className="border-t border-white/5 bg-[#050505]">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <button
            data-testid="footer-logo-btn"
            onClick={() => scrollToId("top")}
            className="font-display text-2xl font-bold uppercase text-white"
          >
            ААА<span className="text-blaze">.</span>
          </button>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/40">
            Автомойка в Санкт-Петербурге. Без предоплаты — оплата только после того,
            как вы примете работу.
          </p>
        </div>
        <div className="text-sm text-white/50">
          <div className="text-xs uppercase tracking-[0.2em] text-white/30">Контакты</div>
          <a data-testid="footer-phone-link" href={CONTACTS.phoneHref} className="mt-3 block transition-colors duration-300 hover:text-blaze">
            {CONTACTS.phone}
          </a>
          <a data-testid="footer-email-link" href={`mailto:${CONTACTS.email}`} className="mt-2 block transition-colors duration-300 hover:text-blaze">
            {CONTACTS.email}
          </a>
          <span className="mt-2 block">{CONTACTS.address}</span>
        </div>
        <div className="text-sm text-white/50">
          <div className="text-xs uppercase tracking-[0.2em] text-white/30">Часы работы</div>
          <span className="mt-3 block">{CONTACTS.hours}</span>
          <a
            data-testid="footer-maps-link"
            href={CONTACTS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-blaze transition-colors duration-300 hover:text-blaze-hover"
          >
            Открыть в Google Maps
          </a>
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-2 border-t border-white/5 pb-24 pt-6 text-xs text-white/25 md:flex-row md:justify-between">
        <span>© 2026 Автомойка ААА, Санкт-Петербург</span>
        <div className="flex flex-col gap-2 md:flex-row md:gap-6">
          <Link
            data-testid="footer-privacy-link"
            to="/privacy"
            className="transition-colors duration-300 hover:text-blaze"
          >
            Политика конфиденциальности
          </Link>
          <span>Московский пр., 191А · ежедневно 9:00–21:00</span>
        </div>
      </div>
    </div>
  </footer>
);
