import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { ShareDialog } from "@/components/ShareDialog";
import { ArrowLeft, RefreshCw, Sun, Moon, PartyPopper } from "lucide-react";
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

function DayNightGame() {
  const [placed, setPlaced] = useState<Record<string, "day" | "night">>({});
  const [wrong, setWrong] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const remaining = ITEMS.filter((i) => !placed[i.id]);
  const done = remaining.length === 0;

  const handleDrop = (cat: "day" | "night", id: string) => {
    const item = ITEMS.find((i) => i.id === id);
    if (!item) return;
    if (item.category === cat) {
      setPlaced((p) => ({ ...p, [id]: cat }));
    } else {
      setWrong(id);
      setTimeout(() => setWrong(null), 600);
    }
  };

  const reset = () => setPlaced({});

  return (
    <SplashScreen duration={1500}>
      <div className="min-h-screen bg-gradient-to-b from-day/40 via-background to-night/30">
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
              cat="day"
              title="Day"
              icon={<Sun className="w-8 h-8" />}
              className="bg-day text-day-foreground"
              onDrop={handleDrop}
              items={ITEMS.filter((i) => placed[i.id] === "day")}
              isDragging={!!dragging}
            />
            <DropZone
              cat="night"
              title="Night"
              icon={<Moon className="w-8 h-8" />}
              className="bg-night text-night-foreground"
              onDrop={handleDrop}
              items={ITEMS.filter((i) => placed[i.id] === "night")}
              isDragging={!!dragging}
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
                {remaining.map((item) => (
                  <button
                    key={item.id}
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData("text/plain", item.id); setDragging(item.id); }}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => setDragging(item.id)}
                    className={`flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-dashed cursor-grab active:cursor-grabbing transition-transform hover:scale-110 ${dragging === item.id ? "bg-accent/40 border-primary scale-110" : "bg-secondary border-border"} ${wrong === item.id ? "animate-pulse border-destructive" : ""}`}
                  >
                    <span className="text-4xl md:text-5xl">{item.emoji}</span>
                    <span className="text-[10px] font-bold text-muted-foreground mt-1">{item.label}</span>
                  </button>
                ))}
              </div>
              {/* Tap-to-place fallback (works on mobile too) */}
              {dragging && (
                <div className="mt-4 flex justify-center gap-3">
                  <Button onClick={() => { handleDrop("day", dragging); setDragging(null); }} className="bg-day text-day-foreground hover:bg-day/80">→ Day</Button>
                  <Button onClick={() => { handleDrop("night", dragging); setDragging(null); }} className="bg-night text-night-foreground hover:bg-night/80">→ Night</Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </SplashScreen>
  );
}

function DropZone({ cat, title, icon, className, onDrop, items, isDragging }: {
  cat: "day" | "night"; title: string; icon: React.ReactNode; className: string;
  onDrop: (cat: "day" | "night", id: string) => void; items: Item[]; isDragging: string | null | boolean;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const id = e.dataTransfer.getData("text/plain");
        if (id) onDrop(cat, id);
      }}
      className={`rounded-3xl p-4 md:p-6 min-h-[220px] md:min-h-[280px] shadow-lg transition-all ${className} ${over || isDragging ? "ring-4 ring-primary/40 scale-[1.02]" : ""}`}
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
