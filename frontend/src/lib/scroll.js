import Lenis from "lenis";

let lenis = null;

export const initLenis = () => {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
};

export const destroyLenis = () => {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
};

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: -70 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
