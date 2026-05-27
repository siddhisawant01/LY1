import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { ShareDialog } from "@/components/ShareDialog";
import { ArrowLeft, RefreshCw, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/match-letters")({
  head: () => ({
    meta: [
      { title: "Match the Letters | Innovine Solutions" },
      { name: "description", content: "Match uppercase to lowercase letters in this fun game." },
    ],
  }),
  component: MatchGame,
});

const LETTERS = ["A", "B", "C", "D", "E"];
const EMOJI: Record<string, string> = { A: "🍎", B: "🦋", C: "🐱", D: "🐶", E: "🐘" };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function MatchGame() {
  const [seed, setSeed] = useState(0);
  const lower = useMemo(() => shuffle(LETTERS.map((l) => l.toLowerCase())), [seed]);
  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  const handleLower = (l: string) => {
    if (!selectedUpper) return;
    if (selectedUpper.toLowerCase() === l) {
      setMatched((m) => new Set(m).add(selectedUpper));
      setSelectedUpper(null);
    } else {
      setWrongPair(l);
      setTimeout(() => { setWrongPair(null); setSelectedUpper(null); }, 500);
    }
  };

  const done = matched.size === LETTERS.length;
  const reset = () => { setMatched(new Set()); setSelectedUpper(null); setSeed((s) => s + 1); };

  return (
    <SplashScreen duration={1500}>
      <div className="min-h-screen bg-gradient-to-b from-accent/20 via-background to-primary/10">
        <header className="flex items-center justify-between px-4 md:px-8 py-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/"><ArrowLeft className="w-4 h-4" /> Home</Link>
          </Button>
          <h1 className="text-xl md:text-2xl font-extrabold text-brand-navy">Match the Letters</h1>
          <div className="flex gap-2">
            <Button onClick={reset} variant="ghost" size="sm"><RefreshCw className="w-4 h-4" /></Button>
            <ShareDialog path="/match-letters" />
          </div>
        </header>

        <main className="px-4 md:px-8 pb-8 max-w-3xl mx-auto">
          <p className="text-center text-muted-foreground mb-6">Tap an uppercase letter, then tap its lowercase match.</p>

          {done ? (
            <div className="rounded-3xl bg-card p-8 text-center shadow-lg animate-pop-in">
              <PartyPopper className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-extrabold">Amazing! 🎉</h2>
              <p className="text-muted-foreground mb-4">You matched all the letters!</p>
              <Button onClick={reset} className="rounded-full">Play again</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:gap-10">
              <div className="space-y-3">
                <h2 className="text-center font-bold text-sm uppercase tracking-wide text-muted-foreground bg-secondary rounded-full py-1">Uppercase</h2>
                {LETTERS.map((l) => {
                  const isMatched = matched.has(l);
                  const isSelected = selectedUpper === l;
                  return (
                    <button
                      key={l}
                      disabled={isMatched}
                      onClick={() => setSelectedUpper(l)}
                      className={`flex w-full items-center gap-3 rounded-full border-2 border-dashed p-2 md:p-3 transition-all ${
                        isMatched ? "border-primary bg-primary/10 opacity-60" :
                        isSelected ? "border-primary bg-accent/30 scale-105" :
                        "border-border bg-card hover:border-primary"
                      }`}
                    >
                      <span className="text-3xl">{EMOJI[l]}</span>
                      <span className="text-4xl md:text-5xl font-extrabold flex-1 text-center">{l}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <h2 className="text-center font-bold text-sm uppercase tracking-wide text-muted-foreground bg-secondary rounded-full py-1">Lowercase</h2>
                {lower.map((l) => {
                  const upper = l.toUpperCase();
                  const isMatched = matched.has(upper);
                  const isWrong = wrongPair === l;
                  return (
                    <button
                      key={l}
                      disabled={isMatched}
                      onClick={() => handleLower(l)}
                      className={`flex w-full items-center gap-3 rounded-full border-2 border-dashed p-2 md:p-3 transition-all ${
                        isMatched ? "border-primary bg-primary/10 opacity-60" :
                        isWrong ? "border-destructive bg-destructive/10 animate-pulse" :
                        "border-border bg-card hover:border-primary"
                      }`}
                    >
                      <span className="text-4xl md:text-5xl font-extrabold flex-1 text-center">{l}</span>
                      <span className="text-3xl">{EMOJI[upper]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </SplashScreen>
  );
}
