import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { ShareDialog } from "@/components/ShareDialog";
import { ArrowLeft, RefreshCw, Sun, Moon, PartyPopper, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/day-night")({
  head: () => ({
    meta: [
      { title: "Day or Night Game | Innovine Solutions" },
      { name: "description", content: "Drag and drop pictures into Day or Night categories." },
    ],
  }),
  component: DayNightGame,
});

type Item = { id: string; emoji: string; label: string; category: "day" | "night" };

const ITEMS: Item[] = [
  { id: "sun", emoji: "☀️", label: "Sun", category: "day" },
  { id: "rooster", emoji: "🐓", label: "Rooster", category: "day" },
  { id: "rainbow", emoji: "🌈", label: "Rainbow", category: "day" },
  { id: "cloud", emoji: "☁️", label: "Cloud", category: "day" },
  { id: "moon", emoji: "🌙", label: "Moon", category: "night" },
  { id: "owl", emoji: "🦉", label: "Owl", category: "night" },
  { id: "bat", emoji: "🦇", label: "Bat", category: "night" },
  { id: "bed", emoji: "🛏️", label: "Bed", category: "night" },
];

type Feedback = { id: string; kind: "right" | "wrong" } | null;

function DayNightGame() {
  const [placed, setPlaced] = useState<Record<string, "day" | "night">>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number; emoji: string } | null>(null);
  const dayRef = useRef<HTMLDivElement>(null);
  const nightRef = useRef<HTMLDivElement>(null);

  const remaining = ITEMS.filter((i) => !placed[i.id]);
  const done = remaining.length === 0;

  const tryPlace = (cat: "day" | "night", id: string) => {
    const item = ITEMS.find((i) => i.id === id);
    if (!item) return;
    if (item.category === cat) {
      setPlaced((p) => ({ ...p, [id]: cat }));
      setFeedback({ id, kind: "right" });
    } else {
      setFeedback({ id, kind: "wrong" });
    }
    setTimeout(() => setFeedback(null), 700);
  };

  const hitTest = (x: number, y: number): "day" | "night" | null => {
    const inside = (ref: React.RefObject<HTMLDivElement | null>) => {
      const r = ref.current?.getBoundingClientRect();
      return r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    if (inside(dayRef)) return "day";
    if (inside(nightRef)) return "night";
    return null;
  };

  // Unified pointer drag (works on touch + mouse, no native HTML5 DnD quirks on mobile)
  const onPointerDown = (e: React.PointerEvent, item: Item) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragId(item.id);
    setGhost({ x: e.clientX, y: e.clientY, emoji: item.emoji });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragId) return;
    setGhost((g) => (g ? { ...g, x: e.clientX, y: e.clientY } : g));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragId) return;
    const cat = hitTest(e.clientX, e.clientY);
    if (cat) tryPlace(cat, dragId);
    setDragId(null);
    setGhost(null);
  };

  const reset = () => setPlaced({});

  return (
    <SplashScreen duration={1500}>
      <div className="min-h-screen bg-gradient-to-b from-day/40 via-background to-night/30 select-none">
        <header className="flex items-center justify-between px-4 md:px-8 py-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/"><ArrowLeft className="w-4 h-4" /> Home</Link>
          </Button>
          <h1 className="text-xl md:text-2xl font-extrabold text-brand-navy">Day or Night?</h1>
          <div className="flex gap-2">
            <Button onClick={reset} variant="ghost" size="sm" className="gap-2"><RefreshCw className="w-4 h-4" /></Button>
            <ShareDialog path="/day-night" />
          </div>
        </header>

        <main className="px-4 md:px-8 pb-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-3 md:gap-6 mb-6">
            <DropZone
              innerRef={dayRef}
              title="Day"
              icon={<Sun className="w-8 h-8" />}
              className="bg-day text-day-foreground"
              items={ITEMS.filter((i) => placed[i.id] === "day")}
              active={!!dragId}
            />
            <DropZone
              innerRef={nightRef}
              title="Night"
              icon={<Moon className="w-8 h-8" />}
              className="bg-night text-night-foreground"
              items={ITEMS.filter((i) => placed[i.id] === "night")}
              active={!!dragId}
            />
          </div>

          {done ? (
            <div className="rounded-3xl bg-card p-8 text-center shadow-lg animate-pop-in">
              <PartyPopper className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-extrabold">Great job! 🎉</h2>
              <p className="text-muted-foreground mb-4">You sorted everything correctly!</p>
              <Button onClick={reset} className="rounded-full">Play again</Button>
            </div>
          ) : (
            <div className="rounded-3xl bg-card p-4 md:p-6 shadow-md">
              <p className="text-center text-sm text-muted-foreground mb-3">Drag each picture to the right side</p>
              <div className="flex flex-wrap justify-center gap-3">
                {remaining.map((item) => {
                  const fb = feedback?.id === item.id ? feedback.kind : null;
                  return (
                    <div
                      key={item.id}
                      onPointerDown={(e) => onPointerDown(e, item)}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerUp}
                      style={{ touchAction: "none" }}
                      className={`relative flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-dashed cursor-grab active:cursor-grabbing transition-all ${
                        dragId === item.id ? "opacity-30" : "bg-secondary border-border hover:scale-110"
                      } ${fb === "right" ? "border-green-500 bg-green-100" : ""} ${fb === "wrong" ? "border-red-500 bg-red-100 animate-pulse" : ""}`}
                    >
                      <span className="text-4xl md:text-5xl pointer-events-none">{item.emoji}</span>
                      <span className="text-[10px] font-bold text-muted-foreground mt-1 pointer-events-none">{item.label}</span>
                      {fb === "right" && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow animate-pop-in"><Check className="w-4 h-4" /></span>
                      )}
                      {fb === "wrong" && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow animate-pop-in"><X className="w-4 h-4" /></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        {ghost && (
          <div
            className="pointer-events-none fixed z-50 text-5xl md:text-6xl drop-shadow-lg"
            style={{ left: ghost.x, top: ghost.y, transform: "translate(-50%, -50%) scale(1.2)" }}
          >
            {ghost.emoji}
          </div>
        )}
      </div>
    </SplashScreen>
  );
}

function DropZone({ innerRef, title, icon, className, items, active }: {
  innerRef: React.RefObject<HTMLDivElement | null>;
  title: string; icon: React.ReactNode; className: string; items: Item[]; active: boolean;
}) {
  return (
    <div
      ref={innerRef}
      className={`rounded-3xl p-4 md:p-6 min-h-[220px] md:min-h-[280px] shadow-lg transition-all ${className} ${active ? "ring-4 ring-primary/50 scale-[1.02]" : ""}`}
    >
      <div className="flex items-center gap-2 font-extrabold text-2xl mb-3">{icon} {title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <span key={it.id} className="text-4xl md:text-5xl animate-pop-in bg-white/30 rounded-xl p-2">{it.emoji}</span>
        ))}
      </div>
    </div>
  );
}
