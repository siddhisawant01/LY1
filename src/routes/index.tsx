import { createFileRoute, Link } from "@tanstack/react-router";
import { SplashScreen } from "@/components/SplashScreen";
import { ShareDialog } from "@/components/ShareDialog";
import { Sun, Moon, Sparkles } from "lucide-react";
import logo from "@/assets/logo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kids Learning Games | Innovine Solutions" },
      { name: "description", content: "Fun drag & drop and matching games for kids by Innovine Solutions." },
      { property: "og:title", content: "Kids Learning Games" },
      { property: "og:description", content: "Fun drag & drop and matching games for kids." },
    ],
  }),
  component: Index,
});

function GameCard({ to, title, desc, icon, gradient }: { to: string; title: string; desc: string; icon: React.ReactNode; gradient: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-lg transition-transform hover:-translate-y-1 ${gradient}`}>
      <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
        <ShareDialog path={to} />
      </div>
      <Link to={to} className="block">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-2xl font-extrabold mb-1">{title}</h3>
        <p className="text-sm opacity-80">{desc}</p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-foreground shadow">
          Play now →
        </div>
      </Link>
    </div>
  );
}

function Index() {
  return (
    <SplashScreen>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <header className="flex items-center justify-between px-4 md:px-8 py-4">
          <img src={logo} alt="Innovine Solutions" className="h-12 md:h-14" />
          <ShareDialog path="/" />
        </header>

        <main className="px-4 md:px-8 pb-16 max-w-5xl mx-auto">
          <section className="text-center py-8 md:py-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/30 px-4 py-1 text-sm font-semibold text-foreground mb-4">
              <Sparkles className="w-4 h-4" /> Fun Learning for Kids
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-navy leading-tight">
              Play & Learn <span className="text-primary">Together!</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Simple, colourful games that help little ones learn while having fun. No login, just tap and play.
            </p>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <GameCard
              to="/day-night"
              title="Day or Night?"
              desc="Drag each picture into the right side — Day or Night."
              icon={<div className="flex gap-2"><Sun className="w-12 h-12 text-day-foreground" /><Moon className="w-12 h-12 text-night" /></div>}
              gradient="bg-gradient-to-br from-day to-accent text-day-foreground"
            />
            <GameCard
              to="/match-letters"
              title="Match the Letters"
              desc="Tap the matching uppercase and lowercase letters."
              icon={<div className="text-5xl font-extrabold">Aa Bb</div>}
              gradient="bg-gradient-to-br from-primary/90 to-accent text-primary-foreground"
            />
          </section>

          <p className="text-center text-xs text-muted-foreground mt-12">
            More games coming soon ✨ Built by Innovine Solutions
          </p>
        </main>
      </div>
    </SplashScreen>
  );
}
