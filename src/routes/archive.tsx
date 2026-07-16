import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

import productHoodie from "@/assets/product-hoodie.jpg";
import productCargo from "@/assets/product-cargo.jpg";
import productJersey from "@/assets/product-jersey.jpg";
import collectionOversized from "@/assets/collection-oversized.jpg";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Archive — OG CLOTHING" },
      { name: "description", content: "The OG Clothing archive. Past drops, numbered pieces, and sold-out editions." },
    ],
  }),
  component: ArchivePage,
});

const DROPS = [
  { id: "018", name: "OG Archive Oversized Hoodie", collection: "Core / 001", date: "June 2026", price: "₹1,299", img: productHoodie, status: "available", edition: "200 / 200" },
  { id: "017", name: "Cargo-X Field Trouser", collection: "Utility / 04", date: "May 2026", price: "₹1,799", img: productCargo, status: "sold_out", edition: "150 / 150" },
  { id: "016", name: "Terrace Knit Vest", collection: "Terrace / 07", date: "April 2026", price: "₹999", img: productJersey, status: "sold_out", edition: "100 / 100" },
  { id: "015", name: "Archive Coach Jacket", collection: "Core / 001", date: "March 2026", price: "₹1,699", img: collectionOversized, status: "sold_out", edition: "200 / 200" },
  { id: "014", name: "Stadium Away Kit", collection: "FIFA'26 / Preview", date: "Feb 2026", price: "₹1,199", img: productJersey, status: "sold_out", edition: "500 / 500" },
  { id: "013", name: "OG Crewneck Vol.1", collection: "Core / 002", date: "Jan 2026", price: "₹1,099", img: productHoodie, status: "sold_out", edition: "200 / 200" },
];

function ArchivePage() {
  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-[1600px] px-6 py-12">
          <div className="eyebrow mb-2 text-white/50">Drop history</div>
          <h1 className="font-display text-5xl uppercase tracking-tight md:text-7xl">Archive.</h1>
          <p className="mt-3 max-w-lg text-sm text-white/60">
            Every drop. Every number. Once sold out, it lives here — permanent, never reprinted.
          </p>
        </div>
      </div>

      {/* Archive table header */}
      <div className="sticky top-[57px] z-20 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="grid grid-cols-12 gap-4 py-3 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            <div className="col-span-1">Drop</div>
            <div className="col-span-5">Piece</div>
            <div className="col-span-2 hidden md:block">Collection</div>
            <div className="col-span-2 hidden md:block">Date</div>
            <div className="col-span-2">Status</div>
          </div>
        </div>
      </div>

      {/* Archive rows */}
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="divide-y divide-border">
          {DROPS.map((d) => (
            <div key={d.id} className="group grid grid-cols-12 items-center gap-4 py-6 transition hover:bg-[color:var(--color-bone)] -mx-6 px-6">
              <div className="col-span-1 font-mono text-sm text-muted-foreground">#{d.id}</div>
              <div className="col-span-5 flex items-center gap-4">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-[color:var(--color-bone)]">
                  <img src={d.img} alt={d.name} className="h-full w-full object-cover" />
                  {d.status === "sold_out" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Lock className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold">{d.name}</div>
                  <div className="eyebrow mt-0.5">{d.edition} editions</div>
                </div>
              </div>
              <div className="col-span-2 hidden font-mono text-xs text-muted-foreground md:block">{d.collection}</div>
              <div className="col-span-2 hidden font-mono text-xs text-muted-foreground md:block">{d.date}</div>
              <div className="col-span-2 flex items-center justify-between">
                <div>
                  {d.status === "available" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-neon)]/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-neon)]" />
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      Sold Out
                    </span>
                  )}
                </div>
                {d.status === "available" ? (
                  <Link
                    to="/product/$slug"
                    params={{ slug: "og-archive-oversized-hoodie" }}
                    className="hidden font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-electric)] link-underline group-hover:inline-block"
                  >
                    Shop →
                  </Link>
                ) : (
                  <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:inline-block">
                    {d.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manifesto strip */}
      <div className="border-t border-border bg-[color:var(--color-bone)]">
        <div className="mx-auto max-w-[1600px] px-6 py-16 text-center">
          <p className="font-display text-3xl uppercase leading-tight tracking-tight md:text-5xl">
            "Numbered, never restocked.<br />
            <span className="italic font-normal text-[color:var(--color-electric)]">That's the point.</span>"
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:opacity-80"
          >
            Get the current drop →
          </Link>
        </div>
      </div>
    </div>
  );
}
