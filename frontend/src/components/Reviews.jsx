import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";
import { AutoScrollRow } from "./Carousel";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Reviews = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    axios
      .get(`${API}/reviews?page=1&limit=24`)
      .then(({ data }) => {
        if (alive) setItems(data.items);
      })
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="reviews" className="overflow-hidden py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 px-4 sm:px-6 md:px-8">
        <SectionHead
          index="04"
          label="Отзывы"
          title="Нас проверили"
          accent="тысячи водителей"
          className="max-w-2xl"
        />
        <Reveal delay={0.15}>
          <div
            data-testid="reviews-summary-badge"
            className="rounded-2xl border border-blaze/40 bg-blaze/10 px-6 py-4"
          >
            <div className="flex items-center gap-2">
              <Star size={18} className="fill-blaze text-blaze" />
              <span className="font-display text-2xl font-bold text-white">4.7</span>
            </div>
            <div className="mt-1 text-xs text-white/50">1200+ отзывов · Google, 2ГИС, Yell</div>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-12">
        <AutoScrollRow testid="reviews-carousel" speed={0.5}>
          {items.map((r) => (
            <figure
              key={r.id}
              className="flex h-[240px] min-w-[300px] max-w-[300px] flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#121212] p-7 transition-colors duration-300 hover:border-blaze/50 md:h-[260px] md:min-w-[380px] md:max-w-[380px]"
            >
              <div className="min-h-0 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        size={13}
                        className={s < r.rating ? "fill-blaze text-blaze" : "text-white/15"}
                      />
                    ))}
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-white/45">
                    {r.source}
                  </span>
                </div>
                <blockquote className="mt-5 line-clamp-4 overflow-hidden text-sm leading-relaxed text-white/75 md:line-clamp-5 md:text-base">
                  {r.text}
                </blockquote>
              </div>
              <figcaption className="mt-6 flex shrink-0 items-center justify-between gap-3 text-xs uppercase tracking-[0.15em] text-white/40">
                <span className="truncate">{r.author}</span>
                <span className="shrink-0">{r.date}</span>
              </figcaption>
            </figure>
          ))}
        </AutoScrollRow>
      </Reveal>
    </section>
  );
};
