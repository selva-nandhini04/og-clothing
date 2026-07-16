import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import collectionFootball from "@/assets/collection-football.jpg";
import collectionOversized from "@/assets/collection-oversized.jpg";
import lookbookSkate from "@/assets/lookbook-skate.jpg";
import heroMain from "@/assets/hero-main.jpg";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — OG CLOTHING" },
      { name: "description", content: "Explore OG Clothing collections. From brutalist essentials to FIFA'26 capsule drops." },
    ],
  }),
  component: CollectionsPage,
});

const COLLECTIONS = [
  {
    id: "1",
    name: "Oversized Archive",
    slug: "oversized-archive",
    tag: "Core · 24 pieces · Vol. 01",
    desc: "The foundation. Boxy silhouettes, 500gsm loop-back cotton, garment-dyed in-house. Every piece is numbered in a run of 200.",
    img: collectionOversized,
    accent: "#3b52ff",
    pieces: 24,
    available: true,
  },
  {
    id: "2",
    name: "Football Terrace",
    slug: "football-terrace",
    tag: "FIFA'26 Capsule · 12 pieces",
    desc: "Designed for the terraces. Match-day energy, off-pitch wearability. Co-engineered with stadium architects and retired strikers.",
    img: collectionFootball,
    accent: "#c9a94f",
    pieces: 12,
    available: true,
  },
  {
    id: "3",
    name: "Skate Editorial",
    slug: "skate-editorial",
    tag: "Editorial · Vol. 02",
    desc: "A collaboration between OG and four independent skate photographers. Shot across three cities in five days.",
    img: lookbookSkate,
    accent: "#4ade80",
    pieces: 8,
    available: false,
  },
  {
    id: "4",
    name: "Spring / Winter 2026",
    slug: "spring-winter-2026",
    tag: "Seasonal · Vol. 01",
    desc: "The debut seasonal collection. Hand-finished stitching, dead-of-night silhouettes, and brutalist construction throughout.",
    img: heroMain,
    accent: "#ffffff",
    pieces: 18,
    available: true,
  },
];

function CollectionsPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-[color:var(--color-bone)]">
        <div className="mx-auto max-w-[1600px] px-6 py-12">
          <div className="eyebrow mb-2">All Collections</div>
          <h1 className="font-display text-5xl uppercase tracking-tight md:text-7xl">Collections.</h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Each collection is a chapter. Once it's gone, it's in the archive forever.
          </p>
        </div>
      </div>

      {/* Featured hero collection */}
      <div className="mx-auto max-w-[1600px] px-6 py-12">
        <Link
          to="/shop"
          className="group relative block overflow-hidden rounded-xl bg-foreground"
        >
          <div className="aspect-[21/9] overflow-hidden">
            <img
              src={COLLECTIONS[0].img}
              alt={COLLECTIONS[0].name}
              className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-10 text-white">
            <div className="eyebrow mb-3 text-white/60">{COLLECTIONS[0].tag}</div>
            <h2 className="font-display text-5xl uppercase leading-none md:text-8xl">{COLLECTIONS[0].name}</h2>
            <p className="mt-4 max-w-sm text-sm text-white/70">{COLLECTIONS[0].desc}</p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/30 px-6 py-3 text-sm font-medium backdrop-blur-sm hover:bg-white/10 transition self-start">
              Explore collection
              <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
            </div>
          </div>
          <div className="absolute right-6 top-6 rounded-full bg-background/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur">
            {COLLECTIONS[0].pieces} pieces
          </div>
        </Link>
      </div>

      {/* Collection grid */}
      <div className="mx-auto max-w-[1600px] px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.slice(1).map((c) => (
            <Link
              key={c.id}
              to="/shop"
              className={`group relative block aspect-[4/5] overflow-hidden rounded-xl bg-foreground ${!c.available ? "cursor-default" : ""}`}
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {!c.available && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full border border-white/30 bg-black/50 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur">
                    Archived
                  </div>
                </div>
              )}
              <div className="absolute inset-0 flex flex-col justify-end p-7 text-white">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">{c.tag}</div>
                <h3 className="font-display text-3xl uppercase leading-none md:text-4xl">{c.name}</h3>
                <p className="mt-2 text-xs text-white/60 line-clamp-2">{c.desc}</p>
                {c.available && (
                  <div className="mt-5 flex items-center gap-2 text-sm">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: c.accent }}
                    />
                    <span className="link-underline opacity-80 group-hover:opacity-100 transition">Explore →</span>
                  </div>
                )}
              </div>
              <div className="absolute right-4 top-4 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white" style={{ background: `${c.accent}33`, border: `1px solid ${c.accent}66` }}>
                {c.pieces} pcs
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div className="bg-foreground text-background">
        <div className="mx-auto max-w-[1600px] flex flex-col items-center gap-6 px-6 py-16 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <div className="eyebrow mb-2 text-white/50">Stay ahead</div>
            <h2 className="font-display text-4xl uppercase leading-none">Never miss a drop.</h2>
          </div>
          <Link
            to="/auth"
            className="shrink-0 rounded-full border border-white/30 px-8 py-3 text-sm font-medium transition hover:bg-white hover:text-foreground"
          >
            Create member account →
          </Link>
        </div>
      </div>
    </div>
  );
}
