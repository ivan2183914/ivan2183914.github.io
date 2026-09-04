import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { initLenis, destroyLenis } from "@/lib/scroll";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Manifesto } from "@/components/Manifesto";
import { Calculator } from "@/components/Calculator";
import { Services } from "@/components/Services";
import { Promo } from "@/components/Promo";
import { Reviews } from "@/components/Reviews";
import { Contacts } from "@/components/Contacts";
import { Footer } from "@/components/Footer";
import { BottomPanel } from "@/components/BottomPanel";
import { CookieConsent, loadMetrica } from "@/components/CookieConsent";
import { PrivacyPage } from "@/components/PrivacyPage";
import { CarPass } from "@/components/CarPass";
import "@/lib/sound";

const Intro = () => (
  <motion.div
    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050505]"
  >
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-6xl font-bold uppercase tracking-tight text-blaze md:text-8xl"
      >
        ААА<span className="text-white">.</span>
      </motion.div>
    </div>
    <CarPass size="lg" delay={0.3} duration={1.5} className="absolute bottom-[14%] left-0" />
  </motion.div>
);

const CAR_IMAGE_SRC = "/car-cutout-alpha.png";
const INTRO_DURATION = 1950;
// Absolute ceiling on how long the intro can wait for the car image before
// giving up and closing anyway — protects against a fully offline/broken
// image request hanging the intro forever.
const INTRO_MAX_WAIT = 4000;

const Main = () => {
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    initLenis();
    if (localStorage.getItem("aaa_cookie_consent") === "accepted") loadMetrica();

    // The intro's car-pass animation only looks right once the image has
    // actually loaded — closing the intro before then is what caused
    // "машины не видно на заставке". We still close on the normal timer,
    // but if the (preloaded, ~180KB) image hasn't arrived yet by then, we
    // wait a bit longer for it rather than close on an empty frame.
    let settled = false;
    const closeIntro = () => {
      if (settled) return;
      settled = true;
      setIntro(false);
    };

    const img = new Image();
    img.src = CAR_IMAGE_SRC;
    const minTimer = setTimeout(() => {
      if (img.complete) {
        closeIntro();
      } else {
        img.addEventListener("load", closeIntro, { once: true });
        img.addEventListener("error", closeIntro, { once: true });
      }
    }, INTRO_DURATION);
    const maxTimer = setTimeout(closeIntro, INTRO_MAX_WAIT);

    return () => {
      destroyLenis();
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      img.removeEventListener("load", closeIntro);
      img.removeEventListener("error", closeIntro);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AnimatePresence>{intro && <Intro />}</AnimatePresence>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <Header />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Calculator />
        <Services />
        <Promo />
        <Reviews />
        <Contacts />
      </main>
      <Footer />
      <BottomPanel />
      <CookieConsent />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
      <Toaster theme="dark" position="top-center" />
    </BrowserRouter>
  );
}

export default App;
