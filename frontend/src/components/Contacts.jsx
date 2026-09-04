import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";
import { CONTACTS } from "../data";

export const Contacts = () => (
  <section id="contacts" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-24">
    <SectionHead
      index="05"
      label="Контакты"
      title="Приезжайте —"
      accent="мы рядом"
      className="max-w-3xl"
    />

    <div className="mt-14 grid gap-10 lg:grid-cols-2">
      <Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          <a
            data-testid="contacts-phone-link"
            href={CONTACTS.phoneHref}
            className="group rounded-2xl border border-white/5 bg-[#121212] p-6 transition-colors duration-300 hover:border-blaze/50"
          >
            <Phone size={20} className="text-blaze" />
            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">Телефон</div>
            <div className="mt-1 font-semibold text-white transition-colors duration-300 group-hover:text-blaze">
              {CONTACTS.phone}
            </div>
          </a>
          <a
            data-testid="contacts-whatsapp-link"
            href={`https://wa.me/${CONTACTS.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/5 bg-[#121212] p-6 transition-colors duration-300 hover:border-blaze/50"
          >
            <MessageCircle size={20} className="text-blaze" />
            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">WhatsApp</div>
            <div className="mt-1 font-semibold text-white transition-colors duration-300 group-hover:text-blaze">
              Написать нам
            </div>
          </a>
          <a
            data-testid="contacts-email-link"
            href={`mailto:${CONTACTS.email}`}
            className="group rounded-2xl border border-white/5 bg-[#121212] p-6 transition-colors duration-300 hover:border-blaze/50"
          >
            <Mail size={20} className="text-blaze" />
            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">Email</div>
            <div className="mt-1 font-semibold text-white transition-colors duration-300 group-hover:text-blaze">
              {CONTACTS.email}
            </div>
          </a>
          <div className="rounded-2xl border border-white/5 bg-[#121212] p-6">
            <Clock size={20} className="text-blaze" />
            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">Часы работы</div>
            <div className="mt-1 font-semibold text-white">{CONTACTS.hours}</div>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 text-white/60">
          <MapPin size={18} className="mt-0.5 shrink-0 text-blaze" />
          <p className="text-sm leading-relaxed">
            {CONTACTS.address}
            <span className="block text-white/35">Московский район, рядом с метро Московская</span>
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div data-testid="contacts-map" className="min-h-[320px] overflow-hidden rounded-2xl border border-white/10 lg:h-full">
          <iframe
            title="Автомойка ААА на карте"
            src="https://www.google.com/maps?q=%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%20191%D0%90%2C%20%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3&output=embed"
            className="h-full min-h-[320px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
    </div>
  </section>
);
