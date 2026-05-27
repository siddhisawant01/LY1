// Lightweight sound effects using the Web Audio API — no network, no assets.
let ctx: AudioContext | null = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = "sine", startAt = 0, gain = 0.2) {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + startAt;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const sfx = {
  pickup: () => tone(440, 0.08, "triangle"),
  correct: () => {
    tone(523.25, 0.12, "triangle", 0);     // C5
    tone(659.25, 0.12, "triangle", 0.1);   // E5
    tone(783.99, 0.18, "triangle", 0.2);   // G5
  },
  wrong: () => {
    tone(220, 0.15, "sawtooth", 0, 0.15);
    tone(160, 0.2, "sawtooth", 0.12, 0.15);
  },
  win: () => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => tone(n, 0.2, "triangle", i * 0.12, 0.25));
    tone(1318.51, 0.4, "triangle", 0.55, 0.25);
  },
};
