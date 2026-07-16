import { Link } from "@tanstack/react-router";

const FOOTER_COLS = [
  { title: "Structure", items: ["Story", "Shipping", "Contact"] },
  { title: "Legal", items: ["Privacy", "Terms", "Cookies"] },
  { title: "Community", items: ["Instagram", "Twitter", "Discord"] },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-10 px-6 py-16 md:grid-cols-5">
        <div className="col-span-2">
          <Link to="/" className="font-display text-4xl uppercase hover:text-[color:var(--color-electric)] transition">OG</Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            High-end structural apparel at the intersection of fashion and industrial culture.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Prices in INR · Made in limited runs
          </p>
        </div>
        {FOOTER_COLS.map((c) => (
          <div key={c.title}>
            <div className="eyebrow mb-4">{c.title}</div>
            <ul className="space-y-2 text-sm">
              {c.items.map((i) => (
                <li key={i}>
                  <a href="#" className="link-underline text-muted-foreground hover:text-foreground transition">
                    {i}
                  </a>
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
