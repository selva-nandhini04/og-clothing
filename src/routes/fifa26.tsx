import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin, Clock, Star, ShoppingBag } from "lucide-react";
import { enterLottery } from "@/lib/queries";
import { useCart } from "@/contexts/cart";
import collectionFootball from "@/assets/collection-football.jpg";
import productJersey from "@/assets/product-jersey.jpg";
import productHoodie from "@/assets/product-hoodie.jpg";
import lookbookSkate from "@/assets/lookbook-skate.jpg";

export const Route = createFileRoute("/fifa26")({
  head: () => ({
    meta: [
      { title: "FIFA'26 Capsule — OG CLOTHING" },
      { name: "description", content: "OG Clothing FIFA World Cup 2026 capsule collection. MetLife Stadium drop — July 20, 2026." },
    ],
  }),
  component: Fifa26Page,
});

const KITS = [
  {
    id: "1",
    name: "OG Stadium Home Kit",
    price: 1199,
    originalPrice: 1699,
    img: productJersey,
    slug: "og-stadium-jersey",
    tag: "Home · White",
    edition: "500",
  },
  {
    id: "2",
    name: "OG Terrace Away Jersey",
    price: 1299,
    originalPrice: 1899,
    img: productJersey,
    slug: "og-stadium-jersey",
    tag: "Away · Electric Blue",
    edition: "300",
  },
  {
    id: "3",
    name: "OG Keeper Third Kit",
    price: 999,
    originalPrice: 1499,
    img: productJersey,
    slug: "og-stadium-jersey",
    tag: "Third · Moss",
    edition: "200",
  },
  {
    id: "4",
    name: "OG Coach Jacket FIFA Ed.",
    price: 1699,
    originalPrice: 2299,
    img: productHoodie,
    slug: "og-archive-oversized-hoodie",
    tag: "Coach · Black",
    edition: "150",
  },
];

// Match: July 20, 2026 at 12:30 AM IST = July 19, 2026 at 19:00 UTC
const MATCH_TARGET = new Date("2026-07-19T19:00:00Z");

function getTimeLeft() {
  const now = new Date();
  const diff = Math.max(0, MATCH_TARGET.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

// GOAT teams
const GOAT_TEAMS = [
  {
    nation: "Argentina",
    code: "ARG",
    goat: "Lionel Messi",
    number: 10,
    titles: "3× World Cup",
    flag: "🇦🇷",
    jerseyImg: "/jersey-argentina.png",
    kitColor: "#74ACDF",
    accent: "#F6B40E",
    desc: "The reigning champions return to defend their crown. Messi at his final tournament, surrounded by generational talent.",
  },
  {
    nation: "Brazil",
    code: "BRA",
    goat: "Vinícius Jr.",
    number: 7,
    titles: "5× World Cup",
    flag: "🇧🇷",
    jerseyImg: "/jersey-brazil.png",
    kitColor: "#009C3B",
    accent: "#FFDF00",
    desc: "The most decorated nation in football history. Vini Jr. leads a devastating front line chasing a sixth star.",
  },
  {
    nation: "Portugal",
    code: "POR",
    goat: "Cristiano Ronaldo",
    number: 7,
    titles: "1× Euro",
    flag: "🇵🇹",
    jerseyImg: "/jersey-portugal.png",
    kitColor: "#E3001B",
    accent: "#006600",
    desc: "CR7's final World Cup on the grandest stage. A nation rallies behind its greatest ever player for one last shot.",
  },
  {
    nation: "Cape Verde",
    code: "CPV",
    goat: "Gelson Fernandes",
    number: 6,
    titles: "Debutants",
    flag: "🇨🇻",
    jerseyImg: "/jersey-capeverde.png",
    kitColor: "#003893",
    accent: "#CF2027",
    desc: "The Blue Sharks make their World Cup debut. An island nation of 600,000 — the tournament's ultimate underdog story.",
    isUnderdog: true,
  },
];

function Fifa26Page() {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [lotteryEmail, setLotteryEmail] = useState("");
  const [entered, setEntered] = useState(false);
  const [addedKit, setAddedKit] = useState<string | null>(null);

  function handleAddGoatKit(team: typeof GOAT_TEAMS[0]) {
    addToCart({
      id: `goat-${team.code.toLowerCase()}`,
      slug: `goat-${team.code.toLowerCase()}`,
      name: `${team.nation} Match Jersey`,
      price: 1299,
      color: "home",
      colorLabel: "Home Edition",
      size: "L", // default size for quick add
      qty: 1,
      image: team.jerseyImg,
    });
    setAddedKit(team.code);
    setTimeout(() => setAddedKit(null), 2000);
  }

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  async function handleLottery(e: React.FormEvent) {
    e.preventDefault();
    if (!lotteryEmail) return;
    try {
      await enterLottery(lotteryEmail, "fifa26-capsule");
      setEntered(true);
    } catch {
      setEntered(true);
    }
  }

  return (
    <div className="bg-background text-foreground">
      {/* ── HERO ── */}
      <div className="relative min-h-screen overflow-hidden bg-black text-white flex flex-col">
        <img
          src="/images.jpg"
          alt="FIFA'26 hero"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black" />

        {/* Hero copy */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center pb-10 pt-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-gold)] mb-4">
            OG Clothing × FIFA World Cup 2026
          </div>
          <h1 className="font-display text-6xl uppercase leading-[0.88] tracking-tight md:text-[8rem]">
            Beyond<br />the<br />Pitch.
          </h1>
          <p className="mt-6 max-w-lg text-base text-white/60">
            Designed for the terraces. Worn everywhere else. Our most technical collection yet —
            match-day performance meets off-pitch precision.
          </p>

          {/* Match info pill */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-sm text-sm">
              <MapPin className="h-4 w-4 text-[color:var(--color-gold)]" />
              MetLife Stadium, East Rutherford, NJ
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-sm text-sm">
              <Clock className="h-4 w-4 text-[color:var(--color-gold)]" />
              Mon July 20 · 12:30 AM IST / 3:00 PM EDT
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#kits" className="group inline-flex items-center gap-3 rounded-full bg-[color:var(--color-gold)] px-8 py-4 text-sm font-semibold text-foreground transition hover:gap-4">
              Shop the kits
              <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
            </a>
            <a href="#lottery" className="rounded-full border border-white/30 px-8 py-4 text-sm font-medium backdrop-blur-sm transition hover:bg-white/10">
              Enter the lottery
            </a>
          </div>
        </div>
      </div>

      {/* ── COUNTDOWN to MetLife match ── */}
      <div className="bg-foreground text-background">
        <div className="mx-auto max-w-[1600px] px-6 py-14">
          <div className="eyebrow mb-6 text-white/50 text-center">
            MetLife Stadium drop kicks off in
          </div>
          <div className="grid grid-cols-4 gap-3 md:gap-8 text-center">
            {[
              { label: "Days", v: String(timeLeft.days).padStart(2, "0") },
              { label: "Hours", v: String(timeLeft.hours).padStart(2, "0") },
              { label: "Minutes", v: String(timeLeft.minutes).padStart(2, "0") },
              { label: "Seconds", v: String(timeLeft.seconds).padStart(2, "0") },
            ].map((t, i) => (
              <div key={t.label} className="flex flex-col items-center">
                <div
                  className="font-display tabular-nums leading-none text-5xl md:text-8xl transition-all"
                  style={{ color: i === 3 ? "var(--color-gold)" : "inherit" }}
                >
                  {t.v}
                </div>
                <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-white/50">{t.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center font-mono text-xs text-white/30 uppercase tracking-widest">
            Monday, 20 July 2026 · 12:30 AM IST (3:00 PM–6:00 PM EDT)
          </div>
        </div>
      </div>

      {/* ── GOAT TEAMS ── */}
      <div className="mx-auto max-w-[1600px] px-6 py-24">
        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="eyebrow mb-3 flex items-center gap-2">
              <Star className="h-3 w-3 fill-current" /> GOATs on the Pitch
            </div>
            <h2 className="headline-lg">The nations.<br />The legends.</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Every nation. Every kit. We built our capsule around the GOATs of the beautiful game.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {GOAT_TEAMS.map((team) => (
            <div
              key={team.code}
              className={`relative group rounded-2xl border overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                team.isUnderdog ? "border-[color:var(--color-electric)] ring-1 ring-[color:var(--color-electric)]/30" : "border-border"
              }`}
            >
              {/* Jersey card */}
              <div
                className="relative aspect-[4/5] flex flex-col items-center justify-center overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${team.kitColor}22, ${team.accent}11)` }}
              >
                {/* Country flag strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ background: `linear-gradient(90deg, ${team.kitColor}, ${team.accent})` }}
                />

                {/* Underdog badge */}
                {team.isUnderdog && (
                  <div className="absolute left-3 top-4 z-10 rounded-full bg-[color:var(--color-electric)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white">
                    ⚡ Underdog
                  </div>
                )}

                {/* Nation flag + code */}
                <div className="absolute right-3 top-4 text-right">
                  <div className="text-3xl leading-none">{team.flag}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{team.code}</div>
                </div>

                {/* Jersey image */}
                <img
                  src={team.jerseyImg}
                  alt={`${team.nation} jersey`}
                  className="h-48 w-auto object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2"
                  onError={(e) => {
                    // Fallback to colored circle if image fails
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />

                {/* Number overlay */}
                <div
                  className="absolute bottom-4 left-4 font-display text-6xl font-bold leading-none opacity-10"
                  style={{ color: team.kitColor }}
                >
                  {team.number}
                </div>
              </div>

              {/* Card info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-2xl uppercase leading-none">{team.nation}</h3>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: team.kitColor }}>
                      {team.goat} · #{team.number}
                    </div>
                  </div>
                  <div className="shrink-0 rounded-full bg-secondary px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {team.titles}
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{team.desc}</p>

                <button
                  onClick={() => handleAddGoatKit(team)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: team.kitColor }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {addedKit === team.code ? "Added to bag ✓" : "Quick Add — ₹1,299"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CAPE VERDE FEATURE SECTION ── */}
      <div className="relative overflow-hidden text-white" style={{ backgroundColor: "#003893" }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #CF2027 0, #CF2027 2px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-6 py-24">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Left */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="text-5xl">🇨🇻</span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">The Underdog Story</div>
                  <h2 className="font-display text-4xl uppercase leading-none md:text-6xl">Cape Verde.</h2>
                </div>
              </div>

              <p className="text-base text-white/70 leading-relaxed max-w-lg">
                An archipelago of ten islands in the Atlantic, 570 km off the coast of West Africa. Population: 600,000.
                Football World Cup appearances: <strong className="text-white">1 (2026)</strong>.
              </p>
              <p className="mt-4 text-base text-white/70 leading-relaxed max-w-lg">
                The Blue Sharks — <em>Os Tubarões Azuis</em> — qualified through sheer grit. Ranked 87th in the world entering the
                tournament, they overcame powerhouses on a journey that captivated the entire continent of Africa.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/20 pt-8">
                {[
                  { stat: "600K", label: "Population" },
                  { stat: "10", label: "Islands" },
                  { stat: "#87", label: "FIFA Ranking" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-4xl">{s.stat}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/50">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#lottery" className="rounded-full bg-[#CF2027] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                  Rep the Blue Sharks →
                </a>
                <Link
                  to="/shop"
                  className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
                >
                  Shop inspired kit
                </Link>
              </div>
            </div>

            {/* Right — facts */}
            <div className="space-y-4">
              {[
                {
                  title: "The journey",
                  body: "Cape Verde navigated the African qualifiers with zero home advantage — their stadium didn't meet FIFA standards. Every 'home' match was played in Praia, with supporters travelling from across the diaspora.",
                },
                {
                  title: "The diaspora",
                  body: "Over 1 million Cape Verdeans live abroad — in Portugal, the Netherlands, the USA and beyond. The global fanbase will outnumber the entire home population at MetLife Stadium.",
                },
                {
                  title: "The culture",
                  body: "Cape Verde gave the world Cesária Évora and morna music. This is a nation of artists, fishermen, and now — world-stage footballers. Their style of play mirrors the culture: creative, expressive, technically exact.",
                },
                {
                  title: "OG × CPV",
                  body: "We designed our Blue Sharks inspired kit with the Atlantic in mind — dark navy with red accents, number 9, a quiet emblem on the chest. Limited to 200 units worldwide.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2">{f.title}</div>
                  <p className="text-sm text-white/80 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── KITS GRID ── */}
      <div id="kits" className="mx-auto max-w-[1600px] px-6 py-24">
        <div className="mb-12">
          <div className="eyebrow mb-3">FIFA'26 Capsule · MetLife Edition</div>
          <h2 className="headline-lg">The kits.</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {KITS.map((k, i) => (
            <Link
              key={k.id}
              to="/product/$slug"
              params={{ slug: k.slug }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[color:var(--color-bone)]">
                <img
                  src={k.img}
                  alt={k.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                {i === 0 && (
                  <div className="absolute left-3 top-3 rounded-full bg-[color:var(--color-gold)] px-2.5 py-1 text-[9px] uppercase tracking-widest text-foreground font-semibold">
                    Featured
                  </div>
                )}
                <div className="absolute right-3 bottom-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white backdrop-blur">
                  {k.edition} ed.
                </div>
              </div>
              <div className="mt-3">
                <div className="eyebrow">{k.tag}</div>
                <h3 className="mt-0.5 text-sm font-semibold leading-tight">{k.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-sm">₹{k.price.toLocaleString("en-IN")}</span>
                  <span className="font-mono text-xs text-muted-foreground line-through">₹{k.originalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── EDITORIAL STRIP ── */}
      <div className="relative overflow-hidden">
        <img
          src={lookbookSkate}
          alt="FIFA Editorial"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative bg-[color:var(--color-bone)]/90 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div className="eyebrow mb-4">The story behind the kit</div>
            <h2 className="font-display text-4xl uppercase leading-none md:text-6xl">
              "Football gave us<br />the language."
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-sm text-muted-foreground">
              Designed with ex-professional players and terrace photographers. Every stitch references a specific match, a specific era. Every colour a flag.
            </p>
            <Link
              to="/editorial"
              className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest link-underline"
            >
              Read the editorial →
            </Link>
          </div>
        </div>
      </div>

      {/* ── LOTTERY ── */}
      <div id="lottery" className="bg-foreground text-background">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="eyebrow mb-4 text-white/50">Limited Access · MetLife Edition</div>

          {/* FIFA logo in lottery section */}
          <div className="mb-8 w-24 mx-auto">
            <img
              src="/fifa26-emblem.webp"
              alt="FIFA World Cup 26 Logo"
              className="w-full h-auto drop-shadow-lg"
            />
          </div>

          <h2 className="font-display text-4xl uppercase leading-none md:text-6xl">
            Enter the lottery.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
            200 kits. One lottery. Enter your email for a chance to buy before the public MetLife drop.
            Winners notified 48 hours before launch — July 18, 2026.
          </p>
          {entered ? (
            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-[color:var(--color-neon)] bg-[color:var(--color-neon)]/10 px-8 py-4 text-sm font-medium text-[color:var(--color-neon)]">
              ✓ You're in the lottery! We'll be in touch before 18 July.
            </div>
          ) : (
            <form onSubmit={handleLottery} className="mx-auto mt-10 flex max-w-md items-center overflow-hidden rounded-full border border-white/20 bg-white/5">
              <input
                type="email"
                placeholder="your@email.com"
                value={lotteryEmail}
                onChange={(e) => setLotteryEmail(e.target.value)}
                required
                className="flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-white/40"
              />
              <button type="submit" className="shrink-0 rounded-full bg-[color:var(--color-gold)] px-5 py-3 text-sm font-semibold text-foreground transition hover:opacity-90">
                Enter
              </button>
            </form>
          )}
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-white/30">
            One entry per person · No purchase required · MetLife Stadium only
          </p>
        </div>
      </div>
    </div>
  );
}
