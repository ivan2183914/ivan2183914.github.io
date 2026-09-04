import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Send, ShieldCheck, Search, Ban, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHead, easeExpo } from "./Reveal";
import { CONTACTS, BRANDS, PRICES, TIME_SLOTS } from "../data";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const inputCls =
  "w-full rounded-xl border border-white/15 bg-transparent px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-blaze";
const labelCls = "mb-3 block text-xs uppercase tracking-[0.2em] text-white/40";

const fmt = (n) => n.toLocaleString("ru-RU");
const ruDate = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("ru-RU");
};
const shortDate = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
};
const displayToIso = (v) => {
  const m = v.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
};
const slug = (s) => s.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-");

const INITIAL = { brand: "", year: "", pnevmo: "", axes: "", date: "", time: "" };

const stepMotion = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.4, ease: easeExpo },
};

const CHANNELS = [
  { id: "whatsapp", icon: MessageCircle, title: "WhatsApp", desc: "Готовое сообщение — останется нажать «отправить»" },
  { id: "telegram", icon: Send, title: "Telegram", desc: "Напишите нам — заявка уже сохранена" },
  { id: "call", icon: Phone, title: "Позвонить", desc: CONTACTS.phone },
];

export const Calculator = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(null);
  const [data, setData] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [booked, setBooked] = useState([]);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const brand = BRANDS.find((b) => b.name === data.brand);
  const blocked = brand?.group === "blocked";

  const steps = useMemo(() => {
    const s = ["brand"];
    if (brand?.group === "chinese") s.push("year");
    s.push("pnevmo", "axes", "datetime", "send");
    return s;
  }, [brand?.group]);
  const current = steps[stepIdx];

  const category =
    data.pnevmo === "yes" || (brand?.group === "chinese" && data.year === "2015+")
      ? "special"
      : "standard";
  const price = data.pnevmo && data.axes ? PRICES[category][data.axes] : null;
  const axesLabel = data.axes === "two" ? "две оси" : "одна ось";

  useEffect(() => {
    if (!data.date) {
      setBooked([]);
      return;
    }
    axios
      .get(`${API}/slots?date=${encodeURIComponent(data.date)}`)
      .then(({ data: d }) => setBooked(d.booked || []))
      .catch(() => setBooked([]));
  }, [data.date]);

  const slotDisabled = (t) => {
    if (booked.includes(t)) return true;
    if (data.date === ruDate(0)) {
      const n = new Date();
      const now = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
      return t <= now;
    }
    return false;
  };

  const next = () => {
    if (current === "brand" && (!data.brand || blocked)) return;
    if (current === "year" && !data.year) return toast.error("Выберите год выпуска");
    if (current === "pnevmo" && !data.pnevmo) return toast.error("Укажите тип подвески");
    if (current === "axes" && !data.axes) return toast.error("Выберите объём работ");
    if (current === "datetime" && (!data.date || !data.time))
      return toast.error("Выберите дату и время");
    setStepIdx((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStepIdx((s) => Math.max(s - 1, 0));

  const submit = async (channel) => {
    const extras = [
      data.pnevmo === "yes" ? "пневмоподвеска" : null,
      brand?.group === "chinese" ? (data.year === "2015+" ? "2015 и новее" : "старше 2015") : null,
    ]
      .filter(Boolean)
      .join(", ");
    const payload = {
      service: `Сход-развал (${axesLabel})`,
      car_brand: data.brand, car_model: extras, car_class: PRICES[category].label,
      date: data.date, time: data.time, price: `${fmt(price)} ₽`, comment: `канал: ${channel}`,
    };
    try {
      await axios.post(`${API}/bookings`, payload);
    } catch (e) {
      console.error(e);
    }
    const msg =
      `Здравствуйте! Заявка с сайта ААА.\n` +
      `Услуга: сход-развал — ${axesLabel}\n` +
      `Авто: ${data.brand}${extras ? ` (${extras})` : ""}\n` +
      `Тариф: ${PRICES[category].label}\n` +
      `Дата и время: ${data.date}, ${data.time}\n` +
      `Стоимость: ${fmt(price)} ₽`;
    if (channel === "whatsapp") {
      window.open(`https://wa.me/${CONTACTS.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    } else if (channel === "telegram") {
      window.open(CONTACTS.telegram, "_blank");
    } else {
      window.location.href = CONTACTS.phoneHref;
    }
    setDone(channel);
    toast.success("Заявка сохранена");
  };

  const reset = () => {
    setData(INITIAL);
    setStepIdx(0);
    setDone(null);
    setSearch("");
  };

  const chipCls = (active) =>
    `rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
      active
        ? "border-blaze bg-blaze text-[#050505]"
        : "border-white/15 text-white/70 hover:border-blaze/60 hover:text-white"
    }`;

  const OptionCard = ({ active, onClick, title, desc, testid }) => (
    <button
      data-testid={testid}
      onClick={onClick}
      className={`rounded-xl border p-5 text-left transition-colors duration-300 ${
        active ? "border-blaze bg-blaze/10" : "border-white/10 hover:border-blaze/50"
      }`}
    >
      <div className="font-semibold text-white">{title}</div>
      {desc && <div className="mt-1 text-xs text-white/45">{desc}</div>}
    </button>
  );

  const navButtons = (continueTestid = "calc-continue-btn") => (
    <div className="mt-9 flex flex-wrap gap-4">
      {stepIdx > 0 && (
        <button
          data-testid={`calc-back-btn-${current}`}
          onClick={back}
          className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-semibold text-white/70 transition-colors duration-300 hover:border-blaze hover:text-blaze"
        >
          <ArrowLeft size={16} /> Назад
        </button>
      )}
      <motion.button
        data-testid={continueTestid}
        onClick={next}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-3 rounded-full bg-blaze px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-[#050505] transition-colors duration-300 hover:bg-blaze-hover"
      >
        Продолжить <ArrowRight size={17} />
      </motion.button>
    </div>
  );

  const filteredBrands = BRANDS.filter((b) =>
    b.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const stepLabel = {
    brand: "Марка", year: "Год", pnevmo: "Подвеска",
    axes: "Объём", datetime: "Когда", send: "Отправка",
  }[current];

  const doneText = {
    whatsapp: "Мы открыли WhatsApp с готовым сообщением — останется нажать «отправить».",
    telegram: "Мы открыли Telegram — напишите нам, заявка уже сохранена.",
    call: `Позвоните нам: ${CONTACTS.phone} — заявка уже у нас, назовите удобное время.`,
  }[done];

  return (
    <section id="calculator" className="border-y border-white/5 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-24">
        <SectionHead
          index="02"
          label="Калькулятор"
          title="Точная цена"
          accent="за 30 секунд"
          className="max-w-3xl"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="min-w-0 rounded-2xl border border-white/5 bg-[#121212] p-6 md:p-10">
              <div className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-2">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-3">
                    <span
                      data-testid={`calc-step-dot-${i}`}
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-bold transition-colors duration-300 ${
                        done || stepIdx > i
                          ? "bg-blaze text-[#050505]"
                          : stepIdx === i
                            ? "border border-blaze text-blaze"
                            : "border border-white/15 text-white/35"
                      }`}
                    >
                      {done || stepIdx > i ? <Check size={14} /> : i + 1}
                    </span>
                    {i < steps.length - 1 && <span className="h-px w-5 bg-white/10 md:w-8" />}
                  </div>
                ))}
                <span data-testid="calc-step-label" className="ml-1 text-xs uppercase tracking-wider text-white/40">
                  {stepLabel}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: easeExpo }}
                    className="flex flex-col items-center py-8 text-center"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blaze">
                      <Check size={30} className="text-[#050505]" />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-bold uppercase text-white">
                      Заявка у нас
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
                      {doneText} Подтвердим запись в течение 10 минут.
                    </p>
                    <button
                      data-testid="calc-reset-btn"
                      onClick={reset}
                      className="mt-7 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-blaze hover:text-blaze"
                    >
                      Новая заявка
                    </button>
                  </motion.div>
                ) : current === "brand" ? (
                  <motion.div key="brand" {...stepMotion}>
                    <span className={labelCls}>Марка вашего автомобиля</span>
                    <div className="relative">
                      <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        data-testid="calc-brand-search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Начните вводить марку..."
                        className={`${inputCls} pl-11`}
                      />
                    </div>
                    <div
                      data-testid="calc-brand-panel"
                      className="mt-4 grid max-h-[320px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4"
                    >
                      {filteredBrands.map((b, i) => (
                        <motion.button
                          key={b.name}
                          data-testid={`calc-brand-tile-${slug(b.name)}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3) }}
                          onClick={() => set("brand", b.name)}
                          className={`flex min-w-0 items-center gap-2.5 rounded-xl border p-3 text-left transition-colors duration-300 ${
                            data.brand === b.name
                              ? "border-blaze bg-blaze/10"
                              : "border-white/10 hover:border-blaze/50"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-bold ${
                              data.brand === b.name ? "bg-blaze text-[#050505]" : "bg-white/5 text-white/50"
                            }`}
                          >
                            {b.name[0]}
                          </span>
                          <span className="min-w-0 truncate text-[13px] font-semibold leading-tight text-white/80 sm:text-sm">
                            {b.name}
                          </span>
                        </motion.button>
                      ))}
                      {filteredBrands.length === 0 && (
                        <p className="col-span-full py-6 text-center text-sm text-white/40">
                          Не нашли марку? Выберите «Другая марка» в полном списке
                        </p>
                      )}
                    </div>

                    <AnimatePresence>
                      {blocked && (
                        <motion.div
                          data-testid="calc-blocked-card"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          className="mt-5 rounded-2xl border border-blaze/40 bg-blaze/10 p-6"
                        >
                          <div className="flex items-center gap-3 text-blaze">
                            <Ban size={20} />
                            <span className="font-display text-sm font-bold uppercase">
                              К сожалению, не обслуживаем
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-white/60">
                            Мы не работаем с автомобилями ВАЗ, Нива и Волга. Если сомневаетесь
                            или у вас редкая модификация — позвоните: {CONTACTS.phone}.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {data.brand && !blocked && navButtons()}
                  </motion.div>
                ) : current === "year" ? (
                  <motion.div key="year" {...stepMotion}>
                    <span className={labelCls}>Год выпуска — {data.brand}</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <OptionCard
                        testid="calc-year-2015plus-btn"
                        active={data.year === "2015+"}
                        onClick={() => set("year", "2015+")}
                        title="2015 и новее"
                        desc="Тариф для китайских авто от 2015 года"
                      />
                      <OptionCard
                        testid="calc-year-older-btn"
                        active={data.year === "older"}
                        onClick={() => set("year", "older")}
                        title="Старше 2015"
                        desc="Обычный легковой тариф"
                      />
                    </div>
                    {navButtons()}
                  </motion.div>
                ) : current === "pnevmo" ? (
                  <motion.div key="pnevmo" {...stepMotion}>
                    <span className={labelCls}>Есть ли пневмоподвеска?</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <OptionCard
                        testid="calc-pnevmo-no-btn"
                        active={data.pnevmo === "no"}
                        onClick={() => set("pnevmo", "no")}
                        title="Нет, обычная"
                        desc="Стандартная подвеска"
                      />
                      <OptionCard
                        testid="calc-pnevmo-yes-btn"
                        active={data.pnevmo === "yes"}
                        onClick={() => set("pnevmo", "yes")}
                        title="Да, пневмоподвеска"
                        desc="Отдельный тариф — требует особой точности"
                      />
                    </div>
                    {navButtons()}
                  </motion.div>
                ) : current === "axes" ? (
                  <motion.div key="axes" {...stepMotion}>
                    <span className={labelCls}>Объём работ</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        data-testid="calc-axes-one-btn"
                        onClick={() => set("axes", "one")}
                        className={`rounded-xl border p-6 text-left transition-colors duration-300 ${
                          data.axes === "one" ? "border-blaze bg-blaze/10" : "border-white/10 hover:border-blaze/50"
                        }`}
                      >
                        <div className="font-display text-3xl font-bold text-blaze">
                          {fmt(PRICES[category].one)} ₽
                        </div>
                        <div className="mt-2 font-semibold text-white">Одна ось</div>
                        <div className="mt-1 text-xs text-white/45">
                          Регулировка только передней или задней оси
                        </div>
                      </button>
                      <button
                        data-testid="calc-axes-two-btn"
                        onClick={() => set("axes", "two")}
                        className={`rounded-xl border p-6 text-left transition-colors duration-300 ${
                          data.axes === "two" ? "border-blaze bg-blaze/10" : "border-white/10 hover:border-blaze/50"
                        }`}
                      >
                        <div className="font-display text-3xl font-bold text-blaze">
                          {fmt(PRICES[category].two)} ₽
                        </div>
                        <div className="mt-2 font-semibold text-white">Обе оси</div>
                        <div className="mt-1 text-xs text-white/45">
                          Полная регулировка + распечатка до и после
                        </div>
                      </button>
                    </div>
                    {navButtons()}
                  </motion.div>
                ) : current === "datetime" ? (
                  <motion.div key="datetime" {...stepMotion}>
                    <span className={labelCls}>Дата</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        data-testid="calc-date-today-btn"
                        onClick={() => set("date", ruDate(0))}
                        className={chipCls(data.date === ruDate(0))}
                      >
                        Сегодня · {shortDate(0)}
                      </button>
                      <button
                        data-testid="calc-date-tomorrow-btn"
                        onClick={() => set("date", ruDate(1))}
                        className={chipCls(data.date === ruDate(1))}
                      >
                        Завтра · {shortDate(1)}
                      </button>
                      <input
                        data-testid="calc-date-input"
                        type="date"
                        min={new Date().toISOString().slice(0, 10)}
                        value={displayToIso(data.date)}
                        onChange={(e) => {
                          const v = e.target.value;
                          set("date", v ? v.split("-").reverse().join(".") : "");
                        }}
                        className="rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-sm text-white outline-none [color-scheme:dark] transition-colors duration-300 focus:border-blaze"
                      />
                    </div>

                    <span className={`${labelCls} mt-8`}>Свободное время</span>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          data-testid={`calc-slot-${t.replace(":", "")}`}
                          onClick={() => set("time", t)}
                          disabled={slotDisabled(t)}
                          className={`rounded-lg border py-2.5 text-sm font-semibold transition-colors duration-300 ${
                            data.time === t
                              ? "border-blaze bg-blaze text-[#050505]"
                              : "border-white/10 text-white/60 hover:border-blaze/60 hover:text-white"
                          } disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/20 disabled:line-through`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-white/35">
                      Зачёркнутые слоты уже заняты или прошли
                    </p>
                    {navButtons("calc-continue-btn-2")}
                  </motion.div>
                ) : (
                  <motion.div key="send" {...stepMotion}>
                    <span className={labelCls}>Куда отправить заявку?</span>
                    <div className="flex flex-col gap-3">
                      {CHANNELS.map((c) => (
                        <motion.button
                          key={c.id}
                          data-testid={`calc-send-${c.id}-btn`}
                          onClick={() => submit(c.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="group flex items-center gap-4 rounded-xl border border-white/10 p-5 text-left transition-colors duration-300 hover:border-blaze/60"
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blaze/15 text-blaze transition-colors duration-300 group-hover:bg-blaze group-hover:text-[#050505]">
                            <c.icon size={21} />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-semibold text-white">{c.title}</span>
                            <span className="block truncate text-xs text-white/45">{c.desc}</span>
                          </span>
                          <ArrowRight size={18} className="ml-auto shrink-0 text-white/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blaze" />
                        </motion.button>
                      ))}
                    </div>
                    <div className="mt-8">
                      <button
                        data-testid="calc-back-btn-send"
                        onClick={back}
                        className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-semibold text-white/70 transition-colors duration-300 hover:border-blaze hover:text-blaze"
                      >
                        <ArrowLeft size={16} /> Назад
                      </button>
                    </div>
                    <p className="mt-5 text-xs leading-relaxed text-white/30">
                      Заявка сохраняется у нас в любом случае. Выбирая канал, вы соглашаетесь с{" "}
                      <a href="/privacy" className="text-blaze hover:text-blaze-hover">
                        политикой конфиденциальности
                      </a>
                      . Без предоплаты: оплата только после работы.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="min-w-0 rounded-2xl border border-white/5 bg-gradient-to-br from-[#1A1A1A] to-[#0d0d0d] p-6 md:p-8 lg:sticky lg:top-28">
              <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                Ваша запись
              </span>
              <div data-testid="calc-price" className="mt-4 break-words font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {blocked ? "— ₽" : price ? `${fmt(price)} ₽` : "— ₽"}
              </div>
              <div className="mt-2 text-xs text-white/40">
                {blocked ? "эта марка не обслуживается" : "финальная стоимость — без скрытых доплат"}
              </div>
              <ul className="mt-7 space-y-3 text-sm text-white/65">
                <li className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <span className="text-white/40">Марка</span>
                  <span data-testid="summary-brand" className="min-w-0 text-right text-white">
                    {data.brand || "не выбрана"}
                  </span>
                </li>
                <li className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <span className="text-white/40">Тариф</span>
                  <span className="min-w-0 text-right text-white">
                    {data.pnevmo && !blocked ? PRICES[category].label : "—"}
                  </span>
                </li>
                <li className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <span className="text-white/40">Объём</span>
                  <span data-testid="summary-axes" className="min-w-0 text-right text-white">
                    {data.axes ? axesLabel : "—"}
                  </span>
                </li>
                <li className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <span className="text-white/40">Когда</span>
                  <span data-testid="summary-datetime" className="min-w-0 text-right text-white">
                    {data.date && data.time ? `${data.date}, ${data.time}` : "не выбрано"}
                  </span>
                </li>
              </ul>
              <div className="mt-7 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-white/45">
                <ShieldCheck size={15} className="shrink-0 text-blaze" />
                Без предоплаты — платите только после того, как примете работу
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
