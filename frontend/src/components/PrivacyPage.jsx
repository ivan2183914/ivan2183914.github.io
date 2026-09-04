import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CONTACTS } from "../data";

const SECTIONS = [
  {
    title: "1. Общие положения",
    text: "Настоящая политика конфиденциальности описывает, как Автомойка ААА (далее — «Оператор»), расположенная по адресу: Санкт-Петербург, Московский пр., 191А, обрабатывает персональные данные посетителей сайта. Используя сайт и отправляя заявку, вы выражаете согласие с настоящей политикой.",
  },
  {
    title: "2. Какие данные мы собираем",
    text: "Имя, номер телефона, марка и модель автомобиля, выбранная услуга, дата и время записи, а также текст комментария — только те данные, которые вы добровольно указываете в форме записи. Мы не запрашиваем и не храним данные банковских карт.",
  },
  {
    title: "3. Цели обработки",
    text: "Данные используются исключительно для связи с вами: подтверждение записи, уточнение деталей услуги, информирование о статусе заявки. Мы не продаём и не передаём данные третьим лицам для маркетинга.",
  },
  {
    title: "4. Cookies и Яндекс.Метрика",
    text: "Сайт использует технические cookies, необходимые для его работы, и сохраняет ваш выбор в баннере согласия. Счётчик Яндекс.Метрики (ООО «Яндекс») загружается только после вашего явного согласия в баннере. Метрика собирает обезличенную статистику посещений: страницы, время визита, источник перехода. Вы можете отклонить её — сайт будет работать полностью.",
  },
  {
    title: "5. Хранение и защита",
    text: "Заявки хранятся в защищённой базе данных с ограниченным доступом. Срок хранения — не более 3 лет с момента последнего обращения, после чего данные удаляются.",
  },
  {
    title: "6. Ваши права",
    text: "Вы вправе запросить уточнение, блокировку или удаление своих персональных данных, а также отозвать согласие на обработку. Для этого напишите нам на " + "moyka@aramarno.ru или позвоните по телефону " + CONTACTS.phone + ".",
  },
  {
    title: "7. Изменения политики",
    text: "Актуальная версия политики всегда доступна на этой странице. Продолжая пользоваться сайтом после изменений, вы принимаете новую редакцию.",
  },
];

export const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <Link
          data-testid="privacy-back-link"
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors duration-300 hover:text-blaze"
        >
          <ArrowLeft size={16} /> На главную
        </Link>

        <h1 className="mt-8 font-display text-3xl font-bold uppercase tracking-tight md:text-5xl">
          Политика <span className="text-blaze">конфиденциальности</span>
        </h1>
        <p className="mt-4 text-sm text-white/40">Обновлено: 29 августа 2026 г.</p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-lg font-semibold uppercase tracking-tight text-white">
                {s.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                {s.text}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-white/10 bg-[#121212] p-7">
          <h2 className="font-display text-lg font-semibold uppercase text-white">
            Контакты оператора
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Автомойка ААА · {CONTACTS.address}
            <br />
            Телефон: {CONTACTS.phone}
            <br />
            Email: {CONTACTS.email}
          </p>
        </div>
      </div>
    </div>
  );
};
