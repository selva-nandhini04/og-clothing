import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";

import heroMain from "@/assets/hero-main.jpg";
import lookbookSkate from "@/assets/lookbook-skate.jpg";
import collectionFootball from "@/assets/collection-football.jpg";
import collectionOversized from "@/assets/collection-oversized.jpg";

export const Route = createFileRoute("/editorial")({
  head: () => ({
    meta: [
      { title: "Editorial — OG CLOTHING" },
      { name: "description", content: "OG Clothing editorial. Stories from the studio, street and stadium." },
    ],
  }),
  component: EditorialPage,
});

const EDITORIALS = [
  {
    id: "1",
    type: "Film",
    title: "Black Hours",
    subtitle: "A study in midnight silhouettes",
    desc: "Shot over 72 hours across three London boroughs. No models. Just people who wear OG.",
    img: heroMain,
    date: "June 2026",
    readTime: "12 min watch",
    tag: "Film · Vol. 01",
    featured: true,
  },
  {
    id: "2",
    type: "Photography",
    title: "Terrace Diaries",
    subtitle: "Match-day, reimagined",
    desc: "Four photographers, four different grounds. The fashion of the stands, documented.",
    img: collectionFootball,
    date: "May 2026",
    readTime: "8 min read",
    tag: "Photography",
    featured: false,
  },
  {
    id: "3",
    type: "Interview",
    title: "The Skate of Things",
    subtitle: "Architecture meets concrete",
    desc: "We sat down with three skaters who helped design our Utility line. The conversation went long.",
    img: lookbookSkate,
    date: "April 2026",
    readTime: "15 min read",
    tag: "Interview",
    featured: false,
  },
  {
    id: "4",
    type: "Lookbook",
    title: "Volume 01 Lookbook",
    subtitle: "The full Spring/Winter collection",
    desc: "Every piece from the debut collection, styled by three independent stylists with no creative direction from us.",
    img: collectionOversized,
    date: "March 2026",
    readTime: "6 min view",
    tag: "Lookbook",
    featured: false,
  },
];

function EditorialPage() {
  const [featured, ...rest] = EDITORIALS;

  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-[color:var(--color-bone)]">
        <div className="mx-auto max-w-[1600px] px-6 py-12">
          <div className="eyebrow mb-2">Stories · Vol. 01</div>
          <h1 className="font-display text-5xl uppercase tracking-tight md:text-7xl">Editorial.</h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Films, photography, interviews, and lookbooks. Stories from the studio, street, and stadium.
          </p>
        </div>
      </div>

      {/* Featured editorial */}
      <div className="mx-auto max-w-[1600px] px-6 py-12">
        <div className="group relative aspect-[16/9] overflow-hidden rounded-xl cursor-pointer">
          <img
            src={featured.img}
            alt={featured.title}
            className="h-full w-full object-cover opacity-80 transition duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Play button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-white/50 bg-white/10 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-white/20">
              <Play className="h-6 w-6 fill-white text-white translate-x-0.5" />
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white md:p-12">
            <div className="eyebrow mb-3 text-white/60">{featured.tag} · {featured.date}</div>
            <h2 className="font-display text-4xl uppercase leading-none md:text-7xl">{featured.title}</h2>
            <p className="mt-3 max-w-lg text-sm text-white/70">{featured.desc}</p>
            <div className="mt-6 flex items-center gap-4 text-xs text-white/50">
              <span className="font-mono uppercase tracking-widest">{featured.readTime}</span>
              <span>·</span>
              <span className="font-mono uppercase tracking-widest">{featured.type}</span>
            </div>
          </div>

          <div className="absolute left-5 top-5 rounded-full bg-[color:var(--color-electric)] px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-white">
            Latest
          </div>
        </div>
      </div>

      {/* Editorial grid */}
      <div className="mx-auto max-w-[1600px] px-6 pb-24">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-3xl uppercase">More stories</h2>
          <div className="flex gap-3">
            {["All", "Film", "Photography", "Interview", "Lookbook"].map((t) => (
              <button key={t} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition hover:text-foreground">
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {rest.map((e) => (
            <article key={e.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={e.img}
                  alt={e.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest backdrop-blur">
                  {e.type}
                </div>
              </div>
              <div className="mt-4">
                <div className="eyebrow">{e.date} · {e.readTime}</div>
                <h3 className="mt-1 font-display text-2xl uppercase leading-none tracking-tight group-hover:text-[color:var(--color-electric)] transition">
                  {e.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{e.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium link-underline">
                  {e.type === "Film" ? "Watch" : "Read"} →
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Shop CTA */}
      <div className="border-t border-border bg-[color:var(--color-bone)]">
        <div className="mx-auto max-w-[1600px] flex flex-col items-center gap-6 px-6 py-16 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <div className="eyebrow mb-2">Shop the look</div>
            <h2 className="font-display text-4xl uppercase leading-none">Wear the story.</h2>
          </div>
          <Link
            to="/shop"
            className="shrink-0 inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:opacity-80"
          >
            Shop all pieces →
          </Link>
        </div>
      </div>
    </div>
  );
}
