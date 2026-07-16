import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Heart, Minus, Plus, RotateCw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useCart } from "@/contexts/cart";
import { incrementProductViews } from "@/lib/queries";

import hoodieFlat from "@/assets/product-hoodie-flat.jpg";
import mMaleSlimLight from "@/assets/model-male-slim-light.jpg";
import mMaleSlimMedium from "@/assets/model-male-slim-medium.jpg";
import mMaleSlimDeep from "@/assets/model-male-slim-deep.jpg";
import mMaleAthLight from "@/assets/model-male-athletic-light.jpg";
import mMaleAthMedium from "@/assets/model-male-athletic-medium.jpg";
import mMaleAthDeep from "@/assets/model-male-athletic-deep.jpg";
import mFemSlimLight from "@/assets/model-female-slim-light.jpg";
import mFemSlimMedium from "@/assets/model-female-slim-medium.jpg";
import mFemSlimDeep from "@/assets/model-female-slim-deep.jpg";
import mFemCurvyLight from "@/assets/model-female-curvy-light.jpg";
import mFemCurvyMedium from "@/assets/model-female-curvy-medium.jpg";
import mFemCurvyDeep from "@/assets/model-female-curvy-deep.jpg";
import productHoodie from "@/assets/product-hoodie.jpg";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({
    meta: [
      { title: "OG Archive Oversized Hoodie — OG CLOTHING" },
      {
        name: "description",
        content:
          "The OG Archive Oversized Hoodie in matte black. 500gsm heavyweight cotton. Preview the fit on your own body type with the AI Fit Preview.",
      },
    ],
  }),
  component: ProductPage,
});

type Gender = "male" | "female";
type Body = "slim" | "athletic" | "curvy";
type Skin = "light" | "medium" | "deep";

const IMAGES: Record<string, string> = {
  "male-slim-light": mMaleSlimLight,
  "male-slim-medium": mMaleSlimMedium,
  "male-slim-deep": mMaleSlimDeep,
  "male-athletic-light": mMaleAthLight,
  "male-athletic-medium": mMaleAthMedium,
  "male-athletic-deep": mMaleAthDeep,
  "female-slim-light": mFemSlimLight,
  "female-slim-medium": mFemSlimMedium,
  "female-slim-deep": mFemSlimDeep,
  "female-curvy-light": mFemCurvyLight,
  "female-curvy-medium": mFemCurvyMedium,
  "female-curvy-deep": mFemCurvyDeep,
};

const BODY_OPTIONS: Record<Gender, { id: Body; label: string }[]> = {
  male: [
    { id: "slim", label: "Slim" },
    { id: "athletic", label: "Athletic" },
  ],
  female: [
    { id: "slim", label: "Slim" },
    { id: "curvy", label: "Curvy" },
  ],
};

const SKIN_TONES: { id: Skin; label: string; hex: string }[] = [
  { id: "light", label: "Light", hex: "#f0d5b8" },
  { id: "medium", label: "Medium", hex: "#b47a52" },
  { id: "deep", label: "Deep", hex: "#4a2a1a" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { id: "matte", label: "Matte Black", hex: "#0a0a0a" },
  { id: "bone", label: "Bone White", hex: "#f2ede4" },
  { id: "electric", label: "Electric Blue", hex: "#3b52ff" },
  { id: "moss", label: "Moss", hex: "#2f3a24" },
];

const PRICE = 1299;
const ORIGINAL_PRICE = 1999;
const MEMBER_PRICE = 999;

function fitRecommendation(gender: Gender, body: Body): string {
  if (body === "athletic") return "L — true to size for a boxy drop shoulder";
  if (body === "curvy") return "L — size up for a roomy oversized fit";
  return gender === "female" ? "S — relaxed oversized fit" : "M — clean oversized fit";
}

function ProductPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { slug } = Route.useParams();

  const [gender, setGender] = useState<Gender>("male");
  const [body, setBody] = useState<Body>("athletic");
  const [skin, setSkin] = useState<Skin>("medium");
  const [size, setSize] = useState("L");
  const [color, setColor] = useState("matte");
  const [qty, setQty] = useState(1);
  const [switching, setSwitching] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    const valid = BODY_OPTIONS[gender].map((b) => b.id);
    if (!valid.includes(body)) setBody(valid[valid.length - 1]);
  }, [gender, body]);

  const currentKey = useMemo(() => `${gender}-${body}-${skin}`, [gender, body, skin]);

  useEffect(() => {
    setSwitching(true);
    const t = setTimeout(() => setSwitching(false), 450);
    return () => clearTimeout(t);
  }, [currentKey]);

  useEffect(() => {
    if (slug) incrementProductViews(slug);
  }, [slug]);

  const fit = fitRecommendation(gender, body);
  const selectedColor = colors.find((c) => c.id === color)!;

  function handleAddToCart() {
    addToCart({
      id: slug,
      name: "OG Archive Oversized Hoodie",
      price: PRICE,
      color: color,
      colorLabel: selectedColor.label,
      size,
      qty,
      image: productHoodie,
      slug,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  }

  return (
    <div className="bg-background text-foreground">
      {/* Breadcrumbs + Back */}
      <div className="mx-auto max-w-[1600px] px-6 pb-4 pt-6 flex items-center gap-4">
        <button
          onClick={() => navigate({ to: "/shop" })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition font-mono text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </button>
        <span className="text-muted-foreground/40 font-mono text-[10px]">/</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Shop / Core / Hoodies / <span className="text-foreground">OG Archive</span>
        </span>
      </div>

      <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-6 pb-16 md:grid-cols-12 lg:h-[calc(100vh-140px)]">
        {/* ─── LEFT · IMAGERY + FIT PREVIEW ─── */}
        <div className="md:col-span-7 lg:col-span-6 flex flex-col gap-4 overflow-y-auto overflow-x-hidden pb-8 no-scrollbar">
          <div className="relative">
            {/* Main visual */}
            <div className="relative aspect-[4/5] w-full max-h-[80vh] overflow-hidden rounded-lg bg-[color:var(--color-bone)] lg:max-h-none">
              {Object.entries(IMAGES).map(([key, src]) => (
                <img
                  key={key}
                  src={src}
                  alt={`OG Archive Oversized Hoodie previewed on a ${key.replaceAll("-", " ")} body`}
                  width={1024}
                  height={1280}
                  loading={key === "male-athletic-medium" ? "eager" : "lazy"}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                    key === currentKey
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
                AI Fit Preview
              </div>

              {/* Rendering overlay */}
              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                  switching ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-electric)]/10 via-transparent to-[color:var(--color-neon)]/10" />
                <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-transparent border-t-[color:var(--color-electric)]" />
              </div>

              {switching && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-background">
                  Rendering your fit…
                </div>
              )}
            </div>


            {/* Flat product shot (Hidden on desktop to save space) */}
            <div className="mt-4 hidden md:hidden grid-cols-2 gap-3 lg:hidden">
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
        <aside className="md:col-span-5 lg:col-span-6 flex flex-col max-h-full overflow-y-auto pr-2 pb-4 pt-4">
          <div>
            <div className="eyebrow">Core · 001 · Drop 018</div>
            <h1 className="mt-2 font-display text-4xl uppercase leading-none tracking-tight md:text-5xl">
              OG Archive<br />Oversized Hoodie.
            </h1>
            <div className="mt-3 flex items-baseline gap-3 flex-wrap">
              <span className="font-mono text-2xl">₹{PRICE.toLocaleString("en-IN")}</span>
              <span className="font-mono text-xs text-muted-foreground line-through">₹{ORIGINAL_PRICE.toLocaleString("en-IN")}</span>
              <span className="rounded-full bg-[color:var(--color-neon)]/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground">
                Members ₹{MEMBER_PRICE.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              A brutalist take on the classic hood. Double-lined hood, boxy oversized silhouette,
              signature back embroidery. Made in a run of 500. Numbered, never restocked.
            </p>

            {/* ─── PREVIEW ON YOU (Moved to right column) ─── */}
            <div className="mt-6 rounded-xl border border-[color:var(--color-electric)]/30 bg-[color:var(--color-electric)]/5 p-4 z-10 shrink-0">
              <div className="mb-4 flex items-center justify-between">
                <div className="eyebrow flex items-center gap-2 text-[color:var(--color-electric)]">
                  <Sparkles className="h-3 w-3" /> Virtual Fit Preview
                </div>
              </div>

              <FieldRow label="Body">
                <Segmented
                  value={gender}
                  onChange={(v) => setGender(v as Gender)}
                  options={[
                    { id: "male", label: "Masculine" },
                    { id: "female", label: "Feminine" },
                  ]}
                />
              </FieldRow>

              <FieldRow label="Build">
                <Segmented
                  value={body}
                  onChange={(v) => setBody(v as Body)}
                  options={BODY_OPTIONS[gender]}
                />
              </FieldRow>

              <FieldRow label="Skin tone">
                <div className="flex gap-2">
                  {SKIN_TONES.map((t) => {
                    const active = t.id === skin;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSkin(t.id)}
                        aria-label={t.label}
                        aria-pressed={active}
                        className={`flex items-center gap-2 rounded-full border px-2 py-1 pr-3 text-xs transition ${
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground/60 bg-background"
                        }`}
                      >
                        <span
                          className="h-5 w-5 rounded-full border border-black/10"
                          style={{ background: t.hex }}
                        />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </FieldRow>

              <p className="mt-3 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Settings instantly reflect on the main image.
              </p>
            </div>

            {/* Color */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <div className="eyebrow">Color</div>
                <div className="text-xs">{selectedColor.label}</div>
              </div>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    aria-label={c.label}
                    className={`h-7 w-7 rounded-full border-2 transition ${
                      color === c.id ? "border-foreground scale-110" : "border-border hover:border-foreground/50"
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
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
                      className={`h-9 rounded-md border text-xs font-semibold transition ${
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
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-electric)]">
                AI fit tip: recommend {fit}.
              </p>
            </div>

            {/* Qty + CTA */}
            <div className="mt-5 flex items-stretch gap-3">
              <div className="flex items-center overflow-hidden rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm font-semibold tabular-nums">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`group flex flex-1 items-center justify-center gap-3 rounded-full py-2 text-sm font-semibold transition ${
                  addedToCart
                    ? "bg-[color:var(--color-neon)]/20 text-foreground border border-[color:var(--color-neon)]"
                    : "bg-foreground text-background hover:gap-4"
                }`}
              >
                {addedToCart ? (
                  "Added to bag ✓"
                ) : (
                  <>
                    Add to bag — ₹{(PRICE * qty).toLocaleString("en-IN")}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
                  </>
                )}
              </button>
              <button
                aria-label="Wishlist"
                onClick={() => setWishlist((w) => !w)}
                className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                  wishlist ? "border-red-400 bg-red-50 text-red-500" : "border-border hover:border-foreground"
                }`}
              >
                <Heart className={`h-4 w-4 ${wishlist ? "fill-red-500 stroke-red-500" : ""}`} />
              </button>
            </div>

            {/* Perks */}
            <ul className="mt-4 grid grid-cols-1 gap-1.5 text-xs">
              <Perk icon={<Truck className="h-3.5 w-3.5" />}>Free express shipping over ₹1,500 · arrives Fri</Perk>
              <Perk icon={<RotateCw className="h-3.5 w-3.5" />}>30-day free returns · worldwide</Perk>
              <Perk icon={<ShieldCheck className="h-3.5 w-3.5" />}>Numbered piece · authenticity chip embedded</Perk>
            </ul>

            {/* Detail accordion */}
            <div className="mt-6 divide-y divide-border border-y border-border">
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

/* ─────── Helpers ─────── */
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-full border border-border p-0.5">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        );
      })}
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
