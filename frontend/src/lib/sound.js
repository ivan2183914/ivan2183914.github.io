let played = false;

export const playEngineSound = async () => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    if (ctx.state === "suspended") await ctx.resume();
    if (ctx.state !== "running") return false;

    const t = ctx.currentTime;
    const dur = 1.4;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(0.22, t + 0.12);
    master.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    master.connect(ctx.destination);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(300, t);
    lp.frequency.exponentialRampToValueAtTime(2600, t + dur * 0.7);
    lp.connect(master);

    [1, 0.5, 1.5].forEach((mult) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(55 * mult, t);
      osc.frequency.exponentialRampToValueAtTime(230 * mult, t + dur * 0.75);
      osc.connect(lp);
      osc.start(t);
      osc.stop(t + dur);
    });

    const noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
    noise.buffer = buf;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    noise.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(t);

    return true;
  } catch (e) {
    return false;
  }
};

if (typeof window !== "undefined") {
  const tryPlay = () => {
    if (played) return;
    playEngineSound().then((ok) => {
      played = ok;
    });
  };
  setTimeout(tryPlay, 400);
  ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, tryPlay, { once: true })
  );
}
