import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";

import productHoodie from "@/assets/product-hoodie.jpg";
import productCargo from "@/assets/product-cargo.jpg";
import productJersey from "@/assets/product-jersey.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — OG CLOTHING" },
      { name: "description", content: "Shop all OG Clothing drops. Oversized essentials, utility pieces, and limited editions." },
    ],
  }),
  component: ShopPage,
});

const ALL_PRODUCTS = [
  { id: "1", name: "OG Archive Oversized Hoodie", slug: "og-archive-oversized-hoodie", price: 1299, originalPrice: 1999, tag: "Core / 001", category: "Outerwear", img: productHoodie, isNew: true, colors: ["#0a0a0a", "#f2ede4", "#3b52ff", "#2f3a24"] },
  { id: "2", name: "Cargo-X Field Trouser", slug: "cargo-x-field-trouser", price: 1799, originalPrice: 2499, tag: "Utility / 04", category: "Denim", img: productCargo, isNew: false, colors: ["#0a0a0a", "#2f3a24"] },
  { id: "3", name: "Terrace Knit Vest", slug: "terrace-knit-vest", price: 999, originalPrice: 1499, tag: "Terrace / 07", category: "Knitwear", img: productJersey, isNew: true, colors: ["#0a0a0a", "#f2ede4", "#3b52ff"] },
  { id: "4", name: "Vanguard Technical Parka", slug: "vanguard-technical-parka", price: 1899, originalPrice: 2799, tag: "Core / 001", category: "Outerwear", img: productHoodie, isNew: false, colors: ["#0a0a0a"] },
  { id: "5", name: "OG Stadium Jersey", slug: "og-stadium-jersey", price: 1199, originalPrice: 1699, tag: "FIFA'26 / 01", category: "Football", img: productJersey, isNew: true, colors: ["#0a0a0a", "#3b52ff", "#ffffff"] },
  { id: "6", name: "Archive Crewneck", slug: "archive-crewneck", price: 1099, originalPrice: 1599, tag: "Core / 002", category: "Knitwear", img: productHoodie, isNew: false, colors: ["#0a0a0a", "#f2ede4"] },
  { id: "7", name: "Utility Cargo Short", slug: "utility-cargo-short", price: 899, originalPrice: 1299, tag: "Utility / 05", category: "Denim", img: productCargo, isNew: false, colors: ["#0a0a0a", "#2f3a24"] },
  { id: "8", name: "OG Coach Jacket", slug: "og-coach-jacket", price: 1699, originalPrice: 2299, tag: "Core / 003", category: "Outerwear", img: productHoodie, isNew: true, colors: ["#0a0a0a", "#2f3a24", "#3b52ff"] },
];

const CATEGORIES = ["All", "Outerwear", "Knitwear", "Denim", "Football", "Accessories", "Footwear"];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ALL_PRODUCTS
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => p.price <= maxPrice)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Newest") return b.id.localeCompare(a.id);
      return 0;
    });

  return (
    <div className="bg-background text-foreground">
      {/* Page header */}
      <div className="border-b border-border bg-[color:var(--color-bone)]">
        <div className="mx-auto max-w-[1600px] px-6 py-12">
          <div className="eyebrow mb-2">All Products</div>
          <h1 className="font-display text-5xl uppercase tracking-tight md:text-7xl">Shop.</h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            {filtered.length} pieces available · Limited runs · Numbered · Never restocked
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[57px] z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 overflow-x-auto px-6 py-3 scrollbar-none">
          {/* Categories */}
          <div className="flex items-center gap-2 shrink-0">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition ${
                  activeCategory === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 shrink-0">
            {/* Search */}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 rounded-full border border-border bg-transparent px-4 text-xs outline-none focus:border-foreground"
            />

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 rounded-full border border-border bg-transparent px-3 font-mono text-[10px] uppercase tracking-widest outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>

            {/* Filter panel toggle */}
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition hover:border-foreground"
            >
              <SlidersHorizontal className="h-3 w-3" />
              Filter
            </button>
          </div>
        </div>

        {/* Expanded filter panel */}
        {filterOpen && (
          <div className="border-t border-border bg-background px-6 py-4">
            <div className="mx-auto max-w-[1600px] flex items-center gap-8">
              <div className="flex flex-col gap-2">
                <label className="eyebrow">Max Price: ₹{maxPrice.toLocaleString("en-IN")}</label>
                <input
                  type="range"
                  min={800}
                  max={2000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-48 accent-foreground"
                />
                <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                  <span>₹800</span><span>₹2,000</span>
                </div>
              </div>
              <button
                onClick={() => { setMaxPrice(2000); setActiveCategory("All"); setSearchQuery(""); setSortBy("Featured"); setFilterOpen(false); }}
                className="ml-auto flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-foreground hover:text-foreground transition"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-[1600px] px-6 py-12">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Filter className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-2xl uppercase">No results</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters</p>
            <button
              onClick={() => { setActiveCategory("All"); setMaxPrice(2000); setSearchQuery(""); }}
              className="mt-6 rounded-full border border-border px-6 py-2 text-sm transition hover:bg-foreground hover:text-background"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[color:var(--color-bone)]">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  {p.isNew && (
                    <div className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[9px] uppercase tracking-widest text-background">
                      New
                    </div>
                  )}
                  {p.originalPrice && (
                    <div className="absolute right-3 top-3 rounded-full bg-[color:var(--color-neon)]/90 px-2.5 py-1 text-[9px] uppercase tracking-widest text-foreground font-mono">
                      -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                    </div>
                  )}
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute inset-x-3 bottom-3 translate-y-4 rounded-full bg-background/95 py-2.5 text-xs font-medium opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    Quick view
                  </button>
                </div>

                {/* Color dots */}
                <div className="mt-2 flex gap-1">
                  {p.colors.map((hex) => (
                    <span key={hex} className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ background: hex }} />
                  ))}
                </div>

                <div className="mt-1 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="eyebrow">{p.tag}</div>
                    <h3 className="mt-0.5 truncate text-sm font-semibold">{p.name}</h3>
                  </div>
                  <div className="ml-2 shrink-0 text-right">
                    <div className="font-mono text-sm">₹{p.price.toLocaleString("en-IN")}</div>
                    <div className="font-mono text-[10px] text-muted-foreground line-through">₹{p.originalPrice.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
