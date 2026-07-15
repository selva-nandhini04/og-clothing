import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Search, ShoppingBag, User } from "lucide-react";

import heroMain from "@/assets/hero-main.jpg";
import productHoodie from "@/assets/product-hoodie.jpg";
import productCargo from "@/assets/product-cargo.jpg";
import productJersey from "@/assets/product-jersey.jpg";
import lookbookSkate from "@/assets/lookbook-skate.jpg";
import collectionFootball from "@/assets/collection-football.jpg";
import collectionOversized from "@/assets/collection-oversized.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const marqueeItems = [
  "LIMITED STOCK · UNLIMITED DRIP",
  "FREE SHIPPING OVER $150",
  "NEW DROP EVERY FRIDAY 6PM GMT",
  "MADE FOR PEOPLE WHO WEAR CONFIDENCE",
  "FIFA 2026 CAPSULE — COMING SOON",
];

const trending = [
  { name: "OG Archive Oversized Hoodie", price: "$185", tag: "Core / 001", img: productHoodie },
  { name: "Cargo-X Field Trouser", price: "$220", tag: "Utility / 04", img: productCargo },
  { name: "Terrace Knit Vest", price: "$140", tag: "Terrace / 07", img: productJersey },
  { name: "Vanguard Technical Parka", price: "$485", tag: "Core / 001", img: productHoodie },
];

const categories = ["Outerwear", "Knitwear", "Accessories", "Football", "Denim", "Footwear"];

const brands = [
  "BALMAIN PARIS", "SHIFT OF ENERGY", "STUDIO BANANA", "NORTH KHORASAN",
  "FOOLHARDY", "JEFFCOLINS", "RIDE LIFE", "UNION OF SOVIET", "DEDOC",
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <Nav />
      <Hero />
      <Ticker />
      <BrutalistEssentials />
      <ManifestoRule />
      <DualCollections />
      <TrendingNow />
      <BeyondStadium />
      <ShopByCategory />
      <BrandStrip />
      <Newsletter />
      <Footer />
    </div>
  );
}

/* ─────────── TOP BAR ─────────── */
function TopBar() {
  return (
    <div className="hidden bg-foreground text-background md:block">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-2 text-[10px] tracking-[0.25em] uppercase font-mono">
        <span>Free returns · Worldwide</span>
        <span>New drop 06.19 · Terrace Archive</span>
        <span>EN / USD</span>
      </div>
    </div>
  );
}

/* ─────────── NAV ─────────── */
function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background font-display text-sm">
            OG
          </span>
          <span className="font-display text-sm tracking-widest">CLOTHING</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {["Shop", "Collections", "Editorial", "Archive", "FIFA'26"].map((l) => (
            <a key={l} href="#" className="link-underline text-sm font-medium">
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-foreground">
          <button aria-label="Search" className="p-1 transition hover:opacity-60"><Search className="h-4 w-4" /></button>
          <button aria-label="Account" className="p-1 transition hover:opacity-60"><User className="h-4 w-4" /></button>
          <button aria-label="Cart" className="relative p-1 transition hover:opacity-60">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[color:var(--color-electric)] text-[9px] text-white">2</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ─────────── HERO ─────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-6 py-10 md:grid-cols-12 md:py-16">
        {/* Left copy */}
        <div className="flex flex-col justify-between md:col-span-5">
          <div className="space-y-6 animate-rise">
            <div className="eyebrow">Spring · Winter 2026 · Vol. 01</div>
            <h1 className="headline-xl">
              Tell your <span className="italic font-normal font-sans lowercase tracking-tight text-[color:var(--color-electric)]">rich</span> friends about our stuff.
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              A study in matte black cotton, hand-finished stitching and dead-of-night silhouettes.
              Made in limited runs. Numbered. Never restocked.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:gap-4">
              Shop the drop
              <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
            </button>
            <button className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium transition hover:bg-foreground hover:text-background">
              Watch film
            </button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <div><div className="text-foreground text-2xl font-display">24</div>pieces</div>
            <div><div className="text-foreground text-2xl font-display">08</div>silhouettes</div>
            <div><div className="text-foreground text-2xl font-display">01</div>edition</div>
          </div>
        </div>

        {/* Image */}
        <div className="relative md:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary">
            <img
              src={heroMain}
              alt="Model in an all-black OG Clothing look inside an industrial concrete space"
              width={1600}
              height={1808}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 font-mono text-[10px] uppercase tracking-widest">
              Limited Drop · 018 / 200
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-[10px] uppercase tracking-widest text-background">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-neon)]" />
              Live · 214 watching
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── TICKER ─────────── */
function Ticker() {
  const row = [...marqueeItems, ...marqueeItems];
  return (
    <div className="border-y border-foreground bg-foreground text-background">
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 gap-16 whitespace-nowrap py-4 font-display text-2xl uppercase tracking-tight">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-16">
              {t} <span className="text-[color:var(--color-neon)]">✱</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── BRUTALIST ESSENTIALS ─────────── */
function BrutalistEssentials() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <div className="eyebrow mb-3">The Series · Vol. 01</div>
          <h2 className="headline-lg">Brutalist<br />Essentials.</h2>
        </div>
        <a href="#" className="link-underline hidden text-sm font-medium md:inline-block">View all pieces →</a>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-3">
        {trending.slice(0, 3).map((p, i) => (
          <article key={p.name} className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[color:var(--color-bone)]">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              {i === 0 && (
                <div className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[9px] uppercase tracking-widest text-background">
                  New
                </div>
              )}
              <button className="absolute inset-x-3 bottom-3 translate-y-4 rounded-full bg-background/95 py-2.5 text-xs font-medium opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                Quick add
              </button>
            </div>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <div className="eyebrow">{p.tag}</div>
                <h3 className="mt-1 text-sm font-semibold">{p.name}</h3>
              </div>
              <div className="text-sm font-mono">{p.price}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─────────── MANIFESTO ─────────── */
function ManifestoRule() {
  return (
    <section className="bg-[color:var(--color-bone)] py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="eyebrow mb-6">Manifesto · No. 01</div>
        <p className="font-display text-4xl uppercase leading-[1.05] tracking-tight md:text-7xl">
          "Made for people <br />
          who wear <span className="italic text-[color:var(--color-electric)]">confidence</span>."
        </p>
        <p className="mx-auto mt-8 max-w-lg text-sm text-muted-foreground">
          OG Clothing is an ongoing archive of physical and cultural artefacts —
          engineered somewhere between the terrace, the skatepark and the studio.
        </p>
      </div>
    </section>
  );
}

/* ─────────── DUAL COLLECTIONS ─────────── */
function DualCollections() {
  const cards = [
    { title: "Oversized Archive", tag: "Core · 24 pieces", img: collectionOversized, accent: "electric" },
    { title: "Football Terrace", tag: "FIFA'26 Capsule", img: collectionFootball, accent: "gold" },
  ];
  return (
    <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-6 py-24 md:grid-cols-2">
      {cards.map((c) => (
        <a key={c.title} href="#" className="group relative block aspect-[5/6] overflow-hidden rounded-lg bg-foreground">
          <img
            src={c.img}
            alt={c.title}
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] opacity-80">{c.tag}</div>
            <h3 className="font-display text-4xl uppercase leading-none md:text-6xl">{c.title}</h3>
            <div className="mt-6 flex items-center gap-3 text-sm">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background: c.accent === "electric" ? "var(--color-electric)" : "var(--color-gold)",
                }}
              />
              <span className="link-underline">Explore the collection</span>
            </div>
          </div>
        </a>
      ))}
    </section>
  );
}

/* ─────────── TRENDING NOW ─────────── */
function TrendingNow() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24">
      <div className="mb-10 flex items-baseline justify-between">
        <h2 className="headline-lg">Trending now.</h2>
        <a href="#" className="link-underline text-sm">Best sellers →</a>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {trending.map((p) => (
          <article key={p.name + p.tag} className="group cursor-pointer">
            <div className="aspect-[4/5] overflow-hidden rounded-md bg-[color:var(--color-bone)]">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-xs font-semibold uppercase tracking-wider">{p.name}</h3>
                <div className="eyebrow mt-1">{p.tag}</div>
              </div>
              <div className="text-xs font-mono">{p.price}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─────────── BEYOND THE STADIUM ─────────── */
function BeyondStadium() {
  const [count, setCount] = useState({ d: 3, h: 12, m: 45 });
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        const m = c.m === 0 ? 59 : c.m - 1;
        const h = c.m === 0 ? (c.h === 0 ? 23 : c.h - 1) : c.h;
        const d = c.h === 0 && c.m === 0 ? Math.max(0, c.d - 1) : c.d;
        return { d, h, m };
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <img
        src={lookbookSkate}
        alt="Editorial skateboarding"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 py-32 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-4 text-[color:var(--color-neon)]">Stadium Drop · 01</div>
          <h2 className="font-display text-5xl uppercase leading-none md:text-8xl">
            Beyond<br />the stadium.
          </h2>
          <p className="mt-6 max-w-md text-sm text-white/70">
            The London Archive lands in 72 hours. 200 numbered kits, one lottery entry per family member.
          </p>
        </div>

        <div className="flex flex-col justify-end gap-8">
          <div className="grid grid-cols-3 gap-4 border-y border-white/20 py-8 text-center">
            {[
              { l: "Days", v: String(count.d).padStart(2, "0") },
              { l: "Hours", v: String(count.h).padStart(2, "0") },
              { l: "Minutes", v: String(count.m).padStart(2, "0") },
            ].map((t) => (
              <div key={t.l}>
                <div className="font-display text-5xl md:text-7xl">{t.v}</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-white/60">{t.l}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-[color:var(--color-electric)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[color:var(--color-electric)]/90">
              Enter the lottery
            </button>
            <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium transition hover:bg-white hover:text-foreground">
              Read the lookbook
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── SHOP BY CATEGORY ─────────── */
function ShopByCategory() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24">
      <div className="eyebrow mb-4">Collections</div>
      <ul className="divide-y divide-border border-y border-border">
        {categories.map((c) => (
          <li key={c}>
            <a
              href="#"
              className="group flex items-center justify-between py-8 transition"
            >
              <span className="font-display text-4xl uppercase tracking-tight transition group-hover:translate-x-2 md:text-6xl">
                {c}
              </span>
              <ArrowUpRight className="h-8 w-8 shrink-0 transition group-hover:rotate-45 group-hover:text-[color:var(--color-electric)]" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────── BRAND STRIP ─────────── */
function BrandStrip() {
  const row = [...brands, ...brands];
  return (
    <section className="border-y border-border bg-[color:var(--color-bone)] py-6 overflow-hidden">
      <div className="flex animate-marquee gap-16 whitespace-nowrap font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
        {row.map((b, i) => (
          <span key={i}>{b}</span>
        ))}
      </div>
    </section>
  );
}

/* ─────────── NEWSLETTER ─────────── */
function Newsletter() {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="eyebrow mb-4 text-white/50">Members Only</div>
        <h2 className="font-display text-4xl uppercase leading-none md:text-6xl">
          Join the family.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
          Early access to drops, invites to store openings, and the occasional letter from the studio.
          Your cart feels lonely — fix that first.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-10 flex max-w-md items-center overflow-hidden rounded-full border border-white/20 bg-white/5"
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-white/40"
          />
          <button className="rounded-full bg-white px-5 py-3 text-sm font-medium text-foreground transition hover:bg-[color:var(--color-neon)]">
            Secure entry
          </button>
        </form>
      </div>
    </section>
  );
}

/* ─────────── FOOTER ─────────── */
function Footer() {
  const cols = [
    { title: "Structure", items: ["Story", "Shipping", "Contact"] },
    { title: "Legal", items: ["Privacy", "Terms", "Cookies"] },
    { title: "Community", items: ["Instagram", "Twitter", "Discord"] },
  ];
  return (
    <footer className="bg-background">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-10 px-6 py-16 md:grid-cols-5">
        <div className="col-span-2">
          <div className="font-display text-4xl uppercase">OG</div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            High-end structural apparel at the intersection of fashion and industrial culture.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="eyebrow mb-4">{c.title}</div>
            <ul className="space-y-2 text-sm">
              {c.items.map((i) => (
                <li key={i}>
                  <a href="#" className="link-underline">{i}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>© 2026 OG Clothing. All rights reserved.</span>
          <span>Looking good starts here.</span>
        </div>
      </div>
    </footer>
  );
}
