import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Heart, Minus, Plus, RotateCw, ShieldCheck, Sparkles, Truck } from "lucide-react";

import hoodieFlat from "@/assets/product-hoodie-flat.jpg";
import modelAlex from "@/assets/model-alex.jpg";
import modelMaya from "@/assets/model-maya.jpg";
import modelKenji from "@/assets/model-kenji.jpg";
import modelLena from "@/assets/model-lena.jpg";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({
    meta: [
      { title: "OG Archive Oversized Hoodie — OG CLOTHING" },
      {
        name: "description",
        content:
          "The OG Archive Oversized Hoodie in matte black. 500gsm heavyweight cotton. Preview the fit on multiple models with the AI Model Switcher.",
      },
      { property: "og:title", content: "OG Archive Oversized Hoodie — OG CLOTHING" },
      {
        property: "og:description",
        content:
          "Heavyweight 500gsm cotton hoodie. AI-powered fit preview across body types.",
      },
      { property: "og:type", content: "product" },
    ],
  }),
  component: ProductPage,
});

type Model = {
  id: string;
  name: string;
  detail: string;
  height: string;
  wearing: string;
  img: string;
};

const models: Model[] = [
  { id: "alex", name: "Alex", detail: "6'1\" · Athletic", height: "185cm", wearing: "Size L", img: modelAlex },
  { id: "maya", name: "Maya", detail: "5'6\" · Curvy", height: "168cm", wearing: "Size M", img: modelMaya },
  { id: "kenji", name: "Kenji", detail: "5'10\" · Slim", height: "178cm", wearing: "Size M", img: modelKenji },
  { id: "lena", name: "Lena", detail: "5'8\" · Petite", height: "173cm", wearing: "Size S", img: modelLena },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { id: "matte", label: "Matte Black", hex: "#0a0a0a" },
  { id: "bone", label: "Bone White", hex: "#f2ede4" },
  { id: "electric", label: "Electric Blue", hex: "#3b52ff" },
  { id: "moss", label: "Moss", hex: "#2f3a24" },
];

function ProductPage() {
  const [modelId, setModelId] = useState<string>("alex");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [size, setSize] = useState("L");
  const [color, setColor] = useState("matte");
  const [qty, setQty] = useState(1);

  const current = models.find((m) => m.id === modelId) ?? models[0];

  // Simulate an "AI render" transition when switching models (no page refresh)
  useEffect(() => {
    if (!pendingId || pendingId === modelId) return;
    const t = setTimeout(() => {
      setModelId(pendingId);
      setPendingId(null);
    }, 550);
    return () => clearTimeout(t);
  }, [pendingId, modelId]);

  const switching = pendingId !== null && pendingId !== modelId;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MiniNav />

      <Breadcrumbs />

      <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 pb-16 md:grid-cols-12 md:gap-14">
        {/* ─── LEFT · IMAGERY + MODEL SWITCHER ─── */}
        <div className="md:col-span-7">
          <div className="relative">
            {/* Main visual */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[color:var(--color-bone)]">
              {models.map((m) => (
                <img
                  key={m.id}
                  src={m.img}
                  alt={`OG Archive Oversized Hoodie on ${m.name}, ${m.detail}`}
                  width={1024}
                  height={1280}
                  loading={m.id === "alex" ? "eager" : "lazy"}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                    m.id === current.id
                      ? switching
                        ? "scale-[1.02] opacity-0 blur-sm"
                        : "scale-100 opacity-100 blur-0"
                      : "opacity-0"
                  }`}
                />
              ))}

              {/* AI badge */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
                <Sparkles className="h-3 w-3 text-[color:var(--color-electric)]" />
                AI Model Switcher
              </div>

              {/* Current model card */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <div className="rounded-lg bg-background/90 px-4 py-3 backdrop-blur">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Previewed on
                  </div>
                  <div className="mt-0.5 font-display text-lg uppercase tracking-tight">
                    {current.name} — {current.wearing}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {current.detail} · {current.height}
                  </div>
                </div>
                {switching && (
                  <div className="rounded-full bg-foreground px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-background">
                    Rendering fit…
                  </div>
                )}
              </div>

              {/* Rendering overlay */}
              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                  switching ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-electric)]/10 via-transparent to-[color:var(--color-neon)]/10" />
                <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-transparent border-t-[color:var(--color-electric)]" />
              </div>
            </div>

            {/* Model switcher rail */}
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="eyebrow flex items-center gap-2">
                  <Sparkles className="h-3 w-3" /> See it on your body type
                </div>
                <button className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Use my measurements
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {models.map((m) => {
                  const active = m.id === current.id;
                  const isPending = pendingId === m.id && switching;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPendingId(m.id)}
                      aria-pressed={active}
                      className={`group relative overflow-hidden rounded-md border transition ${
                        active
                          ? "border-foreground ring-2 ring-foreground/10"
                          : "border-border hover:border-foreground/60"
                      }`}
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-[color:var(--color-bone)]">
                        <img
                          src={m.img}
                          alt={m.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5 text-left">
                        <span className="text-xs font-semibold">{m.name}</span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                          {m.wearing}
                        </span>
                      </div>
                      {active && (
                        <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-foreground text-background">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      {isPending && (
                        <span className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Same garment · Different body · Instant render · No refresh
              </p>
            </div>

            {/* Flat product shot */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="aspect-square overflow-hidden rounded-md bg-[color:var(--color-bone)]">
                <img src={hoodieFlat} alt="Flat lay of the hoodie" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-center rounded-md border border-border p-5">
                <div className="eyebrow mb-2">Fabric · 500gsm</div>
                <h4 className="font-display text-2xl uppercase tracking-tight">Loop-back cotton.</h4>
                <p className="mt-2 text-xs text-muted-foreground">
                  Woven in Porto. Garment-dyed for a lived-in matte finish that softens with every wash.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT · BUY BOX ─── */}
        <aside className="md:col-span-5">
          <div className="md:sticky md:top-24">
            <div className="eyebrow">Core · 001 · Drop 018</div>
            <h1 className="mt-2 font-display text-4xl uppercase leading-none tracking-tight md:text-5xl">
              OG Archive<br />Oversized Hoodie.
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-2xl">$185</span>
              <span className="font-mono text-xs text-muted-foreground line-through">$220</span>
              <span className="rounded-full bg-[color:var(--color-neon)]/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground">
                Members $148
              </span>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              A brutalist take on the classic hood. Double-lined hood, boxy oversized silhouette,
              signature back embroidery. Made in a run of 500. Numbered, never restocked.
            </p>

            {/* Color */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <div className="eyebrow">Color</div>
                <div className="text-xs">{colors.find((c) => c.id === color)?.label}</div>
              </div>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    aria-label={c.label}
                    className={`h-9 w-9 rounded-full border-2 transition ${
                      color === c.id ? "border-foreground scale-110" : "border-border hover:border-foreground/50"
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <div className="eyebrow">Size</div>
                <button className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Size guide
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((s) => {
                  const active = s === size;
                  const out = s === "XS";
                  return (
                    <button
                      key={s}
                      disabled={out}
                      onClick={() => setSize(s)}
                      className={`h-11 rounded-md border text-xs font-semibold transition ${
                        out
                          ? "cursor-not-allowed border-dashed border-border text-muted-foreground line-through"
                          : active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-electric)]">
                AI fit tip: {current.name} at {current.height} recommends {current.wearing} for oversized fit.
              </p>
            </div>

            {/* Qty + CTA */}
            <div className="mt-8 flex items-stretch gap-3">
              <div className="flex items-center overflow-hidden rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-3">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <button className="group flex flex-1 items-center justify-center gap-3 rounded-full bg-foreground py-3 text-sm font-semibold text-background transition hover:gap-4">
                Add to bag — ${(185 * qty).toLocaleString()}
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
              </button>
              <button aria-label="Save" className="grid h-12 w-12 place-items-center rounded-full border border-border transition hover:border-foreground">
                <Heart className="h-4 w-4" />
              </button>
            </div>

            {/* Perks */}
            <ul className="mt-6 grid grid-cols-1 gap-2 text-xs">
              <Perk icon={<Truck className="h-3.5 w-3.5" />}>Free express shipping over $150 · arrives Fri</Perk>
              <Perk icon={<RotateCw className="h-3.5 w-3.5" />}>30-day free returns · worldwide</Perk>
              <Perk icon={<ShieldCheck className="h-3.5 w-3.5" />}>Numbered piece · authenticity chip embedded</Perk>
            </ul>

            {/* Detail accordion (static) */}
            <div className="mt-10 divide-y divide-border border-y border-border">
              <Detail title="Fabric & construction">
                500gsm loop-back cotton · Double-lined hood · Reinforced kangaroo pocket · YKK metal tips.
              </Detail>
              <Detail title="Fit">
                Oversized. Size down for a boxy fit, or true-to-size for full drop shoulder.
              </Detail>
              <Detail title="Care">
                Wash cold inside-out. Hang dry. Never bleach. Ages beautifully.
              </Detail>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function MiniNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background font-display text-sm">
            OG
          </span>
          <span className="font-display text-sm tracking-widest">CLOTHING</span>
        </Link>
        <Link to="/" className="link-underline text-xs font-medium">
          ← Back to shop
        </Link>
      </div>
    </header>
  );
}

function Breadcrumbs() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-6 pt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      <Link to="/" className="link-underline">Shop</Link> / Core / Hoodies / <span className="text-foreground">OG Archive</span>
    </div>
  );
}

function Perk({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-muted-foreground">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-foreground">{icon}</span>
      {children}
    </li>
  );
}

function Detail({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-wider">{title}</span>
        {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
      {open && <p className="pb-5 text-sm text-muted-foreground">{children}</p>}
    </div>
  );
}
